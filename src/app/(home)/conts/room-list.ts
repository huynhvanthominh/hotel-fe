import { ROOM_PRICE_ENUM } from "@/enums/room-price.enum";
import { type IRoom } from "@/models/room"

export const roomListData = [1, 2, 3, 4, 5].map((item): IRoom => {
  const room: IRoom = {
    id: item.toString(),
    name: `Room ${item}`,
    type: "",
    description: "",
    officeId: "",
    prices: [],
    images: [{
      imageId: 'https://localhome.vn/uploads/2026/01/z7414962436891_955d00bf36465a5323d3511874347680.jpg',
      id: "1",
      roomId: item.toString()
    },
    {
      imageId: 'https://localhome.vn/uploads/2026/01/z7414962436891_955d00bf36465a5323d3511874347680.jpg',
      id: "2",
      roomId: item.toString()
    },
    {
      imageId: 'https://localhome.vn/uploads/2026/01/z7414962436891_955d00bf36465a5323d3511874347680.jpg',
      id: "3",
      roomId: item.toString()
    }, {
      imageId: 'https://localhome.vn/uploads/2026/01/z7414962436891_955d00bf36465a5323d3511874347680.jpg',
      id: "4",
      roomId: item.toString()
    }],
    amenities: [
      {
        amenity: {
          id: '1',
          imageId: 'https://hotel-be-n4bqe.ondigitalocean.app/api/image/get/4b429b75-2965-4661-91fe-e61af1328223',
          name: 'Máy chiếu',
        },
        id: '1',
        roomId: item.toString(),
        amenityId: '1'
      },
      {
        amenity: {
          id: '2',
          imageId: 'https://hotel-be-n4bqe.ondigitalocean.app/api/image/get/353226a9-6471-412f-b328-9d7a46ec3116',
          name: 'Giường King',
        },
        id: '2',
        roomId: item.toString(),
        amenityId: '2'
      },
      {
        amenity: {
          id: '3',
          imageId: 'https://hotel-be-n4bqe.ondigitalocean.app/api/image/get/9688fdb7-fb7e-425e-8b75-4bded5a6ca22',
          name: 'Cửa sổ',
        },
        id: '3',
        roomId: item.toString(),
        amenityId: '3'
      },
      {
        amenity: {
          id: '4',
          imageId: 'https://hotel-be-n4bqe.ondigitalocean.app/api/image/get/0854cba8-50e0-4138-b3fa-d66993349819',
          name: 'Wifi',
        },
        id: '4',
        roomId: item.toString(),
        amenityId: '4'
      },
    ]
  }
  return room;
})
