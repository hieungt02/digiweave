const express = require('express');
const router = express.Router();
const pool = require('../db'); // Note the ../ to go up one directory

//POST: Add an item to a collection
router.post("/", async (req, res) => {
    try {
        const { collection_id, type, content } = req.body;
        const newItem = await pool.query (
            "INSERT INTO items (collection_id, type, content) VALUES ($1, $2, $3) RETURNING *",
            [collection_id, type, content]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// PUT: Update an item
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body; // For now, we'll just allow updating the content

        const updateItem = await pool.query(
            "UPDATE items SET content = $1 WHERE id = $2 RETURNING *",
            [content, id]
        );

        if (updateItem.rowCount === 0) {
            return res.status(404).json("Item not found.");
        }

        res.json(updateItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//PUT: Update an item's position
router.put("/:id/position", async (req, res) => {
    try {
        const { id } = req.params;
        const { position_x, position_y } = req.body; // Get coordinates from request body

        const updateItemPosition = await pool.query(
            "UPDATE items SET position_x = $1, position_y = $2 WHERE id = $3 RETURNING *",
            [position_x, position_y, id]
        );

        if (updateItemPosition.rowCount === 0) {
            return res.status(404).json("Item not found.");
        }

        res.json(updateItemPosition.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//DELETE: Delete an item
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteItem = await pool.query(
            "DELETE FROM items WHERE id = $1",
            [id]
        );

        if (deleteItem.rowCount === 0) {
            return res.status(404).json("Item not found.");
        }

        res.json("Item was deleted!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;