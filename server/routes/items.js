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

//PUT: Update an item



//DELETE: Delete an item


module.exports = router;