import axios from 'axios';

const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

const printfulClient = axios.create({
  baseURL: PRINTFUL_API_URL,
  headers: {
    'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
  },
  timeout: 10000, // Timeout after 10 seconds
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Accept only 2xx status codes
  },
});

// Utility function for error handling
const handlePrintfulError = (error: any) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    console.error('Printful API error response:', error.response.data);
    throw new Error(`Printful API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
  } else if (error.request) {
    // Request was made but no response was received
    console.error('Printful API no response error:', error.request);
    throw new Error('Printful API Error: No response received');
  } else {
    // Something happened in setting up the request
    console.error('Printful API request error:', error.message);
    throw new Error(`Printful API Error: ${error.message}`);
  }
};

// Validate order data before sending it to Printful
const validateOrderData = (orderData: any) => {
  if (!orderData.recipient || !orderData.items || !Array.isArray(orderData.items)) {
    throw new Error('Invalid order data: recipient information or items are missing or invalid');
  }
  orderData.items.forEach((item: any, index: number) => {
    if (!item.variant_id || !item.quantity) {
      throw new Error(`Invalid item data at index ${index}: variant_id or quantity is missing`);
    }
  });
};

// Create a Printful order
export const createPrintfulOrder = async (orderData: any) => {
  try {
    validateOrderData(orderData);
    const response = await printfulClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    handlePrintfulError(error);
  }
};

// Get the status of an existing Printful order
export const getPrintfulOrderStatus = async (orderId: string) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is required to fetch order status');
    }
    const response = await printfulClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    handlePrintfulError(error);
  }
};

// Cancel an existing Printful order
export const cancelPrintfulOrder = async (orderId: string) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is required to cancel order');
    }
    const response = await printfulClient.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    handlePrintfulError(error);
  }
};

// Retrieve a list of all Printful orders with optional filters
export const listPrintfulOrders = async (filters: any = {}) => {
  try {
    const response = await printfulClient.get('/orders', { params: filters });
    return response.data;
  } catch (error) {
    handlePrintfulError(error);
  }
};