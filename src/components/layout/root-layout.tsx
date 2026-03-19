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
    <>
      <style>{`
        main::-webkit-scrollbar { width: 6px; }
        main::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 3px; }
        main::-webkit-scrollbar-thumb { background: rgba(240,218,172,0.3); border-radius: 3px; }
        main::-webkit-scrollbar-thumb:hover { background: rgba(240,218,172,0.5); }

        .main-bg {
          background-image: linear-gradient(
            315deg,
            rgba(6,5,2,1) 0%,
            rgba(18,13,4,1) 20%,
            rgba(32,23,6,1) 40%,
            rgba(20,15,4,1) 60%,
            rgba(10,8,2,1) 80%,
            rgba(5,4,1,1) 100%
          );
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
      <div
        className="flex h-screen overflow-hidden"
        style={{ position: "relative" }}
      >
        <div
          className={`transition-all duration-300 ease-in-out ${sidebarWidthClass}`}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Sidebar />
        </div>
        <div
          className="flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out"
          style={{ position: "relative", zIndex: 1 }}
        >
          <Topbar />
          <main
            className="main-bg flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out"
            style={{
              scrollbarWidth: "thin" as const,
              scrollbarColor: "rgba(240,218,172,0.3) rgba(255,255,255,0.03)",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
