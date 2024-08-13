import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Environment, CreatePaymentRequest } from 'square';
import JSONBig from 'json-bigint';

export const runtime = 'edge';

const crypto = require('crypto');

const client = new Client({
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: process.env.SQ_ACCESS_TOKEN,
});

const paymentsApi = client.paymentsApi;

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
    const idempotencyKey = crypto.randomBytes(22).toString('hex');
    const amountInCents = BigInt(Math.round(parseFloat(amount) * 100));

    const requestBody: CreatePaymentRequest = {
      idempotencyKey,
      sourceId,
      amountMoney: {
        amount: amountInCents, // No need to convert BigInt to string here
        currency: 'CAD', // Make sure this matches your Square account currency
      },
    };

    const { result } = await paymentsApi.createPayment(requestBody);

    if (result.payment) {
      res.status(200).json(JSONBig.parse(JSONBig.stringify({ payment: result.payment })));
    } else {
      throw new Error('Payment creation failed');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: (error as Error).message || 'An error occurred while processing the payment' });
  }
}