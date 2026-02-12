import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Table, Tooltip } from 'antd';
import type { GetRef, InputRef, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { set } from 'date-fns';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { IRoom } from '@/models/room';
import { bookingApi } from '@/api/booking';
import type { IBooking } from '@/models/booking';
import { BOOKING_STATUS_ENUM } from '../../../../enums/booking-status.enum';
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

const ItemRender = (props: {
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
      className='w-full'
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

const defaultColumns: any = (room: IRoom, data: any, save: (data: any) => void, bookedSlots: Set<string>) => [
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
    children: [
      {
        title: '08:30 - 11:30',
        dataIndex: 'time1',
        key: 'time1',
        width: 100,
        editable: true,
        render: (_: any, record: any) => {
          const isBooked = bookedSlots.has(`${record.ngay}_time1`);
          console.log('isBooked time1:', isBooked, `${record.ngay}_time1`, bookedSlots);
          return <ItemRender dataKey1={record.ngay} dataKey2={"time1"} data={data} save={save} isBooked={isBooked} />;
        }
      },
      {
        title: '12:00 - 15:00',
        dataIndex: 'time2',
        key: 'time2',
        width: 100,
        editable: true,
        render: (_: any, record: any) => {
          const isBooked = bookedSlots.has(`${record.ngay}_time2`);
          return <ItemRender dataKey1={record.ngay} dataKey2={"time2"} data={data} save={save} isBooked={isBooked} />;
        }
      },
      {
        title: '15:30 - 18:30',
        dataIndex: 'time3',
        key: 'time3',
        width: 100,
        render: (_: any, record: any) => {
          const isBooked = bookedSlots.has(`${record.ngay}_time3`);
          return <ItemRender dataKey1={record.ngay} dataKey2={"time3"} data={data} save={save} isBooked={isBooked} />;
        }
      },
      {
        title: '19:00 - 07:50',
        dataIndex: 'time4',
        key: 'time4',
        width: 100,
        render: (_: any, record: any) => {
          const isBooked = bookedSlots.has(`${record.ngay}_time4`);
          return <ItemRender dataKey1={record.ngay} dataKey2={"time4"} data={data} save={save} isBooked={isBooked} />;
        }
      },
    ],
  }
] as any;

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

  if (day === 0) return 'CN';

  return `T${day + 1}`;
}
for (let date = start; date.isBefore(end); date = date.add(1, 'day')) {
  const item: any = {
    thu: formatDayLabel(date.toDate()),
    ngay: date.format('DD-MM-YYYY'),
    key: date.format('DDMMYYYY'),
  }
  const timeItems = [{ key: 'time1', value: '' }, { key: 'time2', value: '' }, { key: 'time3', value: '' }, { key: 'time4', value: '' }];
  timeItems
    .forEach(timeItem => {
      (item as any)[timeItem.key] = timeItem.value;
    });
  dataSourceDefault.push(item);
}

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
  const [editing, setEditing] = useState(true);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(true);
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
      save();
    }} className='w-full' color="pink"></Button>;
  }

  return <td {...restProps}>{children}</td>;
};

interface IKhungGioProps {
  room?: IRoom | null;
  roomId?: string;
  onChange?: (data: any) => void;
}

export const KhungGioComponent = ({ room, roomId, onChange }: IKhungGioProps) => {

  const [dataSource, setDataSource] = useState<DataType[]>(dataSourceDefault);
  const [data, setData] = useState<Record<string, Record<string, string>>>({});
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch existing bookings for this room
  useEffect(() => {
    if (roomId) {
      setLoading(true);
      bookingApi.getByRoomId(roomId)
        .then((bookings: IBooking[]) => {
          const bookedSet = new Set<string>();

          // Only consider confirmed and pending bookings
          const activeBookings = bookings.filter(b => {
            return [BOOKING_STATUS_ENUM.PENDING, BOOKING_STATUS_ENUM.SUCCESS].includes(b.status);
          }
          );

          activeBookings.forEach(booking => {
            if (booking.details) {
              booking.details.forEach(detail => {
                const key = `${detail.date}_${detail.time}`;
                bookedSet.add(key);
              });
            }
          });

          setBookedSlots(bookedSet);
        })
        .catch((err) => {
          console.error('Failed to fetch bookings:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [roomId]);
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

  const columns = defaultColumns(room, data, setData, bookedSlots).map((col: any) => {
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

  useEffect(() => {
    if (onChange) {
      onChange(data);
    }
  }, [data]);


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