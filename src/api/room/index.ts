import { ROOM_STATUS_ENUM } from "@/enums/room-status.enum";
import axiosClient from "../aixos.config";
import type { IRoom } from "@/models/room";




const get = async (): Promise<IRoom[]> => {
  return axiosClient.get('room/get', {
    params: {
      status: ROOM_STATUS_ENUM.HOAT_DONG
    }
  })
};

const getById = async (id: string): Promise<IRoom> => {
  return axiosClient.get(`room/get/${id}`)
}


export const roomApi = {
  get,
  getById,
}
