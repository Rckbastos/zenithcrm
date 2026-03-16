import type { CSSProperties } from "react";

interface ScoreBadgeProps {
  score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  let color = "#4ade80";

  if (score <= 39) {
    color = "#f87171";
  } else if (score <= 69) {
    color = "#fbbf24";
  }

  const style: CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color,
  };

  return <span style={style}>{score}</span>;
}
