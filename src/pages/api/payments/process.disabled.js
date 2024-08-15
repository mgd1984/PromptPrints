// pages/api/payments/process.js
import db from '../../../lib/db';
// import square from 'square-payment'; // Assuming you have square-payment module setup

export const runtime = 'edge';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { order_id, user_id, amount, currency } = req.body;

    try {
      // Process payment using Square API
      const paymentResult = await square.processPayment({
        amount,
        currency,
        sourceId: req.body.sourceId, // Assuming sourceId is sent from the frontend
      });

      if (paymentResult.success) {
        const result = await db.query(
          'INSERT INTO payments (order_id, user_id, amount, currency, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [order_id, user_id, amount, currency, 'completed']
        );
        res.status(200).json({ payment: result.rows[0] });
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ error: 'Error processing payment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
