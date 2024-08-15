import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { payments } from '@square/web-sdk';
import { Card } from '@square/web-sdk';

export default function Payments() {
  useSession();
  const [selectedOption, setSelectedOption] = useState('prompt');
  const [showTooltip, setShowTooltip] = useState(false);
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    initializePaymentForm();
  }, []);

  const initializePaymentForm = async () => {
    const applicationId = process.env.NEXT_PUBLIC_SQ_APPLICATION_ID;
    const locationId = process.env.NEXT_PUBLIC_SQ_LOCATION_ID;

    if (!applicationId || !locationId) {
      setError('Square application ID or location ID is missing.');
      return;
    }

    try {
      const paymentsInstance = await payments(applicationId, locationId);
      if (paymentsInstance) {
        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
      } else {
        throw new Error('Failed to initialize Square payments.');
      }
    } catch (error) {
      console.error('Error initializing Square payment:', error);
      setError('Failed to initialize payment form. Please try again later.');
    }
  };

  const handlePayment = async (amount: number) => {
    if (!card) {
      setError('Payment form not initialized.');
      return;
    }

    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        const sourceId = result.token;

        const response = await fetch('/api/payments/square-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId,
            amount,
          }),
        });

        const paymentResult = await response.json();
        if (paymentResult.error) {
          setError(paymentResult.error);
        } else {
          console.log('Payment successful:', paymentResult);
          // Handle successful payment (e.g., show success message, redirect)
        }
      } else {
        throw new Error('Tokenization failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment. Please try again.');
    }
  };

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-64 h-screen fixed left-0 top-0 flex flex-col items-center py-10">
        <h2 className="text-3xl font-bold mb-8">Navigation</h2>
        <ul className="w-full">
          <li className="w-full">
            <Link href="/">
              <div className="block py-3 px-6 w-full text-left hover:bg-gray-700 rounded transition duration-300">
                Home
              </div>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/create">
              <div className="block py-3 px-6 w-full text-left hover:bg-gray-700 rounded transition duration-300">
                Prompt
              </div>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/print">
              <div className="block py-3 px-6 w-full text-left hover:bg-gray-700 rounded transition duration-300">
                Print
              </div>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/payments">
              <div className="block py-3 px-6 w-full text-left bg-gray-700 rounded transition duration-300">
                Pay
              </div>
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col min-h-screen ml-64 p-8">
        <h1 className="text-4xl font-bold mb-8">Purchase Tokens</h1>

        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-3 rounded-l-full ${selectedOption === 'prompt' ? 'bg-blue-600' : 'bg-gray-700'} transition-colors duration-300`}
            onClick={() => setSelectedOption('prompt')}
          >
            Prompt
          </button>
          <button
            className={`px-6 py-3 ${selectedOption === 'print' ? 'bg-blue-600' : 'bg-gray-700'} transition-colors duration-300`}
            onClick={() => setSelectedOption('print')}
          >
            Print
          </button>
          <button
            className={`px-6 py-3 rounded-r-full ${selectedOption === 'upscaler' ? 'bg-blue-600' : 'bg-gray-700'} transition-colors duration-300`}
            onClick={() => setSelectedOption('upscaler')}
          >
            Enhance
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {selectedOption === 'prompt' && (
            <>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">FLUX.1 [schnell]</h2>
                <p className="text-gray-400 mb-2">Best for fast and iterative generations</p>
                <p className="text-gray-400 mb-2">1 gigapixel = ~ 1000 images</p>
                <p className="text-white font-bold mb-6">$3/gigapixel</p>
                <p className="text-white font-bold mb-6"> &gt; 3s latency</p>
                <button
                  onClick={() => handlePayment(300)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                >
                  Go Fast
                </button>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">FLUX.1 [dev]</h2>
                <p className="text-gray-400 mb-2">Ideal for development and small projects</p>
                <p className="text-gray-400 mb-2">1 gigapixel = ~1000 images</p>
                <p className="text-white font-bold mb-6">$25/gigapixel</p>
                <p className="text-white font-bold mb-6"> &gt; 10s latency</p>

                <button
                  onClick={() => handlePayment(2500)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                >
                  Start Developing
                </button>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">FLUX.1 [pro]</h2>
                <p className="text-gray-400 mb-2">Professional quality for serious generators. State-of-the-art image generation models with top of the line prompt following, visual quality, image detail and output diversity</p>
                <p className="text-gray-400 mb-2">1 gigapixel = ~1000 images</p>
                <p className="text-white font-bold mb-6">$50/gigapixel</p>
                <p className="text-white font-bold mb-6"> &gt; 15s latency</p>

                <button
                  onClick={() => handlePayment(5000)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                >
                  Go Pro
                </button>
              </div>
            </>
          )}

          {selectedOption === 'print' && (
            <>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Square Prints</h2>
                <p className="text-gray-400 mb-2">Ideal for personal use or gifts</p>
                <p className="text-gray-400 mb-6">Up to 12"x12", 16"x16", and 20"x20" print size</p>
                <p className="text-white font-bold mb-6">$15.00-$30.00</p>
                <button
                  onClick={() => handlePayment(1500)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                >
                  Print Now
                </button>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">16:9 Prints</h2>
                <p className="text-gray-400 mb-2">Ideal for personal use or gifts</p>
                <p className="text-gray-400 mb-6">Up to 12"x12", 16"x16", and 20"x20" print size</p>
                <p className="text-white font-bold mb-6">$15.00-$30.00</p>
                <button
                  onClick={() => handlePayment(1500)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                >
                  Print Now
                </button>
              </div>
            </>
          )}
        </div>

        <div id="card-container" className="mt-4 bg-white p-4 rounded-lg"></div>

        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
}