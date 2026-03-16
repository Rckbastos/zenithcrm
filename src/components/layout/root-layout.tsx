"use client";

import type { ReactNode } from "react";
import { useUIStore } from "@/store/ui-store";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const sidebarWidthClass = sidebarCollapsed ? "w-[72px]" : "w-[260px]";

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`transition-all duration-300 ease-in-out ${sidebarWidthClass}`}
      >
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
}
