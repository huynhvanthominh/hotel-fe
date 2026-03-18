import axiosClient from "../aixos.config";
import type { IRoom } from "@/models/room";




const get = async (): Promise<IRoom[]> => {
  return axiosClient.get('room/get')
};

const getById = async (id: string): Promise<IRoom> => {
  return axiosClient.get(`room/get/${id}`)
}


export const roomApi = {
  get,
  getById,
}
