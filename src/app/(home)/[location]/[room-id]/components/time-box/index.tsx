import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Table, Tooltip } from 'antd';
import type { GetRef, InputRef, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { IRoom, IRoomPrice } from '@/models/room';
import { bookingApi } from '@/api/booking';
import { type IBooking } from '@/models/booking';
import { BOOKING_STATUS_ENUM } from '@/enums/booking-status.enum';
import { useColumn } from './hooks/use-column';
dayjs.locale('vi');

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

export interface ITimeBoxItem {
  [key: string]: number | string;
  name: string;
  thu: string;
  ngay: string;
}



const start = dayjs();
const end = dayjs().add(1, 'month');


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
const dataSourceDefault = (params: { prices: IRoomPrice[] }) => {
  const { prices } = params;
  const data = [];
  for (let date = start; date.isBefore(end); date = date.add(1, 'day')) {
    const item: any = {
      thu: formatDayLabel(date.toDate()),
      ngay: date.format('DD-MM-YYYY'),
      key: date.format('DDMMYYYY'),
    }
    const timeItems = prices.map(item => {
      return {
        key: `${item.from}-${item.to}`,
        value: item.price
      }
    })
    timeItems
      .forEach(timeItem => {
        (item as any)[timeItem.key] = timeItem.value;
      });
    data.push(item);
  }

  return data;
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
  dataIndex: keyof ITimeBoxItem;
  record: ITimeBoxItem;
  handleSave: (record: ITimeBoxItem) => void;
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
      console.error('Save failed:', errInfo);
    }
  };

  if (editable) {
    return <Button variant={
      isSelect ? "solid" : "outlined"
    } onClick={() => {
      setIsSelect(!isSelect);
      save();
    }} className='w-full border-[#C264FF]' color="pink"></Button>;
  }

  return <td {...restProps}>{children}</td>;
};

interface IKhungGioProps {
  room?: IRoom | null;
  roomId?: string;
  onChange?: (data: Record<string, Record<string, number>>) => void;
}

export const TimeBoxComponent = ({ room, roomId, onChange }: IKhungGioProps) => {
  const { prices = [] } = room || {};
  const [dataSource, setDataSource] = useState<ITimeBoxItem[]>([]);
  // date => time => price
  const [data, setData] = useState<Record<string, Record<string, number>>>({});
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
            return [BOOKING_STATUS_ENUM.PENDING, BOOKING_STATUS_ENUM.SUCCESS].includes(b.status as BOOKING_STATUS_ENUM);
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
  const handleSave = (row: ITimeBoxItem) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const defaultColumns = useColumn({ room, data, save: setData, bookedSlots });

  const columns = defaultColumns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ITimeBoxItem) => ({
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

  useEffect(() => {
    setDataSource(dataSourceDefault({ prices }));
  }, [prices])

  return (
    <Table<ITimeBoxItem>
      pagination={false}
      className='text-xs'
      columns={columns as any}
      loading={loading}
      dataSource={dataSource}
      bordered
      size="small"
      scroll={{ y: 47 * 5 }}
      components={components}
      rowClassName={() => 'editable-row'}
    />

  )
}