import { NextRequest, NextResponse } from 'next/server';
import * as fal from "@fal-ai/serverless-client";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { prompt, model, inputParam } = await req.json();
    console.log('Received prompt:', prompt);
    console.log('Received model:', model);
    console.log('Received inputParam:', inputParam);

    if (!model) {
      throw new Error('Model is undefined');
    }

    const result: any = await fal.subscribe(model, {
      input: { prompt, inputParam },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log('Generation progress:', update.status);
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log('Fal AI result:', JSON.stringify(result, null, 2));

    if (result && result.images && result.images[0] && result.images[0].url) {
      const imageUrl = result.images[0].url;
      console.log('Generated image URL:', imageUrl);
      return NextResponse.json({ imageUrl }, { status: 200 });
    } else {
      throw new Error('Image URL not found in the Fal AI response');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: (error as Error).message },
      { status: 500 }
    );
  }
}