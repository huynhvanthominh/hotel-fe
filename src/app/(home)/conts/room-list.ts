import { ROOM_PRICE_TYPE_ENUM, type IRoom } from "@/models/room"

export const roomListData = [1, 2, 3, 4, 5].map((item): IRoom => {
  const room: IRoom = {
    id: item.toString(),
    name: `Room ${item}`,
    type: "",
    description: "",
    officeId: "",
    prices: [{
      price: "150.000",
      type: ROOM_PRICE_TYPE_ENUM.BA_GIO
    }, {
      price: "300.000",
      type: ROOM_PRICE_TYPE_ENUM.QUA_DEM

    }],
    images: [{
      imageUrl: 'https://localhome.vn/uploads/2026/01/z7414962436891_955d00bf36465a5323d3511874347680.jpg',
      id: "1",
      roomId: item.toString()
    },
    {
      imageUrl: 'https://localhome.vn/uploads/2026/01/z7414962436891_955d00bf36465a5323d3511874347680.jpg',
      id: "2",
      roomId: item.toString()
    },
    {
      imageUrl: 'https://localhome.vn/uploads/2026/01/z7414962436891_955d00bf36465a5323d3511874347680.jpg',
      id: "3",
      roomId: item.toString()
    }, {
      imageUrl: 'https://localhome.vn/uploads/2026/01/z7414962436891_955d00bf36465a5323d3511874347680.jpg',
      id: "4",
      roomId: item.toString()
    }],
    amenities: [
      {
        iconUrl: 'https://hotel-be-n4bqe.ondigitalocean.app/api/image/get/4b429b75-2965-4661-91fe-e61af1328223',
        name: 'Máy chiếu',
      },
      {
        iconUrl: 'https://hotel-be-n4bqe.ondigitalocean.app/api/image/get/353226a9-6471-412f-b328-9d7a46ec3116',
        name: 'Giường King',
      },
      {
        iconUrl: 'https://hotel-be-n4bqe.ondigitalocean.app/api/image/get/9688fdb7-fb7e-425e-8b75-4bded5a6ca22',
        name: 'Cửa sổ',
      },
      {
        iconUrl: 'https://hotel-be-n4bqe.ondigitalocean.app/api/image/get/0854cba8-50e0-4138-b3fa-d66993349819',
        name: 'Wifi',
      },
    ]
  }
  return room;
})
