// pages/api/upsertUser.js
import db from '../../lib/db'; // Adjust the import path as necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const user = req.body;

    try {
      await db.upsertUser(user);
      res.status(200).json({ message: 'User upserted successfully' });
    } catch (error) {
      console.error('Error upserting user:', error);
      res.status(500).json({ error: 'Error upserting user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}