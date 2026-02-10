import { IOffice } from "@/models/office";
import axiosClient from "../aixos.config";




const get = async (): Promise<IOffice[]> => {
  return axiosClient.get('room/get')
};

const getById = async (id: string): Promise<IOffice> => {
  return axiosClient.get(`room/get/${id}`)
}


export const roomApi = {
  get,
  getById,
}
