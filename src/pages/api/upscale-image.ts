import { NextApiRequest, NextApiResponse } from 'next';
import * as fal from "@fal-ai/serverless-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { imageUrl, upscaleFactor } = req.body; // Destructure imageUrl and upscaleFactor from request body
      console.log('Received imageUrl:', imageUrl); // Log the received image URL
      console.log('Received upscaleFactor:', upscaleFactor); // Log the received upscale factor

      // Call the Creative Upscaler API with the required inputs
      const result: any = await fal.subscribe("fal-ai/creative-upscaler", {
        input: { imageUrl, upscaleFactor }, // Pass imageUrl and upscaleFactor as input parameters
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log('Upscaling progress:', update.status);
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      console.log('Fal AI result:', JSON.stringify(result, null, 2)); // Log the entire result object

      if (result && result.upscaledImage && result.upscaledImage.url) {
        const upscaledImageUrl = result.upscaledImage.url;
        console.log('Upscaled image URL:', upscaledImageUrl);
        res.status(200).json({ upscaledImageUrl });
      } else {
        throw new Error('Upscaled image URL not found in the Fal AI response');
      }
    } catch (error) {
      console.error('Error upscaling image:', error);
      res.status(500).json({ error: 'Failed to upscale image', details: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}