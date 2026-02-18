import { IOffice } from "@/models/office";
import { IAmenity } from "../amenetiy";
import { IRoomImage } from "../room-image";

export enum ROOM_PRICE_TYPE_ENUM {
  QUA_DEM = 'Đêm',
  BA_GIO = '3h'
}

interface IRoomPrice {
  price: string;
  type: ROOM_PRICE_TYPE_ENUM
}

export interface IRooomAmenity {
  id: string;
  roomId: string;
  amenityId: string;
  amenity: IAmenity;
}

export interface IRoom {
  id: string;
  name: string;
  type: string;
  description: string;
  officeId: string;
  images: IRoomImage[];
  prices: IRoomPrice[];
  amenities: IRooomAmenity[];
  password?: string;
  office?: IOffice;
}
