import { type STATUS_ENUM } from "@/enums/status.enum";

export interface IOffice {
  id: string;
  name: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  status: STATUS_ENUM
}

export interface ICreateOffice extends Omit<IOffice, 'id' | 'status'>{}
