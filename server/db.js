//Import pool class from the 'pg' library
const { Pool } = require('pg');

//Create a new pool instance
const pool = new Pool( {
    user: 'postgres',
    host: 'localhost',
    database: 'canvas_db',
    password: '0332191368',
    port: 5432,
});

//export pool so we can use in other files:
module.exports = pool;