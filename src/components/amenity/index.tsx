import { IAmenity } from "@/models/amenetiy"
import { IRooomAmenity } from "@/models/room";
import { getUrlFromFileId } from "@/utils/get-url-from-file-id";
import { Avatar, Image } from "antd";

interface IAmenityProps {
    amenities: IRooomAmenity[]
}

interface IAmenityItemProps {
    url: string;
    name?: string;

}

export const AmenityItem = (props: IAmenityItemProps) => {
    const { url, name } = props;
    return (
        <div className="flex items-center gap-2">
            <Avatar size={36} className="border-[#E0b0FF] p-1" src={<img draggable={false} src={url} alt={name} />} />
            {name && <span>{name}</span>}
        </div>
    )
}


export function AmenityComponent(props: IAmenityProps) {
    const { amenities } = props;

    if (!amenities || amenities.length === 0) {
        return (
            [
                'tien_nghi_may_chieu.png',
                'tien_nghi_guong_king.png',
                'tien_nghi_cua_so.png',
                'tien_nghi_wifi.png',
            ].map((item, index) => {
                return (
                    <AmenityItem url={item} key={index} />
                )
            })
        )
    }

    return (
        amenities.map((item, index) => {
            return (
                <AmenityItem url={getUrlFromFileId(item.amenity.imageId)} key={index} />
            )
        })
    )
}