import { IOffice } from "@/models/office";
import axiosClient from "../aixos.config";




const get = async (): Promise<IOffice[]> => {
  return axiosClient.get('office/get')
};


export const officeApi = {
  get,
}
