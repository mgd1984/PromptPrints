// pages/api/tokens/transaction.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_id, type, token_amount, description } = req.body;

    try {
      const result = await db.query(
        'INSERT INTO token_transactions (user_id, type, token_amount, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, type, token_amount, description]
      );

      // Optionally update user's token balance here
      res.status(200).json({ transaction: result.rows[0] });
    } catch (error) {
      console.error('Error processing token transaction:', error);
      res.status(500).json({ error: 'Error processing token transaction' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}