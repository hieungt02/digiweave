import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import AddItem from './AddItem'; //import AddItem

function CollectionView() {
    // 1. 'useParams' gets the { id: '...' } object from the URL.
    const { id } = useParams(); 

    // 2. State to hold the items for this collection.
    const [items, setItems] = useState([]);

    const [annotations, setAnnotations] = useState([]); // New state for annotations
    const [editingItem, setEditingItem] = useState(null); // Holds the item object being edited
    const [editText, setEditText] = useState(''); // Holds the text for the edit input field

    const fetchData = useCallback(async () => {
        try {
            // Fetch both items and annotations
            const itemsResponse = await fetch(`/api/collections/${id}/items`);
            const itemsData = await itemsResponse.json();
            setItems(itemsData);

            const annotationsResponse = await fetch(`/api/collections/${id}/annotations`);
            const annotationsData = await annotationsResponse.json();
            setAnnotations(annotationsData);

        } catch (err) {
            console.error("Failed to fetch data:", err);
        }
    }, [id]);

    // useEffect now calls our fetchItems function
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // New function to handle deleting an item
    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                // We need to build the full API path for the item
                await fetch(`/api/items/${itemId}`, {
                    method: 'DELETE',
                });
                // Refresh the list after deleting
                fetchData();
            } catch (error) {
                console.error("Failed to delete item:", error);
            }
        }
    };

    // When a user clicks "Edit", set the state to enter 'edit mode'
    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditText(item.content);
    };

    // When a user clicks "Save", send the update to the API
    const handleUpdateItem = async (itemId) => {
        try {
            await fetch(`/api/items/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editText }),
            });
        
            // Exit 'edit mode' and refresh the items list
            setEditingItem(null);
            fetchData();

        } catch (error) {
            console.error("Failed to update item:", error);
        }
    };    

    return (
        <div>
            <Link to="/">&larr; Back to all collections</Link>
            <AddItem collectionId={id} onItemAdded={fetchData} />
            <hr />

            <h2>Collection Items</h2>
            {items.length > 0 ? (
                <ul>
                    {items.map(item => (
                        <li key={item.id} style={{ marginBottom: '15px' }}>
                            {/* Item rendering logic remains the same */}
                            {editingItem && editingItem.id === item.id ? (
                                <>
                                    <input 
                                        type="text" 
                                        value={editText} 
                                        onChange={(e) => setEditText(e.target.value)} 
                                    />
                                    <button onClick={() => handleUpdateItem(item.id)} style={{ marginLeft: '10px' }}>Save</button>
                                </>
                            ) : (
                                <>
                                    {item.content} ({item.type})
                                    <button onClick={() => handleEditClick(item)} style={{ marginLeft: '10px' }}>Edit ✏️</button>
                                    <button onClick={() => handleDeleteItem(item.id)} style={{ marginLeft: '10px' }}>Delete</button>
                                </>
                            )}

                            {/* New: Display annotations specific to THIS item */}
                            <ul style={{ marginTop: '5px' }}>
                                {annotations
                                    .filter(annotation => annotation.item_id === item.id)
                                    .map(itemAnnotation => (
                                        <li key={itemAnnotation.id}>
                                            <em style={{ color: '#555' }}>- {itemAnnotation.content}</em>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items in this collection yet. Add one above!</p>
            )}

            <hr />

            {/* New: Display ONLY free-floating annotations */}
            <h2>General Annotations ✍️</h2>
            {annotations.filter(a => a.item_id === null).length > 0 ? (
                <ul>
                    {annotations
                        .filter(annotation => annotation.item_id === null)
                        .map(collectionAnnotation => (
                            <li key={collectionAnnotation.id}>
                                {collectionAnnotation.content}
                            </li>
                        ))
                    }
                </ul>
            ) : (
                <p>No general annotations in this collection yet.</p>
            )}
        </div>
    );

}

export default CollectionView;