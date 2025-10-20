import React, { useState } from 'react';

function AddAnnotation({ collectionId, onAnnotationAdded }) {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) {
            alert('Please enter some content for the annotation.');
            return;
        }

        try {
            await fetch('/api/annotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    collection_id: collectionId,
                    content,
                    // We omit 'item_id' here, so the backend saves it as NULL
                }),
            });

            // Clear the form and refresh the list
            setContent('');
            onAnnotationAdded();

        } catch (error) {
            console.error("Error adding annotation:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
            <textarea
                placeholder="Add a general note to this collection..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"
                style={{ width: '300px' }}
            />
            <br />
            <button type="submit" style={{ marginTop: '5px' }}>
                Add Annotation
            </button>
        </form>
    );
}

export default AddAnnotation;