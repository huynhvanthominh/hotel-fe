import type { IAdminBooking } from "@/models/admin-booking";
import axiosClient from "../aixos.config";

const path = 'admin-booking';

export interface IAdminBookingEntity {
    roomId: string;
    date: string;
    time: string
}


export interface GetAdminBookingDto {
    id?: string;
    roomId?: string;
    date?: string;
    time?: string
    roomIds?: string[];
}

const get = async (query?: GetAdminBookingDto): Promise<IAdminBooking[]> => {
    return axiosClient.get(`${path}/get`, { params: query })
}



const create = async (payload: IAdminBooking) => {
    return axiosClient.post(`${path}/create`, payload)
}


export const adminBookingApi = {
    get,
    create
}