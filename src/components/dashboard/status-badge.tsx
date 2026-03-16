import type { CSSProperties } from "react";

interface StatusBadgeProps {
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  "Lead Captado": "#94a3b8",
  "Qualificação": "#fbbf24",
  "Lead Qualificado": "#60a5fa",
  "Proposta Enviada": "#a78bfa",
  "Negociação": "#fb923c",
  "Criou Conta": "#22d3ee",
  Convertido: "#4ade80",
  Perdido: "#f87171",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] ?? "rgba(255,255,255,0.5)";

  const textStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 500,
    color,
  };

  const dotStyle: CSSProperties = {
    width: 5,
    height: 5,
    borderRadius: "50%",
    backgroundColor: color,
  };

  return (
    <span style={textStyle}>
      <span style={dotStyle} />
      {status}
    </span>
  );
}
