import { Form, Input, type InputRef } from "antd";
import { type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { EditableContext } from "../contexts/edit-cell.context";

export interface EditableCellProps<T> {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof T;
  record: T;
  handleSave: (record: T) => void;
  children: ReactNode,
  required?: boolean
}



export const EditableCell = <T,>({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  required,
  ...restProps
}: EditableCellProps<T>) => {
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

  const save = async () => {
    try {
      const values = await form.validateFields();

      // toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex as any}
        rules={[{ required: required, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
      >
        {children ?? ''}
      </div>
    );
  }

  return <td {...restProps} onBlur={() => {
    if (editable) {
      setEditing(false)
    }
  }} onClick={() => {
    if (editable) {
      toggleEdit();
    }
  }}>{childNode}</td>;
};


