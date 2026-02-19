import { ROOM_PRICE_ENUM } from "@/enums/room-price.enum";
import { IRoomPrice } from "@/models/room"

interface IPriceComponentProps {
    prices: IRoomPrice[]
}

const mapType = (item: IRoomPrice): string => {
    const { type, from, to } = item;
    switch (type.toString()) {
        case ROOM_PRICE_ENUM.HOUR.toString():
            return `${from}-${to}`;
        case ROOM_PRICE_ENUM.NIGHT.toString():
            return `Qua đêm (${from} - ${to})`;
        case ROOM_PRICE_ENUM.DAY.toString():
            return 'Ngày';
        default:
            return type.toString();
    }
}

export function PriceComponent({ prices }: IPriceComponentProps) {
    return (
        <>
            <div className="text-2xl">
                Bảng giá
            </div>
            <div className="grid grid-cols-1 gap-4 bg-gray-200 p-2 border-gray-300 border-2 border-dashed">
                {prices.map((item, index) => {
                    return (
                        <div key={index} className="flex gap-1">
                            <span className="font-bold text-[#D697FF]">{parseFloat(item.price.toString()).toLocaleString('vi-VN')}</span>
                            <span>đ/{mapType(item)}</span>
                        </div>
                    )
                })}
            </div>
            <div className="text-[#C264FF]">
                Lưu ý: khách đặt phòng nguyên ngày liên hệ zalo 0797.201.097 của homstay
            </div>
        </>
    )
}