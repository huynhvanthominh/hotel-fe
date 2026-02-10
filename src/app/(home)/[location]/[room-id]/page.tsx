'use client';
import { Button, Carousel, Checkbox, Form, type GetProp, type GetRef, Image, Input, Modal, Select, type UploadProps, message } from "antd";
import { roomListData } from "../../conts/room-list";
import { KhungGioComponent } from "./khung-gio";
import { DichVuComponent } from "./dich-vu";
import { useState, createContext, useEffect } from "react";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams } from "next/navigation";
import Link from "next/link";
import { roomApi } from "@/api/room";
import { getUrlFromFileId } from "@/utils/get-url-from-file-id";
import { bookingApi } from "@/api/booking";
import { UploadCustom } from "@/components/upload-file";
import { IRoom } from "@/models/room";
import { useWebSocketContext } from "@/contexts/websocket-context";
import { WS_EVENTS, type TransactionSuccessData, type PaymentConfirmedData } from "@/types/websocket.types";
import { BOOKING_STATUS_ENUM, ICreateBookingRequest, IBookingService } from "@/models/booking";

const { TextArea } = Input;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = createContext<FormInstance<any> | null>(null);


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

  const { socket, isConnected, on, off, emit } = useWebSocketContext();
  const [bookingId, setBookingId] = useState<string>();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedServices, setSelectedServices] = useState<IBookingService[]>([]);
  const [serviceTotalPrice, setServiceTotalPrice] = useState(0);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);

  const [payload, setPayload] = useState<ICreateBookingRequest>({
    personCount: 2
  } as ICreateBookingRequest);

  // Calculate extra guest charge: 50,000 VND per guest over 2
  const extraGuestCharge = payload.personCount && payload.personCount > 2
    ? (payload.personCount - 2) * 50000
    : 0;

  // hast abc-xyz to bsae64
  const hashToBase64 = (hash: string) => {
    return Buffer.from(hash).toString('base64');
  }


  const [room, setRoom] = useState<IRoom>();
  const params = useParams();
  const roomId = params['room-id'] as string;

  const [imageUrl1, setImageUrl1] = useState<string>();
  const [imageUrl2, setImageUrl2] = useState<string>();


  const uploadButton1 = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {<PlusOutlined />}
      <div style={{ marginTop: 8 }}>Căn cước công dân mặt trước</div>
    </button>
  );

  const uploadButton2 = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {<PlusOutlined />}
      <div style={{ marginTop: 8 }}>Căn cước công dân mặt sau</div>
    </button>
  );


  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setBookingId(undefined);
    setPaymentSuccess(false);
    // Unsubscribe from booking updates
    if (socket && bookingId) {
      emit(WS_EVENTS.UNSUBSCRIBE_BOOKING, { bookingId });
    }
  };

  const handleDatphong = () => {
    if (!payload.fullName) {
      message.error('Vui lòng nhập họ và tên');
      return;
    }
    if (!payload.phone) {
      message.error('Vui lòng nhập số điện thoại');
      return;
    }
    if (!payload.personCount) {
      message.error('Vui lòng nhập số lượng khách');
      return;
    }
    if (!payload.cccdFrontImageId) {
      message.error('Vui lòng tải ảnh cccd mặt trước');
      return;
    }
    if (!payload.cccdBackImageId) {
      message.error('Vui lòng tải ảnh cccd mặt sau');
      return;
    }

    if (!check1) {
      message.error('Vui lòng đồng ý điều khoản 1');
      return;
    }
    if (!check2) {
      message.error('Vui lòng đồng ý điều khoản 2');
      return;
    }

    if (!payload.totalPrice) {
      message.error('Vui lòng chọn phòng và khung giờ');
      return;
    }

    const finalPayload = {
      ...payload,
      roomId: roomId as string,
      totalPrice: payload.totalPrice + serviceTotalPrice + extraGuestCharge,
      services: selectedServices.length > 0 ? selectedServices : undefined,
    };

    bookingApi.create(finalPayload).then((res) => {
      setBookingId(res.id);

      // Save booking ID to localStorage for tracking
      const existingBookings = localStorage.getItem('bookings');
      const bookingIds = existingBookings ? JSON.parse(existingBookings) : [];
      if (!bookingIds.includes(res.id)) {
        bookingIds.unshift(res.id); // Add to beginning of array
        localStorage.setItem('bookings', JSON.stringify(bookingIds));
      }
    }).catch((err) => {
      message.error('Đặt phòng thất bại');
    });
  }

  useEffect(() => {
    if (bookingId) {
      showModal();

      // Emit to server that we're waiting for this booking's payment
      if (isConnected && socket) {
        emit(WS_EVENTS.SUBSCRIBE_BOOKING, { bookingId });
      }
    }

  }, [bookingId, isConnected])

  // Listen for transaction success from WebSocket
  useEffect(() => {
    const handleTransactionSuccess = (data: TransactionSuccessData) => {
      console.log('Transaction success received:', data);

      // Check if this transaction is for current booking
      if (data.bookingId === bookingId) {
        setPaymentSuccess(true);
        message.success('Thanh toán thành công! Booking của bạn đã được xác nhận.');
        const old = localStorage.getItem('bookings');
        localStorage.setItem('bookings', JSON.stringify([data.bookingId, ...(old ? JSON.parse(old) : [])]));

        // Update booking status
        // bookingApi.update(bookingId, { status: BOOKING_STATUS_ENUM.CONFIRMED }).catch((err) => {
        //   console.error('Failed to update booking status:', err);
        // });
      }
    };

    const handlePaymentConfirmed = (data: PaymentConfirmedData) => {
      console.log('Payment confirmed received:', data);

      if (data.bookingId === bookingId && data.confirmed) {
        setPaymentSuccess(true);
        message.success('Thanh toán thành công! Booking của bạn đã được xác nhận.');

        // Update booking status
        bookingApi.update(bookingId, { status: BOOKING_STATUS_ENUM.CONFIRMED }).catch((err) => {
          console.error('Failed to update booking status:', err);
        });
      }
    };

    if (socket) {
      on(WS_EVENTS.TRANSACTION_SUCCESS, handleTransactionSuccess);
      on(WS_EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
    }

    return () => {
      if (socket) {
        off(WS_EVENTS.TRANSACTION_SUCCESS, handleTransactionSuccess);
        off(WS_EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      }
    };
  }, [socket, bookingId, on, off]);

  useEffect(() => {
    roomApi.getById(roomId).then((res) => {
      setRoom(res);
    }).catch((err) => {
      console.log(err);
    })
  }, [roomId]);

  return (
    <Form>
      <div className="flex md:flex-row flex-col gap-4">
        <div className="md:w-8/12 w-full flex flex-col gap-4">
          <div> <h1 className="text-3xl">{room?.name}</h1></div>
          <div>
            <Carousel autoplay arrows >
              {
                room?.images.map((item) => {
                  return (
                    <div key={item.id} className="!flex justify-center items-center bg-black">
                      <Image src={getUrlFromFileId(item.imageId)} width={240} height={480} alt="room image" className="w-full object-cover" />
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
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
              {roomListData[0].amenities.map((amenity, index) => {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <img src={amenity.iconUrl} alt={amenity.name} className="w-6 h-6" width={24} height={24} />
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
              {room?.prices.map((item, index) => {
                return (
                  <div key={index} className="flex">
                    <span className="font-bold">{parseFloat(item.price).toLocaleString('vi-VN')}</span>
                    <span>/{item.type}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <KhungGioComponent room={room} roomId={roomId} onChange={data => {
              let total = 0;
              const price = room?.prices.reduce((acc, curr) => {
                acc[curr.type] = curr.price;
                return acc;
              }, {} as Record<string, string>);

              const times: any = [];
              Object.keys(data).forEach(key => {
                const p = Object.entries(data[key]).filter(([_, value]) => value === 1).map(([key]) => key).map(item => {
                  const a = ['time1', 'time2', 'time3'].includes(item) ? '3h' : 'Đêm';
                  times.push({ date: key, time: item, price: +(price?.[a] || 0) || 0 });
                  return +(price?.[a] || 0);
                });

                total += p.reduce((a, b) => +a + +b, 0);
              });
              setPayload({
                ...payload,
                totalPrice: total,
                times
              })
            }} />
          </div>
          <div>
            <DichVuComponent
              onServiceChange={(services) => {
                setSelectedServices(services);
                const total = services.reduce((sum, s) => sum + s.price, 0);
                setServiceTotalPrice(total);
              }}
            />
          </div>
        </div>
        <div>
          <div>
            Thông tin đặt phòng
          </div>
          <div className="flex flex-col gap-4">
            <Input placeholder="Họ và tên" onChange={e => setPayload({
              ...payload,
              fullName: e.target.value
            })}></Input>
            <Input placeholder="Số điện thoại" onChange={e => {
              setPayload({
                ...payload,
                phone: e.target.value
              })
            }}></Input>
            <span>* Bạn vui lòng nhập đúng số điện thoại, Home sẽ gửi thông tin check-in qua Zalo ạ</span>
            <Select className="w-full"
              placeholder="Số lượng khách"
              value={payload.personCount?.toString()}
              onChange={e => {
                setPayload({
                  ...payload,
                  personCount: Number(e)
                })
              }}
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
                <div className="max-w-1/2">
                  <UploadCustom
                    onChange={(rs) => {
                      setImageUrl1(getUrlFromFileId(rs.id));
                      setPayload({ ...payload, cccdFrontImageId: rs.id });
                    }}
                  >
                    {imageUrl1 ? (
                      <img draggable={false} src={imageUrl1} alt="avatar" style={{ width: '90%' }} />
                    ) : (
                      uploadButton1
                    )}
                  </UploadCustom>

                </div>
                <div className="max-w-1/2">
                  <UploadCustom
                    onChange={(rs) => {
                      setImageUrl2(getUrlFromFileId(rs.id));
                      setPayload({ ...payload, cccdBackImageId: rs.id });
                    }}
                  >
                    {imageUrl2 ? (
                      <img draggable={false} src={imageUrl2} alt="avatar" style={{ width: '90%' }} />
                    ) : (
                      uploadButton2
                    )}
                  </UploadCustom>
                </div>
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
                <TextArea onChange={e => {
                  setPayload({
                    ...payload,
                    note: e.target.value
                  })
                }} rows={4} placeholder="Ghi chú thêm cho Home (nếu có)" />
              </div>

              <div>
                <Checkbox onChange={e => {
                  setCheck1(e.target.checked);
                }}>
                  Xác nhận mọi người đã đủ tuổi vị thành niên, đồng ý rời khỏi và không được hoàn tiền nếu có dấu hiệu tệ nạn xã hội.
                </Checkbox>
                <Checkbox onChange={e => {
                  setCheck2(e.target.checked);
                }}>
                  Sau khi quét mã thanh toán thành công bạn hãy quay lại đây để chụp thông tin Booking (Tick để tiếp tục Đặt phòng)
                </Checkbox>
              </div>
              <div>
                Khi bấm &apos;Đặt phòng&apos; đồng nghĩa với việc bạn đã đọc và đồng ý với các Nội quy & Chính sách của TagaHome
              </ div>
              <div>
                *Chú ý:
                <p>
                  {/* - Bạn đang đặt phòng tại: Home - Hồng Phát 2, Cần Thơ. */}

                </p>
                <p>
                  - Đây là hệ thống đặt phòng tự động, nên khi bấm &apos;Đặt phòng&apos; bạn sẽ được chuyển sang quét mã QR để thanh toán qua App ngân hàng, thời gian giữ phòng là 5 phút chờ thanh toán.
                </p>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          {payload.totalPrice > 0 && (
            <div className="bg-white border-2 border-pink-200 rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Chi tiết thanh toán</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tổng tiền phòng:</span>
                  <span className="font-semibold text-gray-900">
                    {payload.totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {serviceTotalPrice > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tổng tiền dịch vụ:</span>
                    <span className="font-semibold text-gray-900">
                      {serviceTotalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}

                {extraGuestCharge > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Phụ thu khách ({payload.personCount! - 2} khách):</span>
                    <span className="font-semibold text-gray-900">
                      {extraGuestCharge.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-pink-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-pink-600">
                      {(payload.totalPrice + serviceTotalPrice + extraGuestCharge).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <Button className="w-full" variant="solid" color="pink" onClick={handleDatphong}>Đặt phòng</Button>
          </div>
        </div>
      </div>
      <Modal
        title="Thanh toán"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnHidden={true}
        footer={paymentSuccess ? [
          <Button key="track" type="default" onClick={() => window.location.href = '/tra-cuu'}>
            Xem chi tiết booking
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            Đóng
          </Button>
        ] : null}
      >
        <div className="flex flex-col items-center gap-4">
          {paymentSuccess ? (
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán thành công!</h3>
              <p>Mã booking của bạn: <strong>{bookingId}</strong></p>
              <p className="mt-2">Thông tin chi tiết đã được gửi qua Zalo</p>
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-800">
                  Bạn có thể xem chi tiết booking bất kỳ lúc nào tại trang{' '}
                  <Link href="/tra-cuu" className="underline font-semibold">
                    Tra cứu booking
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className={isConnected ? "text-green-600 text-sm" : "text-orange-600 text-sm"}>
                {isConnected ? "● Đang chờ xác nhận thanh toán..." : "○ Đang kết nối..."}
              </div>
              <img
                src={`https://payment.pay2s.vn/quicklink/${process.env.NEXT_PUBLIC_BANK_BRANCH}/${process.env.NEXT_PUBLIC_BANK_ACCOUNT}/${process.env.NEXT_PUBLIC_BANK_NAME}?amount=${payload.totalPrice + serviceTotalPrice + extraGuestCharge}&is_mask=0&bg=0&memo=${hashToBase64(bookingId || '')}`}
                alt="QR Code thanh toán"
                width={400}
                height={400}
              />
              <p className="text-sm text-gray-600">Vui lòng quét mã QR để thanh toán</p>
              <div className="text-sm text-gray-600">
                <p>Tổng phòng: {payload.totalPrice?.toLocaleString('vi-VN')}đ</p>
                {serviceTotalPrice > 0 && (
                  <p>Tổng dịch vụ: {serviceTotalPrice.toLocaleString('vi-VN')}đ</p>
                )}
                {extraGuestCharge > 0 && (
                  <p>Phụ thu khách: {extraGuestCharge.toLocaleString('vi-VN')}đ</p>
                )}
                <p className="font-semibold mt-1">Tổng cộng: {(payload.totalPrice + serviceTotalPrice + extraGuestCharge).toLocaleString('vi-VN')}đ</p>
              </div>
            </>
          )}
        </div>
      </Modal>
    </Form>
  )
}
