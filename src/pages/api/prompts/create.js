// pages/api/prompts/create.js
import db from '../../../lib/db';

export const runtime = 'edge';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_id, content, status } = req.body;
    
    try {
      const result = await db.query(
        'INSERT INTO prompts (user_id, content, status) VALUES ($1, $2, $3) RETURNING *',
        [user_id, content, status]
      );
      res.status(200).json({ prompt: result.rows[0] });
    } catch (error) {
      console.error('Error creating prompt:', error);
      res.status(500).json({ error: 'Error creating prompt' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}