"use client";

import { cloneElement, useState } from "react";
import type { CSSProperties, ReactElement, SVGProps } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: ReactElement<SVGProps<SVGSVGElement>>;
  accentColor?: string;
}

export default function KpiCard({
  title,
  value,
  change,
  icon,
  accentColor = "rgba(240,218,172,0.8)",
}: KpiCardProps) {
  const [hovered, setHovered] = useState(false);
  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeColor = isPositive
    ? "#4ade80"
    : isNegative
    ? "#f87171"
    : "rgba(255,255,255,0.25)";
  const changeText = change === 0 ? "—" : `${change > 0 ? "+" : ""}${change}`;

  const containerStyle: CSSProperties = {
    position: "relative",
    borderRadius: "20px",
    padding: "24px",
    background: "rgba(240,218,172,0.04)",
    backdropFilter: "blur(40px) saturate(160%)",
    WebkitBackdropFilter: "blur(40px) saturate(160%)",
    border: "1px solid rgba(240,218,172,0.2)",
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(240,218,172,0.3), inset 0 -1px 0 rgba(240,218,172,0.05), inset 1px 0 0 rgba(240,218,172,0.08)",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    cursor: "default",
    transform: "translateY(0px)",
    ...( { ["--accent-color" as string]: accentColor } as CSSProperties ),
  };

  return (
    <div
      style={{
        ...containerStyle,
        ...(hovered
          ? {
              background: "rgba(240,218,172,0.08)",
              border: "1px solid rgba(240,218,172,0.45)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(240,218,172,0.5), inset 0 -1px 0 rgba(240,218,172,0.08), 0 0 60px rgba(240,218,172,0.08)",
              transform: "translateY(-6px)",
            }
          : null),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: hovered
            ? "linear-gradient(90deg, transparent, rgba(240,218,172,0.7), transparent)"
            : "linear-gradient(90deg, transparent, rgba(240,218,172,0.4), transparent)",
          borderRadius: "20px 20px 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: 0,
          width: "1px",
          height: "50%",
          background:
            "linear-gradient(180deg, transparent, rgba(240,218,172,0.4), transparent)",
        }}
      />
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background:
            "linear-gradient(135deg, rgba(240,218,172,0.25) 0%, rgba(181,164,114,0.15) 100%)",
          border: "1px solid rgba(240,218,172,0.5)",
          boxShadow:
            "0 0 24px rgba(240,218,172,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {cloneElement(icon, {
          width: 20,
          height: 20,
          style: {
            ...(icon.props.style ?? {}),
            color: "#f0daac",
          },
        })}
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 12,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#ffffff",
          marginTop: 6,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          fontWeight: 500,
          color: changeColor,
        }}
      >
        {isPositive ? (
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M6 2L10 6" />
            <path d="M6 2L2 6" />
            <path d="M6 2V10" />
          </svg>
        ) : null}
        {isNegative ? (
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M6 10L10 6" />
            <path d="M6 10L2 6" />
            <path d="M6 2V10" />
          </svg>
        ) : null}
        <span>{changeText}</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(240,218,172,0.06), transparent)",
          filter: "blur(20px)",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
