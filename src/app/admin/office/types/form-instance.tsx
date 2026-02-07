import { Form, FormInstance, GetRef } from "antd";

export type FormInstance<T> = GetRef<typeof Form<T>>;
