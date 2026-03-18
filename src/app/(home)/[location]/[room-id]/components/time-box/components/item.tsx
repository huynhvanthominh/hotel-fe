import { Button, Tooltip } from "antd";
import { useState } from "react";

export const ItemRender = (props: {
    dataKey1: string,
    dataKey2: string,
    data: any,
    save: (data: any) => void,
    isBooked?: boolean,
    price: number
}) => {
    const { dataKey1, dataKey2, data, save, isBooked, price } = props;
    const [isSelect, setIsSelect] = useState(false);
    const button = (
        <Button
            onClick={() => {
                if (isBooked) return;
                const newData = { ...data };
                newData[dataKey1] = { ...newData[dataKey1], [dataKey2]: isSelect ? 0 : price };
                save(newData);
                setIsSelect(!isSelect);
            }}
            className={`w-full ${isSelect ? '!border-[#E0b0FF]' : '!border-[#C264FF]'} ${isBooked || isSelect ? '' : '!bg-white'}`}
            disabled={isBooked}

        ></Button>
    );

    if (isBooked) {
        return <Tooltip title="Đã được đặt">{button}</Tooltip>;
    }

    return button;
}