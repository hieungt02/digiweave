const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    try {
        // item_id is optional
        const { collection_id, item_id, content } = req.body;
        const newAnnotation = await pool.query(
            `INSERT INTO annotations (collection_id, item_id, content) 
             VALUES ($1, $2, $3) RETURNING *`,
            [collection_id, item_id, content]
        );
        res.json(newAnnotation.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// UPDATE an annotation
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const updateAnnotation = await pool.query(
            'UPDATE annotations SET content = $1 WHERE id = $2 RETURNING *',
            [content, id]
        );
        if (updateAnnotation.rowCount === 0) {
            return res.status(404).json("Annotation not found.");
        }
        res.json(updateAnnotation.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// DELETE an annotation
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteAnnotation = await pool.query(
            'DELETE FROM annotations WHERE id = $1',
            [id]
        );
        if (deleteAnnotation.rowCount === 0) {
            return res.status(404).json("Annotation not found.");
        }
        res.json("Annotation was deleted.");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;