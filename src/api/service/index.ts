import axiosClient from "../aixos.config";
import type { IService, ICreateServiceRequest, IUpdateServiceRequest } from "@/models/service";

const get = async (): Promise<IService[]> => {
  return axiosClient.get('service/get');
};

const getById = async (id: string): Promise<IService> => {
  return axiosClient.get(`service/get/${id}`);
};

const create = async (data: ICreateServiceRequest): Promise<IService> => {
  return axiosClient.post('service/create', data);
};

const update = async (id: string, data: IUpdateServiceRequest): Promise<IService> => {
  return axiosClient.put(`service/update/${id}`, data);
};

const remove = async (id: string): Promise<void> => {
  return axiosClient.delete(`service/delete/${id}`);
};

export const serviceApi = {
  get,
  getById,
  create,
  update,
  remove,
};
