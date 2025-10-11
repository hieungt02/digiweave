const express = require('express');
const router = express.Router();
const pool = require('../db'); // Note the ../ to go up one directory

// GET all collections for a user
router.get("/", async (req, res) => {
    try {
        const userId = 1;
        const allCollections = await pool.query(
            "SELECT * FROM collections WHERE user_id = $1",
            [userId]
        );
        res.json(allCollections.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// CREATE a new collection
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const userId = 1;
        const newCollection = await pool.query(
            "INSERT INTO collections (name, user_id) VALUES($1, $2) RETURNING *",
            [name, userId]
        );
        res.json(newCollection.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const updateCollection = await pool.query(
            "UPDATE collections SET name = $1 WHERE id = $2 RETURNING *", [name, id]
        );
        //add RETURNING to make API more powerful
        
        if (updateCollection.rowCount === 0) {
            return res.status(404).send("Collection not found");
        }
        res.json(updateCollection.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;