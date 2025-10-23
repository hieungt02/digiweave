import React, { useState, useEffect, useCallback } from 'react';
import AddCollection from './AddCollection';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

function CollectionsList() {
    const [collections, setCollections] = useState([]);

    const fetchCollections = useCallback(async () => {
        try {
            const response = await fetch('/api/collections');
            const data = await response.json();
            setCollections(data);
        } catch (error) {
            console.error("Failed to fetch collections:", error);
        }
    }, []);

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    // --- NEW: Function to handle updating a collection ---
    const handleUpdateCollection = async (collection) => {
        const newName = window.prompt("Enter new name for the collection:", collection.name);

        // Proceed only if the user entered a new name that's different
        if (newName && newName !== collection.name) {
            try {
                await fetch(`/api/collections/${collection.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newName }),
                });
                // Refresh the list to show the new name
                fetchCollections();
            } catch (error) {
                console.error("Failed to update collection:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this collection?')) {
            try {
                await fetch(`/api/collections/${id}`, {
                    method: 'DELETE',
                });
                fetchCollections();
            } catch (error) {
                console.error("Failed to delete collection:", error);
            }
        }
    };

    return (
        <div>
            <AddCollection onCollectionAdded={fetchCollections} />
            <hr />
            <h2>My Collections</h2>
            <ul>
                {collections.map(collection => (
                    <li key={collection.id}>
                        <Link to={`/collections/${collection.id}`}>
                            {collection.name}
                        </Link>
                        <div style={{ marginLeft: '10px', display: 'inline-block' }}>
                            {/* --- NEW: The Edit button --- */}
                            <button onClick={() => handleUpdateCollection(collection)} 
                                className="icon-button">
                                <FaPencilAlt />
                            </button>
                            <button onClick={() => handleDelete(collection.id)}
                                className="icon-button">
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CollectionsList;