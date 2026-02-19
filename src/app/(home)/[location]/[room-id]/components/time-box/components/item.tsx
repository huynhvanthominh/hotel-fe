import { Button, Tooltip } from "antd";
import { useState } from "react";

export const ItemRender = (props: {
    dataKey1: string,
    dataKey2: string,
    data: any,
    save: (data: any) => void,
    isBooked?: boolean
}) => {
    const { dataKey1, dataKey2, data, save, isBooked } = props;
    const [isSelect, setIsSelect] = useState(false);

    const button = (
        <Button
            variant={isBooked ? "solid" : (isSelect ? "solid" : "outlined")}
            onClick={() => {
                if (isBooked) return;
                const newData = { ...data };
                newData[dataKey1] = { ...newData[dataKey1], [dataKey2]: isSelect ? 0 : 1 };
                save(newData);
                setIsSelect(!isSelect);
            }}
            className={`w-full ${isSelect ? 'border-[#E0b0FF]' : 'border-[#C264FF]'}`}
            color={isBooked ? "volcano" : "pink"}
            disabled={isBooked}
        // style={isBooked ? { backgroundColor: '#e0e0e0', cursor: 'not-allowed', opacity: 0.6 } : {}}
        ></Button>
    );

    if (isBooked) {
        return <Tooltip title="Đã được đặt">{button}</Tooltip>;
    }

    return button;
}