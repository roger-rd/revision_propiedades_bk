// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
  
// });


// module.exports = pool

// config/bd_revision_casa.js
const { Pool } = require('pg');

const isDbUrl = !!process.env.DATABASE_URL;
const pool = new Pool(
  isDbUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Railway Postgres
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      }
);

module.exports = pool;
