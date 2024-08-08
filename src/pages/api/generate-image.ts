import { NextApiRequest, NextApiResponse } from 'next'
import * as fal from "@fal-ai/serverless-client";

// File: pages/api/generate-image.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { prompt } = req.body
    const result = await fal.subscribe("fal-ai/flux-pro", {
      input: {
      prompt: prompt
      },
      logs: true,
      onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
      },
    });
  }
}
