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
import { RoomCardItem } from "./components/room-card"
import { TimeBoxComponent } from "./[room-id]/components/time-box"



export default function LocationPage() {
  const [rooms, setRooms] = useState<IRoom[]>([])
  useEffect(() => {
    roomApi.get().then((res) => {
      setRooms(res)
    }).catch((err) => {
      console.error(err)
    })
  }, [])

  return (
    <section>
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 gap-2 lg:p-4 p-0 m-auto">
          {
            rooms.map((item) => {
              return (
                <div key={item.id} className="!flex w-full justify-around gap-8 max-w-[calc(100vw-16px)] lg-max-w-[calc(100vw-30%)]">
                  <RoomCardItem item={item} />
                </div>
              )
            })
          }
        </div>
        <div className="flex flex-col gap-2">
          {
            rooms.map(room => (
              <div key={room.id}>
                <TimeBoxComponent room={room} showPriceTamp />
              </div>
            ))
          }
        </div>
      </div >

    </section >

  )
}
