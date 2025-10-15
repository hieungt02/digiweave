import React, { useState } from 'react';

function AddCollection({ onCollectionAdded }) {
    // Create a state variable to hold the text from the input field
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        // Prevent the default form submission which reloads the page
        e.preventDefault();

        // Simple validation to ensure the name isn't empty
        if (!name) {
            alert('Please enter a collection name.');
            return;
        }

        try {
            // Make a POST request to our API
            const response = await fetch('/api/collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                throw new Error('Failed to create collection');
            }

            // Clear the input field after successful submission
            setName('');
            // Call the function passed from the parent to refresh the list
            onCollectionAdded();

        } catch (error) {
            console.error("Error creating collection:", error);
            alert("Error creating collection.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create a New Collection</h3>
            <input
                type="text"
                placeholder="Enter collection name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">Add Collection</button>
        </form>
    );
}

export default AddCollection;