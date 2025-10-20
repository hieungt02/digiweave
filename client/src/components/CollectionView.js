import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItem';
import AddItem from './AddItem';
import DraggableAnnotation from './DraggableAnnotation';
// 1. Import the ItemTypes from both draggable components
import { ItemTypes as AnnotationItemTypes } from './DraggableAnnotation';

const ItemTypes = {
  ITEM: 'item',
};

function CollectionView() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [annotations, setAnnotations] = useState([]);
    const canvasRef = useRef(null);

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

    const moveItem = useCallback((itemId, left, top) => {
        setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, position_x: left, position_y: top } : item)));
    }, []);

    // 2. Create a new move function for annotations
    const moveAnnotation = useCallback((annotationId, left, top) => {
        setAnnotations((prev) => prev.map((ann) => (ann.id === annotationId ? { ...ann, position_x: left, position_y: top } : ann)));
    }, []);

    // 3. Update the useDrop hook
    const [, drop] = useDrop(() => ({
        // It now accepts an array of types
        accept: [ItemTypes.ITEM, AnnotationItemTypes.ANNOTATION],
        async drop(item, monitor) {
            const clientOffset = monitor.getClientOffset();
            if (clientOffset && canvasRef.current) {
                const canvasRect = canvasRef.current.getBoundingClientRect();
                const left = Math.round(clientOffset.x - canvasRect.left);
                const top = Math.round(clientOffset.y - canvasRect.top);
                const type = monitor.getItemType(); // Get the type of the dropped item

                // Use the type to call the correct function and API endpoint
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
            <hr />
            <h2>Collection Canvas 🎨</h2>
            <div ref={canvasRef} style={{ position: 'relative', width: '100%', height: '500px', border: '1px solid black', backgroundColor: '#f0f0f0' }}>
                <div ref={drop} style={{ width: '100%', height: '100%' }}>
                    {items.map((item) => (
                        <DraggableItem key={`item-${item.id}`} item={item} />
                    ))}
                    {annotations.map((annotation) => (
                        <DraggableAnnotation key={`annotation-${annotation.id}`} annotation={annotation} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CollectionView;