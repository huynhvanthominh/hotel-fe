import { ICreateOffice, IOffice } from "@/models/office";
import axiosClient from "../aixos.config";




const get = async (): Promise<IOffice[]> => {
  return axiosClient.get('office/get')
};
const create = async (payload: ICreateOffice[]): Promise<IOffice[]> => { 
  return axiosClient.post('office/create', payload)
};

export const officeApi = {
  get,
  create
}
