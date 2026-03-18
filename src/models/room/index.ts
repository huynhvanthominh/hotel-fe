import { IOffice } from "@/models/office";
import { IAmenity } from "../amenetiy";
import { IRoomImage } from "../room-image";
import { ROOM_PRICE_ENUM } from "@/enums/room-price.enum";


export interface IRoomPrice {
  id: string;
  roomId: string;
  price: number;
  type: ROOM_PRICE_ENUM;
  from: string;
  to: string;
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
