import { STATUS_ENUM } from "@/enums/status.enum";
import { type IOffice } from "@/models/office";

export const officeList: IOffice[] = [1, 2, 3, 4, 5].map(item => {
  const office: IOffice = {
    id: item.toString(),
    name: "Cần Thơ" + item,
    address: "",
    description: "",
    phone: "",
    email: "",
    status: STATUS_ENUM.ACTIVE,
    imageUrl: "https://localhome.vn/uploads/2025/11/cau-can-tho-thumb-300x201.jpg"
  };

  return office;
})
