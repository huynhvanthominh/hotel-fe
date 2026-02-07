'use client'
import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Room" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
