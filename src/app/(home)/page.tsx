'use client'

import { Avatar, Carousel, Image } from "antd";
import { officeList } from "./conts/office-list";
import { introduceList } from "./conts/introduce-list";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
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
                <div key={item.id} className="flex flex-col align-middle gap-2 cursor-pointer" onClick={() => {
                  router.push(item.id)
                }
                }>
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
              introduceList.map((item, index) => {
                return (
                  <div key={index} className="">
                    <img src={item} alt="" className="w-full" />

                  </div>
                )
              })
            }
          </Carousel>
        </div>
      </div>

    </section>
  );
}
