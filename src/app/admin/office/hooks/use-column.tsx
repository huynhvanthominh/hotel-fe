import { type ColumnTypes } from "../types/column-type";

export interface ColumnTypeExtends {
  editable?: boolean; 
  dataIndex: string;
  required?: boolean;
}

export const useColumn = (): (ColumnTypes[number] & ColumnTypeExtends)[] => {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '30%',
      editable: true,
      required: true
    },

    {
      title: 'address',
      dataIndex: 'address',
      editable: true,
    },
    {
      title: 'phone',
      dataIndex: 'phone',
      editable: true,
    },
    {
      title: 'email',
      dataIndex: 'email',
      editable: true,
    },

    {
      title: 'description',
      dataIndex: 'description',
      editable: true,
    },

    {
      title: 'status',
      dataIndex: 'status',
    },

    // {
    //   title: 'operation',
    //   dataIndex: 'operation',
    //   render: (_, record) =>
    //     dataSource.length >= 1 ? (
    //       <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
    //         <a>Delete</a>
    //       </Popconfirm>
    //     ) : null,
    // },

  ]
}
