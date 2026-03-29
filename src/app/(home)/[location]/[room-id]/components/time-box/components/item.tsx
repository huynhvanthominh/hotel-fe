import { Button, Tooltip } from "antd";
import { useState } from "react";
import { DataItem } from "..";

export const ItemRender = (props: {
    dataKey1: string,
    dataKey2: string,
    data: DataItem,
    save: (data: DataItem) => void,
    isBooked?: boolean,
    price: number,
    roomId: string,
    roomSelected: string | undefined
}) => {
    const { dataKey1, dataKey2, data, save, isBooked, price, roomId, roomSelected } = props;
    const [isSelect, setIsSelect] = useState(false);
    const isBlock = !!roomSelected && roomId != roomSelected;
   
    const button = (
        <Button
            onClick={() => {
                if (isBooked || isBlock) return;
                let parent = { ...data };
                const newData = parent[roomId] ?? {};
                newData[dataKey1] = { ...newData[dataKey1], [dataKey2]: isSelect ? 0 : price };
                parent[roomId] = newData;

                save(parent);
                setIsSelect(!isSelect);
            }}
            className={`w-full ${isSelect ? '!border-[#E0b0FF]' : '!border-[#C264FF]'} ${isBooked || isSelect ? '' : '!bg-white'}`}
            disabled={isBooked || isBlock}

        ></Button>
    );

    if (isBooked) {
        return <Tooltip title="Đã được đặt">{button}</Tooltip>;
    }

    return button;
}