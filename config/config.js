const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();
const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT} = process.env;

// Create MySQL connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  ssl: {
    ca: fs.readFileSync('./certs/ca.pem')
  },
  connectionLimit: 10
});

// Handle connection errors and retries
function handleConnectionError() {
  pool.on('error', (err) => {
    console.error('MySQL Connection Error: ', err);
    if (err.code === 'ECONNRESET' || err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Attempting to reconnect to the database...');
      setTimeout(handleConnectionError, 6000); // Retry after 3 seconds
    } else {
      console.error('Database error:', err);
    }
  });
}

// Start the connection error handling
handleConnectionError();

module.exports = pool.promise();
