import { TableProps } from "antd";
import { IDataType } from "./data-type";

export type ColumnTypes = Exclude<TableProps<IDataType>['columns'], undefined>; 
