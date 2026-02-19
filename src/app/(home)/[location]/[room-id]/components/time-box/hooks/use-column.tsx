import { IRoom } from "@/models/room";
import { ItemRender } from "../components/item";
import { ReactNode } from "react";
import { ROOM_PRICE_ENUM } from "@/enums/room-price.enum";
import {
    SunOutlined
} from '@ant-design/icons';

interface IUseColumnProps {
    room: IRoom | null | undefined;
    data: any;
    save: (data: any) => void;
    bookedSlots: Set<string>;
}

const switchType = (type: string): ReactNode => {
    switch (type) {
        case ROOM_PRICE_ENUM.HOUR.toString():
            return <SunOutlined />
        case ROOM_PRICE_ENUM.NIGHT.toString():
            return 'Đêm';
        default:
            return 'Ngày';
    }
}

export const useColumn = (props: IUseColumnProps) => {
    const { room, data, save, bookedSlots } = props;
    const prices = room?.prices ?? [];
    return [
        {
            title: 'Tên phòng',
            fixed: 'start',
            children: [
                {
                    title: 'Thứ',
                    dataIndex: 'thu',
                    key: 'thu',
                    width: 50
                },
                {
                    title: 'Ngày',
                    dataIndex: 'ngay',
                    key: 'ngay',
                    width: 95
                },
            ],
        },
        {
            title: room?.name || '',
            width: 600,
            children: prices.map(item => {
                return {
                    title: (
                        <div className="flex flex-col text-sm justify-center items-center">
                            <div>
                                {item.from}-{item.to}
                            </div>
                            <div>
                                {
                                    switchType(item.type.toString())
                                }
                            </div>

                        </div>
                    ),
                    key: item.id,
                    width: 100,
                    editable: true,
                    render: (_: any, record: any) => {
                        const isBooked = bookedSlots.has(`${record.ngay}_${item.id}`);
                        return <ItemRender dataKey1={record.ngay} dataKey2={item.id} data={data} save={save} isBooked={isBooked} />;
                    }
                }
            })
        }
    ] as any;


}