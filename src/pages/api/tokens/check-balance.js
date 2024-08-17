import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_id, tokens_required } = req.body;

    try {
      // Ensure user_id is a string
      const sanitizedUserId = String(user_id);

      const result = await db.query(
        'SELECT token_balance FROM users WHERE user_id = $1',
        [sanitizedUserId]
      );

      console.log('DB Query Success:', result);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const tokenBalance = result.rows[0].token_balance;

      if (tokenBalance < tokens_required) {
        return res.status(400).json({ error: 'Insufficient tokens' });
      }

      await db.query(
        'UPDATE users SET token_balance = token_balance - $1 WHERE user_id = $2',
        [tokens_required, sanitizedUserId]
      );

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error checking token balance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}