//Import Express
const express = require('express');
//Import database connection poo
const pool = require('./db');


//Create an instance of an Express app
const app = express();
app.use(express.json());

//Define the port the server will run on
//3001 to avoid conflight with React default port 3000
const PORT = 3001;

//Create a basic test route
//tells our server how to respond when someone visits http://localhost/3001/

//ROUTES:
//Any request to /api/collections will be handled by our collections router
app.use('/api/collections', require('./routes/collections'));

//Any request to /api/items will be handled by our items router
app.use('/api/items', require('./routes/items'));

//Any request to /api/annotations will be handleds by router
app.use('/api/annotations', require('./routes/annotations'));


app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

//New route to test database connection
app.get('/db-test', async (req, res) => {
    try {
        //const result = await pool.query('SELECT NOW()'); //Simple query to get the current time
        const result = await pool.query(
            "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"
        );
        res.json(result.rows); //Send the query result back as JSON
    } catch (err) {
        console.error(err);
        res.status(500). send('Error connecting to the database');
    }
});

//Make server listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

