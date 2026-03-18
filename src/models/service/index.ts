export interface IService {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageId?: string;
  unit?: string;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  imageId?: string;
  unit?: string;
}

export interface IUpdateServiceRequest {
  name?: string;
  description?: string;
  price?: number;
  imageId?: string;
  unit?: string;
  available?: boolean;
}
