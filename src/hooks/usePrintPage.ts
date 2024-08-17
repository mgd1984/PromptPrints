import { useState, useEffect } from 'react';
import { payments, Card } from '@square/web-sdk';
import { createPrintfulOrder } from '../lib/printfulService';

const usePrintPage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [size, setSize] = useState('13x19');
  const [quantity, setQuantity] = useState(1);
  const [paperType, setPaperType] = useState('matte');
  const [card, setCard] = useState<Card | null>(null);

  const sizes: { [key: string]: { width: number; height: number; name: string } } = {
    '13x19': { width: 13, height: 19, name: '13x19 (Portrait)' },
    '19x13': { width: 19, height: 13, name: '19x13 (Landscape)' },
    '12x12': { width: 12, height: 12, name: '12x12 (Square)' }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrlParam = urlParams.get('imageUrl');
    if (imageUrlParam) {
      setImageUrl(imageUrlParam);
    } else {
      setError('No image found. Please generate an image first.');
    }

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

  const handlePrintJob = async (jobData: any) => {
    if (jobData.fulfillmentOption === 'printful') {
      try {
        const printfulOrder = await createPrintfulOrder(jobData);
        console.log('Printful order created:', printfulOrder);
      } catch (error) {
        console.error('Error sending job to Printful:', error);
      }
    } else {
      // Handle in-house print job
    }
  };

  const calculatePrice = () => {
    const { width, height } = sizes[size];
    const basePrice = width * height * 0.1; // $0.10 per square inch
    const paperMultiplier = paperType === 'glossy' ? 1.2 : 1; // 20% more for glossy
    return (basePrice * quantity * paperMultiplier).toFixed(2);
  };

  const handlePayment = async () => {
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
            amount: calculatePrice(),
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

  return {
    imageUrl,
    error,
    size,
    setSize,
    quantity,
    setQuantity,
    paperType,
    setPaperType,
    handlePrintJob,
    calculatePrice,
    handlePayment,
  };
};

export default usePrintPage;