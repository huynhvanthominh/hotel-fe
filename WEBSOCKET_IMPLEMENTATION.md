# WebSocket Transaction Success Implementation

This project now includes WebSocket functionality for real-time transaction success notifications.

## 📁 Files Created

1. **`src/hooks/use-websocket.tsx`** - Custom React hook for WebSocket connection management
2. **`src/contexts/websocket-context.tsx`** - WebSocket context provider for global state
3. **`WEBSOCKET_BACKEND_GUIDE.md`** - Complete backend implementation guide

## ✨ Features

- ✅ Real-time transaction success notifications
- ✅ Auto-reconnection on connection loss
- ✅ Subscription-based booking updates
- ✅ Payment confirmation UI with success state
- ✅ Connection status indicator

## 🔧 Configuration

Add to your `.env` or `.env.local`:

```env
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

## 📦 Dependencies

Install the required dependency:

```bash
pnpm add socket.io-client
# or
npm install socket.io-client
# or
yarn add socket.io-client
```

## 🎯 How It Works

### Frontend Flow

1. User completes booking form and clicks "Đặt phòng"
2. Booking is created → `bookingId` is returned
3. WebSocket subscribes to that `bookingId` via `subscribe_booking` event
4. QR payment modal opens showing payment QR code
5. Connection status indicator shows "Đang chờ xác nhận thanh toán..."
6. When backend detects payment success → emits `transaction_success` event
7. Frontend receives event → shows success message → updates booking status
8. User can close modal or booking is auto-confirmed

### WebSocket Events

**Client sends:**
- `subscribe_booking` - Subscribe to payment updates for a booking
- `unsubscribe_booking` - Unsubscribe when modal closes

**Server sends:**
- `transaction_success` - Payment confirmed
- `payment_confirmed` - Alternative payment confirmation event

## 🖥️ Backend Implementation

See [WEBSOCKET_BACKEND_GUIDE.md](./WEBSOCKET_BACKEND_GUIDE.md) for complete backend setup instructions including:

- Socket.IO server setup
- Webhook integration
- Payment polling strategies
- Security considerations
- Testing methods

### Quick Backend Example

```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('subscribe_booking', ({ bookingId }) => {
    socket.join(`booking_${bookingId}`);
  });
});

// When payment is confirmed
io.to(`booking_${bookingId}`).emit('transaction_success', {
  bookingId,
  transactionId,
  amount,
  timestamp: new Date().toISOString(),
});
```

## 🧪 Testing

### Test WebSocket Connection

```javascript
// In browser console
const socket = io('http://localhost:3000');
socket.on('connect', () => console.log('Connected!'));
```

### Simulate Payment Success

```bash
curl -X POST http://localhost:3000/webhook/payment \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "your-booking-id",
    "transactionId": "test-123",
    "amount": 500000,
    "status": "success"
  }'
```

## 🎨 UI Updates

The payment modal now shows:

- **Before Payment**: QR code + "Đang chờ xác nhận thanh toán..." status
- **After Payment**: Success checkmark + booking ID + confirmation message
- **Connection Status**: Green dot (connected) / Orange dot (connecting)

## 🔐 Security Notes

1. Validate all WebSocket events on the server
2. Verify webhook signatures from payment provider
3. Use authentication tokens for WebSocket connections in production
4. Implement rate limiting on payment webhooks
5. Use WSS (secure WebSocket) in production

## 🚀 Production Deployment

1. Update `.env.production`:
   ```env
   NEXT_PUBLIC_WS_URL=https://api.yourdomain.com
   ```

2. Configure CORS on backend for your production domain

3. Use secure WebSocket (wss://) for HTTPS sites

4. Consider Redis adapter for scaling WebSocket across multiple servers

## 📚 Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [WebSocket Best Practices](https://socket.io/docs/v4/server-socket-instance/)
