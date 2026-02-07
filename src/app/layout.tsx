'use client'
import { cn } from "@/lib/utils";
import "@/style/globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background font-sans")}>
        {children}
      </body>
    </html>
  );
}
