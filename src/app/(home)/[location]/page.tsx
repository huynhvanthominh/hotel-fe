'use client'
import { Button, Card, Carousel, message, Modal, Image } from "antd"
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
      className="overflow-hidden"
      cover={
        <Image
          width={300}
          height={200}
          draggable={false}
          className="rounded-xs"
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

  return (
    <section>
      <div className="">
        <div className="grid md:grid-cols-1 lg:grid-cols-3 md:gap-8 gap-2  md:p-4 p-0">
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
        </div>
      </div >

    </section >

  )
}
