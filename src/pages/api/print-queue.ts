// File: pages/api/print-queue.ts
import { NextApiRequest, NextApiResponse } from 'next'
import CUPS from 'node-cups'
import fs from 'fs'
import { config } from 'dotenv'

// Load environment variables
config()

const cups = new CUPS({
  host: process.env.CUPS_HOST, // Replace with your Raspberry Pi IP address
  port: process.env.CUPS_PORT || 631, // Default CUPS port
  user: process.env.CUPS_USER, // Replace with your CUPS username
  password: process.env.CUPS_PASSWORD // Replace with your CUPS password
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { filePath, printerName } = req.body
      if (!filePath || !printerName) {
        return res.status(400).json({ error: 'filePath and printerName are required' })
      }

      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'File does not exist' });
      }

      // Send print job to CUPS
      const jobId = await cups.printFile(printerName, filePath)
      res.status(200).json({ message: 'Print job added to queue', jobId })
    } catch (error) {
      console.error('Print job error:', error)
      res.status(500).json({ error: 'An error occurred while processing your request' })
    }
  } else if (req.method === 'GET') {
    try {
      // Retrieve print queue status
      const jobs = await cups.getJobs()
      res.status(200).json({ queue: jobs })
    } catch (error) {
      console.error('Get jobs error:', error)
      res.status(500).json({ error: 'An error occurred while retrieving the print queue' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}