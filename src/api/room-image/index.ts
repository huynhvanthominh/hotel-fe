import { IRoom } from './../../models/room/index';
import axiosClient from "../aixos.config";




const get = async (): Promise<IRoom[]> => {
  return axiosClient.get('room/get')
};


export const roomApi = {
  get,
}
