//Import Express
const express = require('express');

//Create an instance of an Express app
const app = express();

//Define the port the server will run on
//3001 to avoid conflight with React default port 3000
const PORT = 3001;

//Create a basic test route
//tells our server how to respond when someone visits http://localhost/3001/

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

//Make server listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

