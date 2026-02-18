# WebSocket Server Implementation Guide

This document explains how to implement the backend WebSocket server to work with the frontend transaction success notifications.

## Backend Implementation (Node.js + Socket.IO)

### 1. Install Dependencies

```bash
npm install socket.io cors
```

### 2. Server Setup Example

```javascript
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

// Store active booking subscriptions
const bookingSubscriptions = new Map();

io.on('connection', (socket) => {
  console.info('Client connected:', socket.id);

  // Handle booking subscription
  socket.on('subscribe_booking', (data) => {
    const { bookingId } = data;
    console.info(`Client ${socket.id} subscribed to booking ${bookingId}`);
    
    // Track which socket is waiting for which booking
    bookingSubscriptions.set(bookingId, socket.id);
    socket.join(`booking_${bookingId}`);
  });

  // Handle booking unsubscription
  socket.on('unsubscribe_booking', (data) => {
    const { bookingId } = data;
    console.info(`Client ${socket.id} unsubscribed from booking ${bookingId}`);
    
    bookingSubscriptions.delete(bookingId);
    socket.leave(`booking_${bookingId}`);
  });

  socket.on('disconnect', () => {
    console.info('Client disconnected:', socket.id);
    
    // Clean up subscriptions
    for (const [bookingId, socketId] of bookingSubscriptions.entries()) {
      if (socketId === socket.id) {
        bookingSubscriptions.delete(bookingId);
      }
    }
  });
});

// Listen for payment webhooks or poll payment status
app.post('/webhook/payment', express.json(), (req, res) => {
  const { bookingId, transactionId, amount, status } = req.body;

  if (status === 'success') {
    // Emit transaction success to the specific booking room
    io.to(`booking_${bookingId}`).emit('transaction_success', {
      bookingId,
      transactionId,
      amount,
      timestamp: new Date().toISOString(),
    });

    // Also emit to global payment_confirmed event
    io.to(`booking_${bookingId}`).emit('payment_confirmed', {
      bookingId,
      transactionId,
      amount,
      confirmed: true,
    });

    console.info(`Payment confirmed for booking ${bookingId}`);
  }

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.info(`WebSocket server running on port ${PORT}`);
});
```

### 3. Alternative: Polling Payment Status

If you don't have webhooks from your payment provider, you can poll the payment status:

```javascript
// payment-checker.js
const checkPaymentStatus = async (bookingId, memo) => {
  // Check with your payment provider's API
  // This is an example - adjust based on your payment provider
  
  try {
    const response = await fetch(`https://payment-api.com/check/${memo}`);
    const data = await response.json();
    
    if (data.status === 'paid') {
      // Notify via WebSocket
      io.to(`booking_${bookingId}`).emit('transaction_success', {
        bookingId,
        transactionId: data.transactionId,
        amount: data.amount,
        timestamp: new Date().toISOString(),
      });
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking payment:', error);
    return false;
  }
};

// Poll every 10 seconds for active bookings
setInterval(() => {
  for (const [bookingId, socketId] of bookingSubscriptions.entries()) {
    checkPaymentStatus(bookingId);
  }
}, 10000);
```

### 4. Environment Variables

Create a `.env` file in your backend:

```
PORT=3000
FRONTEND_URL=http://localhost:3001
PAYMENT_API_KEY=your_payment_api_key
```

## Events Reference

### Client → Server Events

- `subscribe_booking`: Subscribe to payment updates for a specific booking
  ```javascript
  { bookingId: "booking-id-123" }
  ```

- `unsubscribe_booking`: Unsubscribe from payment updates
  ```javascript
  { bookingId: "booking-id-123" }
  ```

### Server → Client Events

- `transaction_success`: Emitted when payment is confirmed
  ```javascript
  {
    bookingId: "booking-id-123",
    transactionId: "txn-456",
    amount: 500000,
    timestamp: "2024-01-15T10:30:00.000Z"
  }
  ```

- `payment_confirmed`: Alternative event for payment confirmation
  ```javascript
  {
    bookingId: "booking-id-123",
    transactionId: "txn-456",
    amount: 500000,
    confirmed: true
  }
  ```

## Integration with Payment Provider

### Option 1: Webhook Integration (Recommended)

Configure your payment provider to send webhooks to:
```
POST https://your-backend.com/webhook/payment
```

### Option 2: QR Code Callback URL

Some payment providers support callback URLs in the QR code. Update your QR URL:
```javascript
const qrUrl = `https://payment.pay2s.vn/quicklink/MBB/...?callback=${encodeURIComponent('https://your-backend.com/webhook/payment')}`;
```

### Option 3: Manual Polling

Implement a background job that polls the payment provider's API every few seconds to check payment status.

## Security Considerations

1. **Validate webhook signatures**: Always verify that webhooks come from your payment provider
2. **Use HTTPS**: In production, always use secure connections
3. **Authenticate WebSocket connections**: Consider adding authentication tokens
4. **Rate limiting**: Implement rate limiting on webhook endpoints
5. **Validate booking ownership**: Ensure users can only subscribe to their own bookings

## Testing

Use this test script to simulate payment success:

```javascript
// test-webhook.js
const axios = require('axios');

axios.post('http://localhost:3000/webhook/payment', {
  bookingId: 'test-booking-123',
  transactionId: 'test-txn-456',
  amount: 500000,
  status: 'success',
})
.then(res => console.info('Webhook sent:', res.data))
.catch(err => console.error('Error:', err));
```

## Deployment

When deploying to production:

1. Update `NEXT_PUBLIC_WS_URL` in frontend `.env.production`
2. Configure CORS properly on the backend
3. Use a proper WebSocket transport (wss:// for HTTPS)
4. Consider using a WebSocket scaling solution like Redis adapter for multiple server instances
