"use client";

import type { CSSProperties } from "react";
import { useUIStore } from "@/store/ui-store";
import { usePathname } from "next/navigation";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/leads": "Leads",
  "/pipeline": "Pipeline",
  "/contas-criadas": "Contas Criadas",
  "/analytics": "Analytics",
  "/automacoes": "Automações",
  "/configuracoes": "Configurações",
};

const containerStyle: CSSProperties = {
  background: "rgba(8,8,8,0.85)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderBottom: "1px solid rgba(240,218,172,0.08)",
  boxShadow: "inset 0 -1px 0 rgba(240,218,172,0.05)",
};

const searchStyle: CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--input-border, rgba(255,255,255,0.08))",
  color: "white",
  borderRadius: 10,
  fontSize: 13,
  padding: "8px 12px 8px 36px",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = routeTitles[pathname] ?? "Dashboard";
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header
      className="flex h-16 items-center justify-between px-6"
      style={containerStyle}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="text-[rgba(255,255,255,0.4)] transition-colors hover:text-[rgba(255,255,255,0.8)]"
          aria-label="Alternar sidebar"
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <line x1="2" y1="4" x2="14" y2="4" />
            <line x1="2" y1="8" x2="14" y2="8" />
            <line x1="2" y1="12" x2="14" y2="12" />
          </svg>
        </button>
        <h1 className="text-base font-medium text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <svg
            width={15}
            height={15}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]"
          >
            <circle cx="7" cy="7" r="4" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
          <input
            type="search"
            placeholder="Buscar..."
            className="focus:outline-none focus:[--input-border:rgba(240,218,172,0.3)] placeholder:text-[rgba(255,255,255,0.25)]"
            style={searchStyle}
          />
        </div>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center text-[rgba(255,255,255,0.4)] transition-colors hover:text-[rgba(240,218,172,0.8)]"
          aria-label="Notificações"
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M8 2.5c-2 0-3.5 1.6-3.5 3.5v2.2c0 .5-.2 1-.6 1.3L3 10.5h10l-0.9-1c-0.4-0.3-0.6-0.8-0.6-1.3V6c0-1.9-1.6-3.5-3.5-3.5z" />
            <circle cx="8" cy="13" r="1" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 14,
              height: 14,
              background: "#f0daac",
              color: "#101010",
              borderRadius: "50%",
              fontSize: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
            }}
          >
            3
          </span>
        </button>

        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f0daac, #b5a472)",
            color: "#101010",
            fontWeight: 600,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(240,218,172,0.25)",
          }}
        >
          RB
        </div>
      </div>
    </header>
  );
}
