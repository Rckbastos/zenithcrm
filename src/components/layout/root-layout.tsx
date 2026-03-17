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
      <div className="flex h-screen overflow-hidden">
        <div
          className={`transition-all duration-300 ease-in-out ${sidebarWidthClass}`}
        >
          <Sidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
          <Topbar />
          <main
            className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 transition-all duration-300 ease-in-out"
            style={{
              background:
                "linear-gradient(135deg, #1a1005 0%, #0d0b04 45%, #12100a 100%)",
              scrollbarWidth: "thin" as const,
              scrollbarColor: "rgba(240,218,172,0.3) rgba(255,255,255,0.03)",
            }}
          >
            <div
              style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-20%",
                  left: "-10%",
                  width: "900px",
                  height: "900px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(240,218,172,0.28) 0%, rgba(181,164,114,0.12) 35%, transparent 65%)",
                  filter: "blur(40px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "-10%",
                  right: "-10%",
                  width: "700px",
                  height: "700px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(139,105,20,0.2) 0%, rgba(181,164,114,0.08) 40%, transparent 65%)",
                  filter: "blur(50px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "30%",
                  width: "600px",
                  height: "500px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(254,243,220,0.07) 0%, transparent 65%)",
                  filter: "blur(70px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-5%",
                  left: "5%",
                  width: "500px",
                  height: "400px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(61,46,10,0.6) 0%, rgba(139,105,20,0.2) 40%, transparent 65%)",
                  filter: "blur(60px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "10%",
                  right: "0%",
                  width: "500px",
                  height: "500px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(240,218,172,0.12) 0%, transparent 65%)",
                  filter: "blur(70px)",
                }}
              />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
