import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Table } from 'antd';
import type { GetRef, InputRef, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { set } from 'date-fns';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
dayjs.locale('vi');

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface DataType {
    key: React.Key;
    name: string;
    thu: string;
    ngay: string;
    building: string;
    number: number;
    companyAddress: string;
    companyName: string;
    gender: string;
}

const ItemRender = () => {
    const [isSelect, setIsSelect] = useState(false);

    return <Button variant={
        isSelect ? "solid" : "outlined"
    } onClick={() => {
        setIsSelect(!isSelect);
    }} className='w-full' color="pink"></Button>;
}

const defaultColumns: ((ColumnGroupType<DataType> | ColumnType<DataType>) & { editable?: boolean; dataIndex?: string })[] = [
    {
        title: 'Tên phòng',
        fixed: 'start',
        children: [
            {
                title: 'Thứ',
                dataIndex: 'thu',
                key: 'thu',
                width: 80
            },
            {
                title: 'Ngày',
                dataIndex: 'ngay',
                key: 'ngay',
                width: 100
            },
        ],
    },
    {
        title: 'Hội An',
        width: 600,
        children: [
            {
                title: '08:30 - 11:30',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
                width: 100,
                render: () => {
                    return <ItemRender />;
                }
            },
            {
                title: '12:00 - 15:00',
                dataIndex: 'companyName',
                key: 'companyName',
                width: 100,
                render: () => {
                    return <ItemRender />;
                }
            },
            {
                title: '15:30 - 18:30',
                dataIndex: 'companyName',
                key: 'companyName',
                width: 100,
                render: () => {
                    return <ItemRender />;
                }
            },
            {
                title: '19:00 - 07:50',
                dataIndex: 'companyName',
                key: 'companyName',
                width: 100,
                render: () => {
                    return <ItemRender />;
                }
            },
        ],
    }
];

const start = dayjs();
const end = dayjs().add(1, 'month');
const dataSourceDefault: DataType[] = [];

function formatDayLabel(date: string | Date) {
    const d = dayjs(date);
    const today = dayjs();

    if (d.isSame(today, 'day')) {
        return 'Hôm nay';
    }

    const day = d.day();
    // day(): 0 = CN, 1 = T2, 2 = T3, ...

    if (day === 0) return 'CN';

    return `T${day + 1}`;
}
for (let date = start; date.isBefore(end); date = date.add(1, 'day')) {
    dataSourceDefault.push({
        thu: formatDayLabel(date.toDate()),
        key: date.format('DDMMYYYY'),
        name: 'John Brown',
        ngay: date.format('DD-MM-YYYY'),
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
    });
}
// const dataSource = Array.from({ length: 100 }).map<DataType>((_, i) => ({
//     key: i,
//     name: 'John Brown',
//     age: i + 1,
//     street: 'Lake Park',
//     building: 'C',
//     number: 2035,
//     companyAddress: 'Lake Street 42',
//     companyName: 'SoftLake Co',
//     gender: 'M',
// }));


interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    dataIndex: keyof DataType;
    record: DataType;
    handleSave: (record: DataType) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const [isSelect, setIsSelect] = useState(false);



    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };


    if (editable) {
        return <Button variant={
            isSelect ? "solid" : "outlined"
        } onClick={() => {
            setIsSelect(!isSelect);
        }} className='w-full' color="pink"></Button>;
    }

    return <td {...restProps}>{children}</td>;
};

export const KhungGioComponent = () => {

    const [dataSource, setDataSource] = useState<DataType[]>(dataSourceDefault);

    const handleSave = (row: DataType) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };


    return (
        <Table<DataType>
            pagination={false}
            className='text-xs'
            columns={columns as any}
            dataSource={dataSource}
            bordered
            size="small"
            scroll={{ y: 47 * 5 }}
            components={components}
            rowClassName={() => 'editable-row'}
        />

    )
}