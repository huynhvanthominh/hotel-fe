import { Upload, message, type UploadProps, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axiosClient from '@/api/aixos.config';
import { IImage } from '@/models/image';

interface IBaseUploadProps {
  title?: string;
  onChange?: (res: IImage) => void;
}

const uploadFile = async (options: any) => {
  const { file, onSuccess, onError } = options;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axiosClient.post(
      "image/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // ✅ TRẢ RESPONSE VỀ ANTD
    onSuccess?.(res);
  } catch (err) {
    onError?.(err as any);
  }
};

export function BaseUpload({ title, onChange }: IBaseUploadProps) {
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    customRequest: uploadFile,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        onChange?.(info.file.response as IImage);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>{title || "Click to Upload"}</Button>
    </Upload>
  );
}