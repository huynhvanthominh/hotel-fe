export enum BOOKING_STATUS_ENUM {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface IBookingDetail {
  id: string;
  bookingId: string;
  date: string;
  time: string;
  price: string;
}

export interface IBookingRoom {
  id: string;
  officeId: string;
  name: string;
  type: string;
  description: string;
}

export interface IBooking {
  id: string;
  fullName?: string;
  phone?: string;
  personCount?: number;
  cccdFrontImageId?: string;
  cccdBackImageId?: string;
  note?: string;
  roomId: string;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  totalPrice: number | string;
  status: BOOKING_STATUS_ENUM | string;
  specialRequests?: string;
  createdAt?: string;
  updatedAt?: string;
  room?: IBookingRoom;
  details?: IBookingDetail[];
}

export interface ICreateBookingRequest {
  roomId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  specialRequests?: string;
}

export interface IUpdateBookingRequest {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  totalPrice?: number;
  status?: BOOKING_STATUS_ENUM;
  specialRequests?: string;
}
