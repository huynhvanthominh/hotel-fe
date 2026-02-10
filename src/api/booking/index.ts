import { IBooking, ICreateBookingRequest, IUpdateBookingRequest } from "@/models/booking";
import axiosClient from "../aixos.config";

const get = async (): Promise<IBooking[]> => {
  return axiosClient.get('booking/get');
};

const getById = async (id: string): Promise<IBooking> => {
  return axiosClient.get(`booking/get/${id}`);
};

const getByRoomId = async (roomId: string): Promise<IBooking[]> => {
  return axiosClient.get(`booking/get-by-room/${roomId}`);
};

const create = async (data: ICreateBookingRequest): Promise<IBooking> => {
  return axiosClient.post('booking/create', data);
};

const update = async (id: string, data: IUpdateBookingRequest): Promise<IBooking> => {
  return axiosClient.put(`booking/update/${id}`, data);
};

const cancel = async (id: string): Promise<IBooking> => {
  return axiosClient.put(`booking/cancel/${id}`);
};

const remove = async (id: string): Promise<void> => {
  return axiosClient.delete(`booking/delete/${id}`);
};

export const bookingApi = {
  get,
  getById,
  getByRoomId,
  create,
  update,
  cancel,
  remove,
};
