import { createContext } from 'react'
import { FormInstance } from '../types/form-instance';
export const EditableContext = createContext<FormInstance<any> | null>(null);
