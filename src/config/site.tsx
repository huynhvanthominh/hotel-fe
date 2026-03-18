import { Gauge, type LucideIcon, MessagesSquare } from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "Home",
  description: "Template for VisActor and Next.js",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "Dashboard",
    href: "/admin/dashboard",
  },

  {
    icon: MessagesSquare,
    name: "Room",
    href: "/admin/room",
  },
  {
    icon: MessagesSquare,
    name: "Office",
    href: "/admin/office",
  },

];
