"use client";

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

export default function Topbar() {
  const pathname = usePathname();
  const title = routeTitles[pathname] ?? "Dashboard";
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="text-slate-400 transition-colors duration-300 ease-in-out hover:text-slate-600"
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
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="7" cy="7" r="4" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
          <input
            type="search"
            placeholder="Buscar..."
            className="h-10 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
          />
        </div>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors duration-300 ease-in-out hover:text-slate-700"
          aria-label="Notificações"
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-4 w-4"
          >
            <path d="M8 2.5c-2 0-3.5 1.6-3.5 3.5v2.2c0 .5-.2 1-.6 1.3L3 10.5h10l-0.9-1c-0.4-0.3-0.6-0.8-0.6-1.3V6c0-1.9-1.6-3.5-3.5-3.5z" />
            <circle cx="8" cy="13" r="1" />
          </svg>
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f0daac] px-1 text-[10px] font-semibold text-[#101010]">
            3
          </span>
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b5a472] text-sm font-semibold text-[#101010]">
          RB
        </div>
      </div>
    </header>
  );
}
