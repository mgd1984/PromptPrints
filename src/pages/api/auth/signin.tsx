// pages/api/auth/signin.tsx
import { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'edge';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Perform authentication logic here
    if (email === 'test@example.com' && password === 'password') {
      res.status(200).json({ message: 'Sign-in successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}