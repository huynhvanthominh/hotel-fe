 'use client'
 import { Avatar, Button, Card, Carousel } from "antd"
import { officeList } from "../conts/office-list"
import { roomListData } from "../conts/room-list"
import { type IRoom } from "@/models/room"
import { useParams, useRouter } from "next/navigation"
interface ICardItemProps {
  item: IRoom
}
const CardItem = (props: ICardItemProps) => {
  const { item } = props;
  const router = useRouter();
  const {location} = useParams();
  console.log('location', location);
  return (
    <Card
      hoverable
      variant="borderless"
      cover={
        <img
          draggable={false}
          alt="example"
          src={item.images[0].imageUrl}
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
              {item.prices.map((item, index) => {
                return (
                  <div key={index} className="flex">
                    <span className="font-bold">{item.price}</span>

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

  return (
    <section>
      <div className="py-4 gap-4">
        <div className="flex justify-center gap-4">
          <h1 className="font-bold text-2xl">
            Điểm đến của bạn
          </h1>
        </div>
        <div className="flex justify-around">
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
      </div>

      <div className="">
        <div className="">
          <Carousel className="" autoplay >
            {
              roomListData.map((item, index) => {
                return (
                  <div key={item.id} className="!flex justify-around gap-8">
                    <CardItem item={item} />
                    <CardItem item={item} />
                    <CardItem item={item} />
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
