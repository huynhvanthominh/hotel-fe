'use client'
import { Button, Card, Carousel, message, Modal } from "antd"
import { type IRoom } from "@/models/room"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { roomApi } from "@/api/room"
import { getUrlFromFileId } from "@/utils/get-url-from-file-id"
import type { IBooking } from "@/models/booking"
import { bookingApi } from "@/api/booking"
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useWebSocketContext } from "@/contexts/websocket-context"
import { WS_EVENTS, type PaymentConfirmedData } from "@/types/websocket.types"
interface ICardItemProps {
  item: IRoom
}
const CardItem = (props: ICardItemProps) => {
  const { item } = props;
  const router = useRouter();
  const { location } = useParams();


  return (
    <Card
      hoverable
      variant="borderless"
      cover={
        <img
          draggable={false}
          alt="example"
          src={getUrlFromFileId(item.images[0]?.imageId)}
        />
      }
    >
      <div className="flex flex-col gap-3">
        <div className="text-xl font-bold">
          {item.name}
        </div>
        <div className="flex gap-2">
          {
            [
              'tien_nghi_may_chieu.png',
              'tien_nghi_guong_king.png',
              'tien_nghi_cua_so.png',
              'tien_nghi_wifi.png',
            ].map((item, index) => {
              return (
                <img src={item} key={index} width={24} />
              )
            })
          }
        </div>
        <div className="flex gap-2">
          <div>
            <div>
              Giá phòng
            </div>
            <div>
              {(item.prices ?? []).map((item, index) => {
                return (
                  <div key={index} className="flex">
                    <span className="font-bold">{parseFloat(item.price).toLocaleString('vi-VN')}</span>

                    <span>/{item.type}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex flex-1 items-end justify-end">
            <Button variant="solid" color="pink" onClick={() => router.push(`/${location}/${item.id}`)}>Đặt phòng</Button>
          </div>
        </div>

      </div>
    </Card>


  )
}

const TraCuu = () => {
  const { socket, isConnected, on, off } = useWebSocketContext();
  const bookings = localStorage.getItem('bookings');
  const [data, setData] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // hash abc-xyz to base64
  const hashToBase64 = (hash: string) => {
    return Buffer.from(hash).toString('base64');
  };

  useEffect(() => {
    if (bookings) {
      const bookingIds = JSON.parse(bookings);
      if (bookingIds && bookingIds.length > 0) {
        setLoading(true);
        bookingApi.getById(bookingIds[0])
          .then((res) => {
            setData(res);
          })
          .catch((err) => {
            console.log(err);
            message.error('Không thể tải thông tin đặt phòng');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleCancelBooking = () => {
    if (!data) return;

    Modal.confirm({
      title: 'Xác nhận hủy booking',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy booking này? Hành động này không thể hoàn tác.',
      okText: 'Hủy booking',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          setCancelling(true);
          await bookingApi.cancel(data.id);
          message.success('Hủy booking thành công');
          // Refresh booking data
          const updatedData = await bookingApi.getById(data.id);
          setData(updatedData);
        } catch (err) {
          console.error(err);
          message.error('Không thể hủy booking. Vui lòng thử lại sau.');
        } finally {
          setCancelling(false);
        }
      },
    });
  };

  const canCancelBooking = () => {
    if (!data) return false;
    const status = data.status.toUpperCase();
    return status === 'PENDING' || status === 'CONFIRMED';
  };

  const canPayBooking = () => {
    if (!data) return false;
    const status = data.status.toUpperCase();
    return status === 'PENDING';
  };

  const handleOpenPaymentModal = () => {
    setPaymentSuccess(false);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentSuccess(false);
  };

  // WebSocket payment listener
  useEffect(() => {
    if (!data || !isPaymentModalOpen) return;

    const handlePaymentConfirmed = (wsData: PaymentConfirmedData) => {
      console.log('Payment confirmed received:', wsData);
      if (wsData.bookingId === data.id) {
        setPaymentSuccess(true);
        message.success('Thanh toán thành công!');
        // Refresh booking data
        bookingApi.getById(data.id).then((updatedData) => {
          setData(updatedData);
        }).catch((err) => {
          console.error('Failed to refresh booking data:', err);
        });
      }
    };

    if (socket && isConnected) {
      // Emit to server that we're waiting for this booking's payment
      socket.emit(WS_EVENTS.SUBSCRIBE_BOOKING, { bookingId: data.id });
      on(WS_EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);

      return () => {
        off(WS_EVENTS.PAYMENT_CONFIRMED, handlePaymentConfirmed);
      };
    }
  }, [data, isPaymentModalOpen, socket, isConnected, on, off]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600';
      case 'PENDING':
        return 'text-orange-600';
      case 'CANCELLED':
        return 'text-red-600';
      case 'COMPLETED':
      case 'SUCCESS':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'COMPLETED':
      case 'SUCCESS':
        return 'Thành công';
      default:
        return status;
    }
  };

  const getTimeText = (time: string) => {
    const timeMap: Record<string, string> = {
      'time1': 'Khung giờ 1 (3h)',
      'time2': 'Khung giờ 2 (3h)',
      'time3': 'Khung giờ 3 (3h)',
      'time4': 'Qua đêm',
    };
    return timeMap[time] || time;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="text-xl">Không tìm thấy thông tin đặt phòng</div>
        <Button onClick={() => window.location.href = '/'}>Về trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold mb-2">Thông tin đặt phòng</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Mã booking:</span>
              <span className="font-mono font-semibold">{data.id}</span>
            </div>
            <div className="mt-2">
              <span className={`font-semibold text-lg ${getStatusColor(data.status)}`}>
                {getStatusText(data.status)}
              </span>
            </div>
            {data.status.toUpperCase() === 'CANCELLED' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 text-sm">
                  ⚠️ Booking này đã bị hủy. Vui lòng liên hệ với chúng tôi nếu bạn có thắc mắc.
                </p>
              </div>
            )}
          </div>

          {/* Room Information */}
          {data.room && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3">Thông tin phòng</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-600">Tên phòng:</span>
                  <span className="ml-2 font-semibold">{data.room.name}</span>
                </div>
                {data.room.description && (
                  <div>
                    <span className="text-gray-600">Mô tả:</span>
                    <span className="ml-2">{data.room.description}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-3">Thông tin khách hàng</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <span className="text-gray-600">Họ và tên:</span>
                <span className="ml-2 font-semibold">{data.fullName || data.customerName}</span>
              </div>
              <div>
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="ml-2 font-semibold">{data.phone || data.customerPhone}</span>
              </div>
              <div>
                <span className="text-gray-600">Số lượng khách:</span>
                <span className="ml-2">{data.personCount || data.numberOfGuests} người</span>
              </div>
              {data.note && (
                <div className="md:col-span-2">
                  <span className="text-gray-600">Ghi chú:</span>
                  <p className="ml-2 mt-1 text-gray-700">{data.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          {data.details && data.details.length > 0 && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3">Chi tiết đặt phòng</h2>
              <div className="space-y-2">
                {data.details.map((detail, index) => (
                  <div key={detail.id || index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div className="flex gap-4">
                      <span className="font-medium">{detail.date}</span>
                      <span className="text-gray-600">{getTimeText(detail.time)}</span>
                    </div>
                    <span className="font-semibold text-pink-600">{parseInt(detail.price).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {data.services && data.services.length > 0 && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3">Dịch vụ đã chọn</h2>
              <div className="space-y-2">
                {data.services.map((service, index) => {
                  const servicePrice = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
                  const totalServicePrice = servicePrice * service.quantity;
                  const serviceName = service.service?.name || `Dịch vụ #${service.serviceId.substring(0, 8)}`;
                  return (
                    <div key={service.id || index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div className="flex gap-4">
                        <span className="font-medium">{serviceName}</span>
                        <span className="text-gray-600">x {service.quantity}</span>
                      </div>
                      <span className="font-semibold text-pink-600">{totalServicePrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Thông tin thanh toán</h2>
            <div className="bg-pink-50 p-4 rounded-lg space-y-2">
              {(data.details && data.details.length > 0) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tiền phòng:</span>
                  <span className="font-semibold">
                    {data.details.reduce((sum, detail) => sum + parseInt(detail.price), 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}
              
              {(data.services && data.services.length > 0) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Dịch vụ:</span>
                  <span className="font-semibold">
                    {data.services.reduce((sum, service) => {
                      const price = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
                      return sum + (price * service.quantity);
                    }, 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}
              
              {(data.personCount && data.personCount > 2) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Phụ thu khách ({data.personCount - 2} khách):</span>
                  <span className="font-semibold">
                    {((data.personCount - 2) * 50000).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}
              
              <div className="border-t-2 border-pink-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-pink-600">
                    {typeof data.totalPrice === 'string'
                      ? parseFloat(data.totalPrice).toLocaleString('vi-VN')
                      : data.totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CCCD Images */}
          {(data.cccdFrontImageId || data.cccdBackImageId) && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Căn cước công dân</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.cccdFrontImageId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mặt trước</p>
                    <img
                      src={getUrlFromFileId(data.cccdFrontImageId)}
                      alt="CCCD mặt trước"
                      className="w-full rounded border"
                    />
                  </div>
                )}
                {data.cccdBackImageId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mặt sau</p>
                    <img
                      src={getUrlFromFileId(data.cccdBackImageId)}
                      alt="CCCD mặt sau"
                      className="w-full rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            {canPayBooking() && (
              <Button 
                type="primary"
                onClick={handleOpenPaymentModal}
              >
                Thanh toán
              </Button>
            )}
            {canCancelBooking() && (
              <Button 
                danger 
                loading={cancelling}
                onClick={handleCancelBooking}
              >
                Hủy booking
              </Button>
            )}
            <Button onClick={() => window.print()}>
              In thông tin
            </Button>
            <Button type="default" onClick={() => window.location.href = '/'}>
              Về trang chủ
            </Button>
          </div>
        </div>
      </Card>

      {/* Payment Modal */}
      <Modal
        title="Thanh toán"
        open={isPaymentModalOpen}
        onCancel={handleClosePaymentModal}
        destroyOnHidden={true}
        footer={paymentSuccess ? [
          <Button key="track" type="default" onClick={handleClosePaymentModal}>
            Đóng
          </Button>
        ] : [
          <Button key="cancel" onClick={handleClosePaymentModal}>
            Hủy
          </Button>
        ]}
      >
        <div className="flex flex-col items-center gap-4">
          {paymentSuccess ? (
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán thành công!</h3>
              <p>Mã booking của bạn: <strong>{data?.id}</strong></p>
              <p className="mt-2">Thông tin chi tiết đã được cập nhật</p>
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-800">
                  Trang sẽ tự động cập nhật trạng thái mới
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className={isConnected ? "text-green-600 text-sm" : "text-orange-600 text-sm"}>
                {isConnected ? "● Đang chờ xác nhận thanh toán..." : "○ Đang kết nối..."}
              </div>
              {data && (
                <>
                  <img
                    src={`https://payment.pay2s.vn/quicklink/${process.env.NEXT_PUBLIC_BANK_BRANCH}/${process.env.NEXT_PUBLIC_BANK_ACCOUNT}/${process.env.NEXT_PUBLIC_BANK_NAME}?amount=${data.totalPrice}&is_mask=0&bg=0&memo=${hashToBase64(data.id)}`}
                    alt="QR Code thanh toán"
                    width={400}
                    height={400}
                  />
                  <p className="text-sm text-gray-600">Vui lòng quét mã QR để thanh toán</p>
                  <div className="text-sm text-gray-600 w-full max-w-md">
                    {(data.details && data.details.length > 0) && (
                      <div className="flex justify-between">
                        <span>Tiền phòng:</span>
                        <span>{data.details.reduce((sum, detail) => sum + parseInt(detail.price), 0).toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}
                    {(data.services && data.services.length > 0) && (
                      <div className="flex justify-between">
                        <span>Dịch vụ:</span>
                        <span>{data.services.reduce((sum, service) => {
                          const price = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
                          return sum + (price * service.quantity);
                        }, 0).toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}
                    {(data.personCount && data.personCount > 2) && (
                      <div className="flex justify-between">
                        <span>Phụ thu khách:</span>
                        <span>{((data.personCount - 2) * 50000).toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-300">
                      <span>Tổng cộng:</span>
                      <span>{Number(data.totalPrice).toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                  <div className="mt-2 p-3 bg-orange-50 rounded">
                    <p className="text-sm text-orange-800">
                      ⏱️ Vui lòng hoàn tất thanh toán trong thời gian quy định
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default function LocationPage() {

  const [rooms, setRooms] = useState<IRoom[]>([])
  const { location } = useParams();

  useEffect(() => {
    roomApi.get().then((res) => {
      setRooms(res)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  if (location === 'tra-cuu') {

    return <TraCuu />
  }

  return (
    <section>
      {/* <div className="py-4 gap-4">
        <div className="flex justify-center gap-4">
          <h1 className="font-bold text-2xl">
            Điểm đến của bạn
          </h1>
        </div>
        <div className="flex justify-around flex-wrap gap-4">
          {
            officeList.map((item) => {
              return (
                <div key={item.id} className="flex flex-col align-middle gap-2 cursor-pointer">
                  <div className="flex justify-center">
                    <Avatar src={item.imageUrl} size={64} />
                  </div>
                  <div className="flex justify-center">
                    {item.name}
                  </div>
                  <div className="flex justify-center">
                    4 Khung giờ
                  </div>
                </div>
              )
            })
          }
        </div>
      </div> */}

      <div className="">
        <div className="">
          <Carousel className="" autoplay >
            {
              rooms.map((item) => {
                return (
                  <div key={item.id} className="!flex justify-around gap-8">
                    <div>
                      <CardItem item={item} />
                    </div>

                  </div>
                )
              })
            }
          </Carousel>
        </div>
      </div >

    </section >

  )
}
