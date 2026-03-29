import { IRoom } from "@/models/room";
import { ItemRender } from "../components/item";
import { ReactNode } from "react";
import { ROOM_PRICE_ENUM } from "@/enums/room-price.enum";
import {
    SunOutlined
} from '@ant-design/icons';
import { DataItem, ITimeBoxItem } from "..";

interface IUseColumnProps {
    rooms: IRoom[];
    data: DataItem;
    save: (data: DataItem) => void;
    bookedSlots: Set<string>;
    roomSelected: string | undefined
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
    const { rooms = [], data, save, bookedSlots, roomSelected } = props;
    return [
        {
            title: 'Tên phòng',
            fixed: 'start',
            className: '!bg-[#f7f7f7]',
            children: [
                {
                    className: '!bg-[#f7f7f7]',
                    title: 'Thứ',
                    dataIndex: 'thu',
                    key: 'thu',
                    width: 50,
                    render: (value: string, record: ITimeBoxItem) => {
                        const { isToday } = record;
                        return <div className={`${isToday ? 'text-[#c246ff]' : ''}`}>{value}</div>
                    }
                },
                {
                    className: '!bg-[#f7f7f7]',
                    title: 'Ngày',
                    dataIndex: 'ngay',
                    key: 'ngay',
                    width: 95,
                    render: (value: string, record: ITimeBoxItem) => {
                        const { isToday } = record;
                        return <div className={`${isToday ? 'text-[#c246ff]' : ''}`}>{value}</div>
                    }
                },
            ],
        },
        ...rooms.map((room, index) => {
            const { prices } = room;
            return {
                title: room?.name || '',
                width: 600,
                className: index % 2 === 0 ? `!bg-[#FFDE592E]` : `!bg-[#FFF]`,
                styles: {},
                children: prices.map((item) => {
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
                        className: index % 2 === 0 ? `!bg-[#FFDE592E]` : `!bg-[#FFF]`,
                        key: item.id,
                        width: 100,
                        editable: true,
                        render: (_: any, record: ITimeBoxItem) => {
                            const { id: roomId } = room;
                            const time = `${item.from}-${item.to}`;
                            const price = record[time];
                            const isBooked = bookedSlots.has(`${roomId}_${record.ngay}_${time}`);
                            return <ItemRender roomSelected={roomSelected} roomId={roomId} price={Number(price)} dataKey1={record.ngay} dataKey2={time} data={data} save={save} isBooked={isBooked} />;
                        }
                    }
                })
            }

        })
    ] as any;


}