import { DataItem } from "../components/time-box";

export interface ICalculationParams {
    data: DataItem,
    roomId: string,
    servicePrice?: number
}

export interface ITime {
    date: string;
    time: string;
    price: number;
    roomId: string;
}

export const priceDiscount = (total: number, discount: number): number => {

    return total - total * discount / 100
}

export const calulationPrice = (params: ICalculationParams): {
    totalPrice: number,
    discountPercent: number,
    times: ITime[],
} => {
    const { data, roomId } = params;
    const rs = 0;
    const times: ITime[] = [];
    Object.entries(data[roomId]).forEach(([date, timeKey]) => {
        Object.entries(timeKey).forEach(([time, value]) => {
            if (!value) {
                return;
            }
            times.push({
                date,
                time,
                price: value,
                roomId
            })
        })
    })
    const totalSelect = times.length;
    //  show total and discount

    const totalPrice = times.reduce((sum, t) => sum + t.price, 0);
    let discountPercent = 0;
    if (totalSelect >= 2) {
        discountPercent = 10; // 10% discount
    } else {
        discountPercent = 0;
    }
    return {
        totalPrice,
        discountPercent,
        times,
    }
}