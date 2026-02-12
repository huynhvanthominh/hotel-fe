'use client'

import { Avatar, Carousel } from "antd";
import { introduceList } from "./conts/introduce-list";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { officeApi } from "@/api/office";
import { getUrlFromFileId } from "@/utils/get-url-from-file-id";
import type { IOffice } from "@/models/office";
export default function HomePage() {
  const router = useRouter();

  const [offices, setOffices] = useState<IOffice[]>([]);

  useEffect(() => {
    officeApi.get().then(rs => {
      setOffices(rs);
      if (rs.length === 1) {
        router.push(rs[0].id)
      }
    }).catch(err => {
      alert("Get office failed");
      console.error(err)
    })
  }, [])

  if (offices.length === 0 || offices.length === 1) {
    // loading  of antd
    return <div className="h-screen"></div>
  }

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
            offices.map((item) => {
              return (
                <div key={item.id} className="flex flex-col align-middle gap-2 cursor-pointer" onClick={() => {
                  router.push(item.id)
                }
                }>
                  <div className="flex justify-center">
                    <Avatar src={getUrlFromFileId(item.imageId)} size={64} />
                  </div>
                  <div className="flex justify-center text-xl font-bold">
                    {item.name}
                  </div>
                  <div className="flex justify-center text-red-500">
                    4 Khung giờ
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

      {/* <div className="">
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
      </div> */}

    </section>
  );
}
