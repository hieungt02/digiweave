import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import Modal from 'react-modal'
import DraggableItem from './DraggableItem';
import AddItem from './AddItem';
import DraggableAnnotation from './DraggableAnnotation';
import AddAnnotation from './AddAnnotation'; // Import the AddAnnotation form
import { ItemTypes as AnnotationItemTypes } from './DraggableAnnotation';

import { FaPlus } from 'react-icons/fa';

Modal.setAppElement('#root');

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    

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

    // --- Inside your CollectionView.js component ---

    const [, drop] = useDrop(() => ({
        accept: [ItemTypes.ITEM, AnnotationItemTypes.ANNOTATION],
        async drop(item, monitor) {
            // --- NEW, MORE PRECISE LOGIC ---
            
            // 1. Get all the necessary coordinates from the monitor
            const initialClientOffset = monitor.getInitialClientOffset(); // Where the drag started on the screen
            const initialSourceOffset = monitor.getInitialSourceClientOffset(); // The top-left corner of the item when drag started
            const finalClientOffset = monitor.getClientOffset(); // The final cursor position on the screen

            if (!initialClientOffset || !finalClientOffset || !initialSourceOffset || !canvasRef.current) {
                return; // Exit if we don't have the info we need
            }

            // 2. Calculate the offset of the click within the item
            const clickOffsetInItem = {
                x: initialClientOffset.x - initialSourceOffset.x,
                y: initialClientOffset.y - initialSourceOffset.y,
            };

            // 3. Get the canvas's position on the page
            const canvasRect = canvasRef.current.getBoundingClientRect();

            // 4. Calculate the item's new top-left position by subtracting the click offset
            const left = Math.round(finalClientOffset.x - canvasRect.left - clickOffsetInItem.x);
            const top = Math.round(finalClientOffset.y - canvasRect.top - clickOffsetInItem.y);

            const type = monitor.getItemType();

            // 5. Update state and call the API with the corrected coordinates
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
        },
    }), [moveItem, moveAnnotation]);

// ... rest of your CollectionView component
    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    const handleFormSubmit = () => {
        fetchData();  // Refresh the data
        closeModal(); // Close the modal
    };


    return (
        <div>
            <div className="canvas-header">
                <Link to="/">&larr; Back to all collections</Link>
                <div style={{ margin: '20px 0' }}>
                    <button onClick={() => openModal('item')}><FaPlus />Add Item</button>
                    <button onClick={() => openModal('annotation')} style={{ marginLeft: '10px' }}>Add Annotation +</button>
                </div>
            </div>
            <h2>Collection Canvas 🎨</h2>
            <div ref={canvasRef} className="canvas-container">
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
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Add New"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 999 //Ensure overlay is on top of canvas
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000
                    },
                }}
            >
                {modalContent === 'item' && (
                    <AddItem collectionId={id} onItemAdded={handleFormSubmit} />
                )}
                {modalContent === 'annotation' && (
                    <AddAnnotation collectionId={id} onAnnotationAdded={handleFormSubmit} />
                )}
                <button onClick={closeModal} style={{ marginTop: '10px' }}>Close</button>
            </Modal>            
        </div>
    );
}

export default CollectionView;