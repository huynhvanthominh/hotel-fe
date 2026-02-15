import { IOffice } from "@/models/office";
import { IRoom } from "@/models/room";

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


export interface IServiceInBooking {
  id: string;
  name: string;
  price: number | string;
  imageId?: string;
}

export interface IBookingServiceDetail {
  id?: string;
  bookingId?: string;
  serviceId: string;
  service?: IServiceInBooking;
  quantity: number;
  price: number | string;
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
  expiresAt?: string | null;
  wifi?: string;
  homePassword?: string;
  room?: IRoom;
  details?: IBookingDetail[];
  services?: IBookingServiceDetail[];
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


export interface IBookingService {
  serviceId: string;
  quantity: number;
  price: number;
}

export interface IBookingTime {
  date: string;
  time: string;
  price: number;
}

export interface ICreateBookingRequest {
  fullName: string,
  phone: string,
  personCount: number,
  cccdFrontImageId: string,
  cccdBackImageId: string,
  note: string,
  totalPrice: number,
  roomId: string,
  times: IBookingTime[],
  services?: IBookingService[]
}

