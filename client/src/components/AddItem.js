import React, { useState } from 'react';

function AddItem({ collectionId, onItemAdded }) {
    const [content, setContent] = useState('');
    const [type, setType] = useState('text'); // Default type is 'text'

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) {
            alert('Please enter content for the item.');
            return;
        }

        try {
            await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    collection_id: collectionId,
                    type,
                    content,
                }),
            });

            // Clear the form and refresh the list
            setContent('');
            onItemAdded();
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
            <h3>Add a New Item</h3>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="text">Text</option>
                <option value="image_url">Image URL</option>
                <option value="youtube_url">YouTube URL</option>
            </select>
            <input
                type="text"
                placeholder="Enter content (text or URL)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ marginLeft: '10px' }}
            />
            <button type="submit" style={{ marginLeft: '10px' }}>
                Add Item
            </button>
        </form>
    );
}

export default AddItem;