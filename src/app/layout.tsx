'use client'
import { cn } from "@/lib/utils";
import "@/style/globals.css";
import { WebSocketProvider } from "@/contexts/websocket-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn("bg-background font-sans")}>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </body>
    </html>
  );
}
