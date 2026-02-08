'use client'
import Container from "@/components/container";
import { Grid, Layout } from "antd";
import { useRouter } from "next/navigation";

const { Header, Footer, Sider, Content } = Layout;
const mainColor = '#E0b0FF'
const headerStyle: React.CSSProperties = {
  color: '#fff',
  backgroundColor: mainColor,
  height: 101,
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: mainColor,
};



export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  return (
    <>
      <main className="h-full " style={{
        minHeight: '100vh',
        height: '100vh'
      }}>
        <Layout className="overflow-hidden w-full max-w-full gap-4">
          <div className="flex justify-center align-middle" style={headerStyle}>
            <div className="flex w-7/12" style={{
            }}>
              <div className="flex">
                <div className="p-2 cursor-pointer" onClick={() => {
                  router.push("/")
                }}>
                  <img src="/taga-home-icon.png" alt="" className="max-w-full max-h-full" />
                </div>
              </div>
            </div>
            <div className="flex text-2xl items-center gap-4">
              <div>
                Tra cứu booking
              </div>
              <div>
                Nhường quyền
              </div>
              <div>
                Liên hệ
              </div>

            </div>
          </div>
          <Content className="w-8/12 mx-auto">
            <Container>{children}</Container>
          </Content>
          <div className="flex justify-center" style={footerStyle}>
            <div className="flex flex-col w-7/12" style={{
            }}>
              <div>
                <div className="flex justify-around">
                  <div className="flex flex-col ">
                    <div className="p-2 flex justify-center">
                      <img src="/taga-home-icon.png" alt="" className="" width={256} />
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
                  <div className="flex">
                    <div className="p-2">
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
                <div>
                  Hộ kinh doanh LOCAL HOME / Địa chỉ: Số B.07, chung cư Cadif - HP1, Hưng Phú, Q. Cái Răng, TP. Cần Thơ / Mã số hộ kinh doanh 8340125748-002 do Phòng Tài Chính - Kế Hoạch Quận Cái Răng cấp lần đầu ngày 13/11/2024. Chịu trách nhiệm nội dung: Trần Kim Tài
                </div>
              </div>



            </div>
          </div>

        </Layout>
      </main>
    </>
  );
}
