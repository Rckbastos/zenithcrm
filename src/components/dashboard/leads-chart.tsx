"use client";

import type { CSSProperties } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { origem: "Instagram", total: 24, convertidos: 8 },
  { origem: "WhatsApp", total: 38, convertidos: 15 },
  { origem: "Google", total: 12, convertidos: 4 },
  { origem: "Indicação", total: 18, convertidos: 9 },
  { origem: "API", total: 7, convertidos: 2 },
];

const containerStyle: CSSProperties = {
  position: "relative",
  borderRadius: "20px",
  padding: "28px",
  background: "rgba(240,218,172,0.03)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  border: "1px solid rgba(240,218,172,0.15)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(240,218,172,0.2)",
};

export default function LeadsChart() {
  return (
    <div style={containerStyle}>
      <div
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 500,
          marginBottom: 24,
        }}
      >
        Conversão por origem
      </div>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6} barCategoryGap={20}>
            <CartesianGrid
              strokeDasharray="1 6"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="origem"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(8,8,8,0.98)",
                border: "1px solid rgba(240,218,172,0.2)",
                borderRadius: 12,
                padding: 12,
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
              labelStyle={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 11,
                marginBottom: 6,
              }}
              itemStyle={{ color: "white", fontSize: 13 }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                  {value}
                </span>
              )}
            />
            <Bar
              name="Total"
              dataKey="total"
              fill="#6366f1"
              opacity={0.85}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              name="Convertidos"
              dataKey="convertidos"
              fill="#f0daac"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
