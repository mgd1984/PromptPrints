// File: pages/create.tsx
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { loadStripe } from '@stripe/stripe-js'
import * as fal from "@fal-ai/serverless-client";


export default function Create() {
  const { data: session } = useSession()
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')

  const generateImage = async () => {
    // TODO: Implement FAL.ai API call
    // This is a placeholder for the actual API call
    const result: any = await fal.subscribe("fal-ai/flux-pro", {
      input: {
        prompt: prompt,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    setGeneratedImage(result.imageUrl);
  }

  const handlePayment = async () => {
    // TODO: Implement Stripe payment
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')
    // This is a placeholder for the actual Stripe integration
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: generatedImage }),
    })
    const session = await response.json()
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: session.id })
    }
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Create Your Print</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter your prompt"
      />
      <button
        onClick={generateImage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Generate Image
      </button>
      {generatedImage && (
        <>
          <img src={generatedImage} alt="Generated Image" className="my-4" />
          <button
            onClick={handlePayment}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  )
}
