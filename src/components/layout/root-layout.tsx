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
        main::-webkit-scrollbar {
          width: 6px;
        }
        main::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.03);
          border-radius: 3px;
        }
        main::-webkit-scrollbar-thumb {
          background: rgba(240,218,172,0.3);
          border-radius: 3px;
        }
        main::-webkit-scrollbar-thumb:hover {
          background: rgba(240,218,172,0.5);
        }
      `}</style>
      <div
        className="flex h-screen overflow-hidden"
        style={{ position: "relative" }}
      >
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.04,
          }}
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "60%",
            height: "60%",
            background:
              "conic-gradient(from 180deg at 20% 20%, rgba(240,218,172,0.12) 0deg, transparent 60deg)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "50%",
            background:
              "conic-gradient(from 270deg at 80% 10%, rgba(181,164,114,0.1) 0deg, transparent 60deg)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20%",
            width: "60%",
            height: "40%",
            background:
              "conic-gradient(from 90deg at 50% 100%, rgba(240,218,172,0.07) 0deg, transparent 80deg)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
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
            className="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out"
            style={{
              background:
                "linear-gradient(135deg, #1f1a0e 0%, #17130a 25%, #100e08 50%, #13100a 75%, #1a1508 100%)",
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
