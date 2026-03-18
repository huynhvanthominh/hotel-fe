// WebSocket Event Types for Type Safety

export interface TransactionSuccessData {
  bookingId: string;
  transactionId?: string;
  amount: number;
  timestamp: string;
}

export interface PaymentConfirmedData {
  bookingId: string;
  transactionId?: string;
  amount: number;
  confirmed: boolean;
}

export interface SubscribeBookingData {
  bookingId: string;
}

export interface UnsubscribeBookingData {
  bookingId: string;
}

// WebSocket Event Names
export const WS_EVENTS = {
  // Client to Server
  SUBSCRIBE_BOOKING: 'subscribe_booking',
  UNSUBSCRIBE_BOOKING: 'unsubscribe_booking',
  
  // Server to Client
  TRANSACTION_SUCCESS: 'transaction_success',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  
  // Connection Events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const;

export type WebSocketEventName = typeof WS_EVENTS[keyof typeof WS_EVENTS];
