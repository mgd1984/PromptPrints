// pages/api/orders/create.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_id, status, total_price, shipping_address } = req.body;

    try {
      const result = await db.query(
        'INSERT INTO orders (user_id, status, total_price, shipping_address) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, status, total_price, shipping_address]
      );
      res.status(200).json({ order: result.rows[0] });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Error creating order' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}