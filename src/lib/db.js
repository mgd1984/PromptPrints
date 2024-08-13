// db.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING, // Use your NEON connection string here
  ssl: {
    rejectUnauthorized: false,
  },
});

export default {
  query: (text, params) => pool.query(text, params),
};