import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItem';
import AddItem from './AddItem';
import DraggableAnnotation from './DraggableAnnotation';
import AddAnnotation from './AddAnnotation'; // Import the AddAnnotation form
import { ItemTypes as AnnotationItemTypes } from './DraggableAnnotation';

const ItemTypes = {
  ITEM: 'item',
};

function CollectionView() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [annotations, setAnnotations] = useState([]);
    const canvasRef = useRef(null);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [annotatingItemId, setAnnotatingItemId] = useState(null);
    const [newAnnotationText, setNewAnnotationText] = useState('');
    

    const fetchData = useCallback(async () => {
        try {
            const itemsRes = await fetch(`/api/collections/${id}/items`);
            setItems(await itemsRes.json());
            const annotationsRes = await fetch(`/api/collections/${id}/annotations`);
            setAnnotations(await annotationsRes.json());
        } catch (err) {
            console.error("Failed to fetch data:", err);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Item Handlers ---
    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
            fetchData();
        }
    };
    const handleEditItem = async (item) => {
        const newContent = window.prompt("Enter new content:", item.content);
        if (newContent && newContent !== item.content) {
            await fetch(`/api/items/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent }),
            });
            fetchData();
        }
    };

    // --- Annotation Handlers ---
    const handleDeleteAnnotation = async (annotationId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            await fetch(`/api/annotations/${annotationId}`, { method: 'DELETE' });
            fetchData();
        }
    };
    const handleEditAnnotation = async (annotation) => {
        const newContent = window.prompt("Enter new content for the note:", annotation.content);
        if (newContent && newContent !== annotation.content) {
            await fetch(`/api/annotations/${annotation.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent }),
            });
            fetchData();
        }
    };
    const handleAddItemAnnotation = async (itemId) => {
        if (!newAnnotationText) return;
        await fetch('/api/annotations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection_id: id,
                item_id: itemId,
                content: newAnnotationText,
            }),
        });
        setAnnotatingItemId(null);
        setNewAnnotationText('');
        fetchData();
    };


    // --- Drag and Drop Logic ---
    const moveItem = useCallback((itemId, left, top) => {
        setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, position_x: left, position_y: top } : item)));
    }, []);

    const moveAnnotation = useCallback((annotationId, left, top) => {
        setAnnotations((prev) => prev.map((ann) => (ann.id === annotationId ? { ...ann, position_x: left, position_y: top } : ann)));
    }, []);

    const [, drop] = useDrop(() => ({
        // This 'accept' property was missing from your code
        accept: [ItemTypes.ITEM, AnnotationItemTypes.ANNOTATION],
        async drop(item, monitor) {
            const clientOffset = monitor.getClientOffset();
            if (clientOffset && canvasRef.current) {
                const canvasRect = canvasRef.current.getBoundingClientRect();
                const left = Math.round(clientOffset.x - canvasRect.left);
                const top = Math.round(clientOffset.y - canvasRect.top);
                const type = monitor.getItemType();

                if (type === ItemTypes.ITEM) {
                    moveItem(item.id, left, top);
                    await fetch(`/api/items/${item.id}/position`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ position_x: left, position_y: top }),
                    });
                } else if (type === AnnotationItemTypes.ANNOTATION) {
                    moveAnnotation(item.id, left, top);
                    await fetch(`/api/annotations/${item.id}/position`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ position_x: left, position_y: top }),
                    });
                }
            }
            return undefined;
        },
    }), [moveItem, moveAnnotation]);


    return (
        <div>
            <Link to="/">&larr; Back to all collections</Link>
            <AddItem collectionId={id} onItemAdded={fetchData} />
            <AddAnnotation collectionId={id} onAnnotationAdded={fetchData} />
            <hr />
            <h2>Collection Canvas 🎨</h2>
            <div ref={canvasRef} style={{ position: 'relative', width: '100%', height: '500px', border: '1px solid black', backgroundColor: '#f0f0f0' }}>
                <div ref={drop} style={{ width: '100%', height: '100%' }}>
                    {items.map((item) => (
                        <div key={`item-wrapper-${item.id}`}>
                            <DraggableItem
                                item={item}
                                onDeleteItem={handleDeleteItem}
                                onEditItem={handleEditItem}
                                hoveredItemId={hoveredItemId}      // Pass the state
                                setHoveredItemId={setHoveredItemId}  // Pass the setter function
                            />
                            {/* Logic to add notes to this specific item */}
                            <div style={{ position: 'absolute', left: item.position_x, top: item.position_y - 30, zIndex: 20 }}>
                                {annotatingItemId === item.id ? (
                                    <>
                                        <input type="text" value={newAnnotationText} onChange={(e) => setNewAnnotationText(e.target.value)} placeholder="Add note..." />
                                        <button onClick={() => handleAddItemAnnotation(item.id)}>Save</button>
                                        <button onClick={() => setAnnotatingItemId(null)}>X</button>
                                    </>
                                ) : (
                                    <button onClick={() => setAnnotatingItemId(item.id)}>Add Note +</button>
                                )}
                            </div>
                        </div>
                    ))}
                    {annotations.map((annotation) => (
                        <DraggableAnnotation
                            key={`annotation-${annotation.id}`}
                            annotation={annotation}
                            onDeleteAnnotation={handleDeleteAnnotation}
                            onEditAnnotation={handleEditAnnotation}
                            hoveredItemId={hoveredItemId} // Pass the state
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CollectionView;