'use client';
import { Button, Carousel, Checkbox, GetProp, Input, Select, Upload, UploadProps, message } from "antd";
import { roomListData } from "../../conts/room-list";
import { KhungGioComponent } from "./khung-gio";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];



const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};


const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


export default function RoomDetail() {

  const data = roomListData[0];

  const [loading1, setLoading1] = useState(false);
  const [imageUrl1, setImageUrl1] = useState<string>();
  const [loading2, setLoading2] = useState(false);
  const [imageUrl2, setImageUrl2] = useState<string>();

  const handleChange1: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading1(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading1(false);
        setImageUrl1(url);
      });
    }
  };

  const uploadButton1 = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading1 ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Căn cước công dân mặt trước</div>
    </button>
  );

  const uploadButton2 = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading2 ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Căn cước công dân mặt sau</div>
    </button>
  );

  const handleChange2: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading2(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading2(false);
        setImageUrl2(url);
      });
    }
  };



  return (
    <div className="flex gap-4">
      <div className="w-8/12 flex flex-col gap-4">
        <div> <h1 className="text-3xl">{data.name}</h1></div>
        <div>
          <Carousel autoplay arrows >
            {
              data.images.map((item) => {
                return (
                  <div key={item.id}>
                    <img src={item.imageUrl} alt="room image" className="w-full object-cover" />
                  </div>
                )
              })
            }

          </Carousel>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl">
            Tiện  nghi phòng
          </div>
          <div className="grid grid-cols-4 gap-4">
            {data.amenities.map((amenity, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <img src={amenity.iconUrl} alt={amenity.name} className="w-6 h-6" />
                  <span>{amenity.name}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-2xl">
            Bảng giá
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.prices.map((item, index) => {
              return (
                <div key={index} className="flex">
                  <span className="font-bold">{item.price}</span>
                  <span>/{item.type}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <KhungGioComponent />
        </div>
        <div>
          Dich vu
        </div>
      </div>
      <div>
        <div>
          Thông tin đặt phòng
        </div>
        <div className="flex flex-col gap-4">
          <Input placeholder="Họ và tên"></Input>
          <Input placeholder="Số điện thoại"></Input>
          <span>* Bạn vui lòng nhập đúng số điện thoại, Home sẽ gửi thông tin check-in qua Zalo ạ</span>
          <Select className="w-full"
            placeholder="Số lượng khách"
            value={'2'}
            options={[
              { value: '1', label: '1 Khách' },
              { value: '2', label: '2 Khách' },
              { value: '3', label: '3 Khách' },
              { value: '4', label: '4 Khách' },
            ]} />
          <p>
            * Nếu {">"} 2 khách, Home xin phép phụ thu 50k/khách ạ!.
          </p>
          <p>
            * Home chỉ nhận tối đa 2 khách nếu khách book có khung giờ qua đêm.
          </p>
          <div className="flex flex-col gap-4">
            <div>Căn cước công dân</div>
            <div className="flex justify-around gap-4">
              <Upload
                name="cccd1"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                beforeUpload={beforeUpload}
                onChange={handleChange1}
              >
                {imageUrl1 ? (
                  <img draggable={false} src={imageUrl1} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton1
                )}
              </Upload>

              <Upload
                name="cccd2"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                beforeUpload={beforeUpload}
                onChange={handleChange2}
              >
                {imageUrl2 ? (
                  <img draggable={false} src={imageUrl2} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton2
                )}
              </Upload>
            </div>
            <p>
              * Để tránh bị ảnh hưởng khi qua đêm tại Home do cơ quan chức năng đến kiểm tra bất ngờ, nếu khai báo lưu trú thiếu thông tin của khách đi cùng nên khách book có khung giờ qua đêm, Home sẽ cần thêm thông tin CCCD của người đi cùng.
            </p>
            <p>
              * Thông tin CCCD của bạn được lưu trữ và bảo mật riêng tư để khai báo lưu trú, sẽ được xóa bỏ sau khi bạn check-out. Bạn vui lòng chọn đúng ảnh CCCD của người Đặt phòng và chịu trách nhiệm với thông tin trên.
            </p>
            <p>
              * Nếu không thể tải ảnh cccd thì quý khách hãy chọn dấu 3 chấm và Mở Trong Trình Duyệt
            </p>
            <div>
              <TextArea rows={4} placeholder="Ghi chú thêm cho Home (nếu có)" />
            </div>

            <div>
              <Checkbox>
                Xác nhận mọi người đã đủ tuổi vị thành niên, đồng ý rời khỏi và không được hoàn tiền nếu có dấu hiệu tệ nạn xã hội.
              </Checkbox>
              <Checkbox>
                Sau khi quét mã thanh toán thành công bạn hãy quay lại đây để chụp thông tin Booking (Tick để tiếp tục Đặt phòng)
              </Checkbox>
            </div>
            <div>
              Khi bấm 'Đặt phòng' đồng nghĩa với việc bạn đã đọc và đồng ý với các Nội quy & Chính sách của LocalHome
            </ div>
            <div>
              *Chú ý:
              <p>
                - Bạn đang đặt phòng tại: Home - Hồng Phát 2, Cần Thơ.

              </p>
              <p>
                - Đây là hệ thống đặt phòng tự động, nên khi bấm 'Đặt phòng' bạn sẽ được chuyển sang quét mã QR để thanh toán qua App ngân hàng, thời gian giữ phòng là 5 phút chờ thanh toán.
              </p>
            </div>
          </div>
        </div>
        <div>
          <Button className="w-full" variant="solid" color="pink">Đặt phòng</Button>
        </div>
      </div>
    </div>
  )
}
