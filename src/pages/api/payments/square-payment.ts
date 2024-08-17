import { NextApiRequest, NextApiResponse } from 'next';
import JSONBig from 'json-bigint';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  runtime: 'edge',
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { sourceId, amount } = req.body;

  if (!sourceId || !amount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const idempotencyKey = uuidv4();
    const amountInCents = JSONBig.stringify(Math.round(parseFloat(amount) * 100));

    const requestBody = {
      idempotency_key: idempotencyKey,
      source_id: sourceId,
      amount_money: {
        amount: amountInCents,
        currency: 'CAD',
      },
    };

    const response = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SQ_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (response.ok && result.payment) {
      res.status(200).json({ payment: result.payment });
    } else {
      throw new Error(result.errors ? result.errors[0].detail : 'Payment creation failed');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}