import { buffer } from 'micro';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { NextApiRequest, NextApiResponse } from 'next';
import { Queue } from 'bullmq';
import dotenv from 'dotenv';
import { logger } from '../../lib/logger'; // Assume we've set up a logging utility

dotenv.config();


export const config = {
  runtime: 'edge',
  api: {
    bodyParser: false,
    
  },
};

// Define interfaces
interface SquarePayment {
  order_id: string;
  status: string;
  customer_email: string;
  order: {
    line_items: Array<{
      catalog_object_id: string;
      quantity: number;
    }>;
  };
  customer: {
    id: string;
    email: string;
    given_name: string;
    family_name: string;
  };
}

// Initialize queues
const orderQueue = new Queue('orderProcessing');
const inventoryQueue = new Queue('inventoryManagement');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const buf = await buffer(req);
    const signature = req.headers['x-square-signature'];

    if (!verifySquareSignature(buf, Array.isArray(signature) ? signature[0] : signature ?? '', process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || '')) {
      return res.status(401).send('Unauthorized');
    }

    const event = JSON.parse(buf.toString());

    // Queue the event for processing
    await orderQueue.add('processOrder', { eventType: event.type, data: event.data.object });

    res.status(200).send('Webhook received');
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
}

function verifySquareSignature(buf: Buffer, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(buf.toString('utf8'));
  const expectedSignature = hmac.digest('base64');
  return expectedSignature === signature;
}

async function handlePaymentCreated(payment: SquarePayment) {
  try {
    await updateOrderStatus(payment.order_id, 'Processing');
    await inventoryQueue.add('updateInventory', { items: payment.order.line_items });
    await sendConfirmationEmail(payment.customer_email, payment.order_id);
    await pushToCRM(payment.customer);
    await queueForAnalytics(payment);
    await triggerAIRecommendations(payment.customer.id);
  } catch (error) {
    logger.error('Error handling payment created:', error);
  }
}

async function handlePaymentUpdated(payment: SquarePayment) {
  try {
    await updateOrderStatus(payment.order_id, payment.status);
  } catch (error) {
    logger.error('Error handling payment updated:', error);
  }
}

async function handlePaymentRefunded(payment: SquarePayment) {
  try {
    await updateOrderStatus(payment.order_id, 'Refunded');
    await sendRefundNotification(payment.customer_email, payment.order_id);
    await queueForAnalytics(payment, 'refund');
  } catch (error) {
    logger.error('Error handling payment refunded:', error);
  }
}

async function sendRefundNotification(email: string, orderId: string) {
  try {
    const emailResponse = await fetch('https://api.your-email-service.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: `Order Refund - ${orderId}`,
        text: `Your order ${orderId} has been refunded. We apologize for any inconvenience caused.`,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send refund notification email');
    }
  } catch (error) {
    logger.error('Error sending refund notification email:', error);
  }
}

async function updateOrderStatus(orderId: string, status: string) {
  // Implement your database update logic here
  logger.info(`Order ${orderId} status updated to ${status}`);
}

async function sendConfirmationEmail(email: string, orderId: string) {
  try {
    const emailResponse = await fetch('https://api.your-email-service.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: `Order Confirmation - ${orderId}`,
        text: `Your order ${orderId} has been confirmed. Thank you for your purchase!`,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send confirmation email');
    }
  } catch (error) {
    logger.error('Error sending confirmation email:', error);
  }
}

async function pushToCRM(customer: SquarePayment['customer']) {
  try {
    const crmResponse = await fetch('https://api.your-crm-service.com/addCustomer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: customer.id,
        email: customer.email,
        name: `${customer.given_name} ${customer.family_name}`,
      }),
    });

    if (!crmResponse.ok) {
      throw new Error('Failed to push customer data to CRM');
    }
  } catch (error) {
    logger.error('Error pushing to CRM:', error);
  }
}

async function queueForAnalytics(payment: SquarePayment, eventType: string = 'purchase') {
  // Queue the payment data for analytics processing
  await new Queue('analytics').add('processTransaction', { payment, eventType });
}

async function triggerAIRecommendations(customerId: string) {
  // Queue a job to generate AI-powered recommendations
  await new Queue('aiRecommendations').add('generateRecommendations', { customerId });
}

// Additional functions for inventory management, design generation, etc. would be implemented here