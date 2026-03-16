"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui-store";

type IconProps = {
  className?: string;
};

const DashboardIcon = ({ className }: IconProps) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
    <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
    <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
  </svg>
);

const LeadsIcon = ({ className }: IconProps) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="10.5" cy="7" r="3" />
  </svg>
);

const PipelineIcon = ({ className }: IconProps) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <rect x="2" y="7" width="3" height="7" rx="0.5" />
    <rect x="6.5" y="4" width="3" height="10" rx="0.5" />
    <rect x="11" y="9" width="3" height="5" rx="0.5" />
  </svg>
);

const BuildingIcon = ({ className }: IconProps) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <rect x="2" y="2" width="12" height="12" rx="1" />
    <rect x="4" y="4" width="2.5" height="2.5" rx="0.3" />
    <rect x="9.5" y="4" width="2.5" height="2.5" rx="0.3" />
    <rect x="4" y="8" width="2.5" height="2.5" rx="0.3" />
    <rect x="9.5" y="8" width="2.5" height="2.5" rx="0.3" />
  </svg>
);

const AnalyticsIcon = ({ className }: IconProps) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <line x1="1.5" y1="14.5" x2="14.5" y2="14.5" />
    <rect x="2.5" y="9" width="2.5" height="5.5" rx="0.5" />
    <rect x="6.5" y="6" width="2.5" height="8.5" rx="0.5" />
    <rect x="10.5" y="3" width="2.5" height="11.5" rx="0.5" />
  </svg>
);

const AutomacoesIcon = ({ className }: IconProps) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <path d="M9.5 1.5L3.5 9h4l-1.5 5.5L12.5 7h-4z" />
  </svg>
);

const SettingsIcon = ({ className }: IconProps) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <circle cx="8" cy="8" r="2.5" />
    <line x1="8" y1="1.5" x2="8" y2="3.5" />
    <line x1="8" y1="12.5" x2="8" y2="14.5" />
    <line x1="2.6" y1="3.6" x2="4.1" y2="5.1" />
    <line x1="11.9" y1="10.9" x2="13.4" y2="12.4" />
    <line x1="11.9" y1="5.1" x2="13.4" y2="3.6" />
    <line x1="2.6" y1="12.4" x2="4.1" y2="10.9" />
  </svg>
);

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: DashboardIcon,
  },
  {
    label: "Leads",
    href: "/leads",
    icon: LeadsIcon,
  },
  {
    label: "Pipeline",
    href: "/pipeline",
    icon: PipelineIcon,
  },
  {
    label: "Contas Criadas",
    href: "/contas-criadas",
    icon: BuildingIcon,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: AnalyticsIcon,
  },
  {
    label: "Automações",
    href: "/automacoes",
    icon: AutomacoesIcon,
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: SettingsIcon,
  },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const widthClass = sidebarCollapsed ? "w-[72px]" : "w-[260px]";
  const logoSize = sidebarCollapsed
    ? { width: 36, height: 36 }
    : { width: 140, height: 48 };

  return (
    <aside
      className={`flex h-screen ${widthClass} flex-col border-r border-white/5 bg-[#101010] transition-all duration-300 ease-in-out overflow-hidden`}
    >
      <div
        className={`px-4 py-6 transition-all duration-300 ease-in-out ${
          sidebarCollapsed
            ? "flex flex-col items-center gap-3"
            : "flex items-center justify-between"
        }`}
      >
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Zenith CRM"
            width={logoSize.width}
            height={logoSize.height}
            style={{ objectFit: "contain" }}
          />
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="text-[#b5a472] transition-colors duration-300 ease-in-out hover:text-[#f0daac]"
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
            {sidebarCollapsed ? (
              <path d="M5.5 3.5L10.5 8L5.5 12.5" />
            ) : (
              <path d="M10.5 3.5L5.5 8L10.5 12.5" />
            )}
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`group flex items-center rounded-lg text-sm transition-all duration-300 ease-in-out ${
                    sidebarCollapsed
                      ? "justify-center px-0 py-2"
                      : "justify-start gap-2 px-3 py-2"
                  } ${
                    isActive
                      ? "bg-[#f0daac]/10 border-l-2 border-[#f0daac]"
                      : "border-l-2 border-transparent hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors duration-300 ease-in-out ${
                      isActive
                        ? "text-[#f0daac]"
                        : "text-white/40 group-hover:text-white/80"
                    }`}
                  />
                  <span
                    className={`overflow-hidden whitespace-nowrap text-sm transition-all duration-300 ease-in-out ${
                      sidebarCollapsed
                        ? "max-w-0 opacity-0"
                        : "max-w-[160px] opacity-100"
                    } ${
                      isActive
                        ? "text-[#f0daac]"
                        : "text-[rgba(255,255,255,0.6)] group-hover:text-[rgba(255,255,255,0.9)]"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="p-3 border-t border-white/5">
        {sidebarCollapsed ? (
          <div className="flex justify-center">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#b5a472",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#101010", fontWeight: 600, fontSize: 13 }}>
                RB
              </span>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#b5a472",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#101010", fontWeight: 600, fontSize: 13 }}>
                RB
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                Ricardo Bastos
              </span>
              <span style={{ color: "#b5a472", fontSize: 11 }}>Admin</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
