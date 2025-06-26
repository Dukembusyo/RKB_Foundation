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

module.exports = pool.promise();
