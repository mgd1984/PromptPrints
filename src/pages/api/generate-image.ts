import { NextApiRequest, NextApiResponse } from 'next';
import * as fal from "@fal-ai/serverless-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { prompt, model, inputParam } = req.body; // Destructure model from request body
      console.log('Received prompt:', prompt); // Log the received prompt
      console.log('Received model:', model); // Log the received model
      console.log('Received inputParam:', inputParam); // Log the received input parameter

      // Use the selected model for image generation
      const result: any = await fal.subscribe(model, {
        input: { prompt, inputParam }, // Include input parameter in the request to fal
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log('Generation progress:', update.status);
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      console.log('Fal AI result:', JSON.stringify(result, null, 2)); // Log the entire result object

      if (result && result.images && result.images[0] && result.images[0].url) {
        const imageUrl = result.images[0].url;
        console.log('Generated image URL:', imageUrl);

        res.status(200).json({ imageUrl });
      } else {
        throw new Error('Image URL not found in the Fal AI response');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      res.status(500).json({ error: 'Failed to generate image', details: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}