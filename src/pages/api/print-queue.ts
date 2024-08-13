import { config } from 'dotenv';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
config();

// Set up CUPS connection
const cups = require('node-cups')({
  host: process.env.CUPS_HOST || 'localhost',
  port: process.env.CUPS_PORT || 631,
  user: process.env.CUPS_USER || '',
  password: process.env.CUPS_PASSWORD || ''
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { filePath, printerName } = req.body;
    if (!filePath || !printerName) {
      return res.status(400).json({ error: 'filePath and printerName are required' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File does not exist' });
    }

    try {
      const jobId = await cups.printFile(printerName, filePath);
      res.status(200).json({ message: `Print job added to queue`, jobId });
    } catch (error) {
      console.error('Print job error:', error);
      return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  } else if (req.method === 'GET') {
    try {
      const jobs = await cups.getJobs();
      res.status(200).json({ jobs });
    } catch (error) {
      console.error('Get jobs error:', error);
      return res.status(500).json({ error: 'An error occurred while retrieving the print queue' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}