// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING, // Use your NEON connection string here
  ssl: {
    rejectUnauthorized: false,
  },
});

const query = (text, params) => pool.query(text, params);

const upsertUser = async (user) => {
  const { sub, email, name } = user;
  const text = `
    INSERT INTO users (user_id, email, full_name)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id)
    DO UPDATE SET email = $2, name = $3;
  `;
  const values = [sub, email, name];
  await query(text, values);
};

export default {
  query,
  upsertUser,
};