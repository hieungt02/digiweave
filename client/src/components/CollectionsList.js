import React, { useState, useEffect, useCallback } from 'react';
import AddCollection from './AddCollection';
import { Link } from 'react-router-dom';

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

    // Our new delete handler
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
                        <button onClick={() => handleDelete(collection.id)} style={{ marginLeft: '10px' }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CollectionsList;