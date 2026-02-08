import { ROOM_PRICE_TYPE_ENUM, type IRoom } from "@/models/room"

export const roomListData = [1, 2, 3, 4, 5].map((item): IRoom => {
  const room: IRoom = {
    id: item.toString(),
    name: `Room ${item}`,
    type: "",
    description: "",
    officeId: "",
    prices: [{
      price: 150,
      type: ROOM_PRICE_TYPE_ENUM.BA_GIO
    }, {
      price: 300,
      type: ROOM_PRICE_TYPE_ENUM.QUA_DEM

    }],
    images: [{
      imageUrl: 'https://localhome.vn/uploads/2026/01/z7414962436891_955d00bf36465a5323d3511874347680.jpg',
      id: "1",
      roomId: item.toString()
    }]
  }
  return room;
})
