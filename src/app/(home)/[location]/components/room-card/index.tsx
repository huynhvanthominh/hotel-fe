import { IRoom } from "@/models/room";
import { getUrlFromFileId } from "@/utils/get-url-from-file-id";
import { Card, Button, Image } from "antd";
import { useParams, useRouter } from "next/navigation";
import { AmenityComponent } from "../../../../../components/amenity";

interface ICardItemProps {
    item: IRoom
}
export function RoomCardItem(props: ICardItemProps) {
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
                    draggable={false}
                    className="rounded-xs w-full h-48 object-cover"
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
                        <AmenityComponent amenities={item.amenities} />
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
                                        <span className="font-bold">{parseFloat(item.price.toString()).toLocaleString('vi-VN')}</span>

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
