/**
 * WebSocket Testing Utilities
 * 
 * Use these utilities to test WebSocket functionality in development
 */

import { io, Socket } from 'socket.io-client';

/**
 * Create a test WebSocket connection
 */
export const createTestSocket = (url: string = 'http://localhost:3000'): Socket => {
  return io(url, {
    transports: ['websocket', 'polling'],
  });
};

/**
 * Simulate a transaction success event
 * Use this in browser console to test the UI
 */
export const simulateTransactionSuccess = (
  socket: Socket,
  bookingId: string,
  amount: number = 500000
) => {
  socket.emit('transaction_success', {
    bookingId,
    transactionId: `test-txn-${Date.now()}`,
    amount,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Test WebSocket connection in browser console
 * 
 * Usage:
 * ```javascript
 * import { testWebSocketConnection } from '@/utils/websocket-test';
 * testWebSocketConnection('http://localhost:3000');
 * ```
 */
export const testWebSocketConnection = (url: string = 'http://localhost:3000') => {
  const socket = createTestSocket(url);

  socket.on('connect', () => {
    console.info('✅ WebSocket connected successfully!');
    console.info('Socket ID:', socket.id);
  });

  socket.on('disconnect', () => {
    console.info('❌ WebSocket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error);
  });

  socket.on('transaction_success', (data) => {
    console.info('💰 Transaction success received:', data);
  });

  socket.on('payment_confirmed', (data) => {
    console.info('✅ Payment confirmed:', data);
  });

  return socket;
};

/**
 * Send a test payment webhook
 * Use this to simulate backend webhook reception
 */
export const sendTestWebhook = async (
  bookingId: string,
  amount: number = 500000,
  webhookUrl: string = 'http://localhost:3000/webhook/payment'
) => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId,
        transactionId: `test-txn-${Date.now()}`,
        amount,
        status: 'success',
      }),
    });

    const data = await response.json();
    console.info('✅ Test webhook sent successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error sending test webhook:', error);
    throw error;
  }
};
