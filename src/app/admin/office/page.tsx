'use client'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Table } from 'antd';
import { officeApi } from '@/api/office';
import { STATUS_ENUM } from '@/enums/status.enum';
import { useColumn } from './hooks/use-column';
import { IDataType } from './types/data-type';
import { type ColumnTypes } from './types/column-type';
import { EditableCell } from './components/edit-cell';
import { EditableRow } from './components/edit-row';
import { PREFIX_ENUM } from '@/enums/prefix.enum';

export default function OfficePage() {

  const [dataSource, setDataSource] = useState<IDataType[]>([]);
  const dataRef = useRef<IDataType[]>([]);


const [isChange, setIsChange] = useState(false);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns = useColumn();
  const handleAdd = () => {
    const newData: IDataType = {
      id: `${PREFIX_ENUM.CREATE}-${Date.now().toString()}`,
      name: ``,
      address: ``,
      description: '',
      phone: '',
      email: '',
      status: STATUS_ENUM.ACTIVE
    };
    setDataSource([...dataSource, newData]);
    setIsChange(true)
  };

  const handleSaveRow = (row: IDataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    setIsChange(true);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IDataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSaveRow,
        required: col.required
      }),
    };
  });

  const getData = async () => {
    const rs = await officeApi.get();
    dataRef.current = rs;
    setDataSource(rs)
    setIsChange(false)
  }


  const handleSave = async () => {
    const data = dataSource.filter(item => item.id.startsWith(PREFIX_ENUM.CREATE) && item.name.length > 0)
    officeApi.create(data).then(rs => {
      if (rs.length > 0) {
        alert("Create success");
      }
      getData().then();
    }).catch(err => {
      alert("Create error");
      console.error(err)
    })
  }

  const handleReset = () => {
    setDataSource(dataRef.current)
    setIsChange(false)
  }

  useEffect(() => {
    getData().then().catch(err => {
      console.log(err)
    })
  }, [])

  return <section>
    <div>
      <div>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        {
          isChange && <>
            <Button onClick={handleReset} type="primary" style={{ marginBottom: 16 }}>
              Cancel
            </Button>
            <Button onClick={handleSave} type="primary" style={{ marginBottom: 16 }}>
              Save
            </Button>
          </>
        }

      </div>

      <Table<IDataType>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  </section>;
}
