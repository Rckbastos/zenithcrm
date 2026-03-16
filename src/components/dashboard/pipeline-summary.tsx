"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

interface PipelineStageSummary {
  id: string;
  label: string;
  count: number;
}

interface PipelineSummaryProps {
  stages: PipelineStageSummary[];
}

const CARD_STYLE: CSSProperties = {
  background: "rgba(240,218,172,0.03)",
  border: "1px solid rgba(240,218,172,0.15)",
  borderRadius: 16,
  padding: 16,
  position: "relative",
  overflow: "hidden",
  backdropFilter: "blur(30px) saturate(160%)",
  WebkitBackdropFilter: "blur(30px) saturate(160%)",
  boxShadow:
    "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(240,218,172,0.25)",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
};

const BAR_COLORS = [
  "#94a3b8",
  "#fbbf24",
  "#60a5fa",
  "#a78bfa",
  "#fb923c",
  "#22d3ee",
  "#4ade80",
  "#f87171",
];

export default function PipelineSummary({ stages }: PipelineSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
      {stages.map((stage, index) => (
        <PipelineCard
          key={stage.id}
          stage={stage}
          barColor={BAR_COLORS[index] ?? "#94a3b8"}
        />
      ))}
    </div>
  );
}

interface PipelineCardProps {
  stage: PipelineStageSummary;
  barColor: string;
}

function PipelineCard({ stage, barColor }: PipelineCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...CARD_STYLE,
        ...(hovered
          ? {
              background: "rgba(240,218,172,0.07)",
              border: "1px solid rgba(240,218,172,0.35)",
              boxShadow:
                "0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(240,218,172,0.45)",
              transform: "translateY(-4px)",
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
          height: 2,
          background: barColor,
          borderRadius: "2px 2px 0 0",
        }}
      />
      <div style={{ fontSize: 28, fontWeight: 700, color: "white", marginTop: 8 }}>
        {stage.count}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          marginTop: 4,
          letterSpacing: "0.04em",
        }}
      >
        {stage.label}
      </div>
    </div>
  );
}
