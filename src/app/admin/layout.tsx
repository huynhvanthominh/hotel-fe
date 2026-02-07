'use client'
import { SideNav } from "@/components/nav";
import "@/style/globals.css";
import { Providers } from "./providers";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <div className="flex min-h-[100dvh]">
        <SideNav />
        <div className="flex-grow overflow-auto">{children}</div>
      </div>
    </Providers>
  );
}
