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

//change name of a collection
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

//delete a collection
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteCollection = await pool.query(
            "DELETE FROM collections WHERE id = $1", [id]
        );

        if (deleteCollection.rowCount === 0) {
            return res.status(404).send("Collection not found.");
        }
        res.json("Collection successfully deleted!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//get all items in a collection
router.get("/:id/items", async (req, res) => {
    try {
        const { id } = req.params;
        const allItems = await pool.query(
            "SELECT * FROM items WHERE collection_id = $1", [id]
        );
        res.json(allItems.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


//Get all annotations in a specific collection
router.get("/:id/annotations", async (req, res) => {
    try {
        const { id } = req.params;
        const allAnnotations = await pool.query(
            "SELECT * FROM annotations WHERE collection_id = $1",
            [id]
        );
        res.json(allAnnotations.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;