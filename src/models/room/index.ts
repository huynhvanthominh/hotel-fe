import { IRoomImage } from "../room-image";

export enum ROOM_PRICE_TYPE_ENUM{
  QUA_DEM = 'Đêm',
  BA_GIO = '3h'
}

interface IRoomPrice{
  price: number;
  type: ROOM_PRICE_TYPE_ENUM
}

export interface IRoom {
  id: string;
  name: string;
  type: string;
  description: string;
  officeId: string;
  images: IRoomImage[];
  prices: IRoomPrice[]
}
