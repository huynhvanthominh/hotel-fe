'use client'
import Container from "@/components/container";
import { Button, Drawer, Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const { Content } = Layout;
const mainColor = '#E0b0FF'
const headerStyle: React.CSSProperties = {
  color: '#fff',
  backgroundColor: mainColor,
  height: 101,
};




const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: mainColor,
};

const NavMenuMobile = () => {
  const router = useRouter();

  return (
    <div>
      <div onClick={() => router.push('/tra-cuu')}>
        Tra cứu booking
      </div>
      <div>
        Nhường quyền
      </div>
      <div>
        Liên hệ
      </div>
    </div>
  )
}


const NavMenu = () => {
  const router = useRouter();
  return (
    <>
      <div className="cursor-pointer" onClick={() => router.push('/tra-cuu')}>
        Tra cứu booking
      </div>
      <div>
        Nhường quyền
      </div>
      <div>
        Liên hệ
      </div>
    </>
  )
}


export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };



  return (
    <>
      <main className="h-full " style={{
        minHeight: '100vh',
        height: '100vh'
      }}>
        <Layout className="overflow-hidden w-full max-w-full gap-4">
          <div className="flex md:justify-center md:items-center md:px-0 px-4 overflow-hidden" style={headerStyle}>
            <div className="flex md:w-7/12 w-full" style={{
            }}>
              <div className="flex">
                <div className="p-2 cursor-pointer" onClick={() => {
                  router.push("/")
                }}>
                  <Image src="/taga-home-icon.png" width={80} height={80} alt=""  />
                </div>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <Button icon={<MenuOutlined />} onClick={showDrawer} />
              <Drawer
                title={<div>
                  0901 220 012 - 0907 273 571
                </div>}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
              >
                <NavMenuMobile />
              </Drawer>
            </div>
            <div className="md:flex hidden text-2xl items-center gap-4">
              <NavMenu />
            </div>
          </div>
          <Content className="md:w-8/12 w-full mx-auto">
            <Container>{children}</Container>
          </Content>
          <div className="flex justify-center" style={footerStyle}>
            <div className="flex flex-col md:w-7/12 w-full " style={{
            }}>
              <div>
                <div className="flex md:flex-row flex-col justify-around">
                  <div className="flex flex-col">
                    <div className="p-2 flex justify-center">
                      <Image src="/taga-home-icon.png" alt="" width={256} height={256} />
                    </div>
                    <div className="flex flex-col justify-start">
                      Hotline:
                      <ul>
                        <li>
                          0901 220 012
                        </li>
                        <li>
                          0907 273 571
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-2 md:block flex flex-col justify-center">
                      Chính sách
                      <ul className="flex flex-col justify-start">
                        <li>
                          Chính sách bảo mật thông tin
                        </li>
                        <li>
                          Nội quy và quy định
                        </li>
                        <li>
                          Hình thức thanh toán
                        </li>

                        <li>
                          Hướng dẫn sử dụng
                        </li>
                        <li>
                          Hướng dẫn tự check-in
                        </li>

                      </ul>
                    </div>
                  </div>
                </div>


              </div>
              <div>
                <div className="md:px-0 px-4">
                  Hộ kinh doanh TagaHome 85 Mậu Thân, Ninh Kiều, Thành Phố Cần Thơ
                </div>
              </div>

            </div>
          </div>

        </Layout>
      </main>
    </>
  );
}
