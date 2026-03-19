"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { mockLeads } from "@/mocks/leads";
import { mockContas } from "@/mocks/contas";
import { StatusPipeline, Origem } from "@/types";
import { PIPELINE_STAGES } from "@/constants/pipeline-stages";

const GLASS_CARD_STYLE = {
  background: "rgba(240,218,172,0.04)",
  backdropFilter: "blur(40px) saturate(160%)",
  WebkitBackdropFilter: "blur(40px) saturate(160%)",
  border: "1px solid rgba(240,218,172,0.15)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(240,218,172,0.15)",
} as const;

const STAGE_COLORS: Record<string, string> = {
  lead_captado: "#94a3b8",
  qualificacao: "#fbbf24",
  lead_qualificado: "#60a5fa",
  proposta_enviada: "#a78bfa",
  negociacao: "#fb923c",
  criou_conta: "#22d3ee",
  convertido: "#4ade80",
  perdido: "#f87171",
};

const STATUS_TO_STAGE: Record<StatusPipeline, string> = {
  [StatusPipeline.LeadCaptado]: "lead_captado",
  [StatusPipeline.Qualificacao]: "qualificacao",
  [StatusPipeline.LeadQualificado]: "lead_qualificado",
  [StatusPipeline.PropostaEnviada]: "proposta_enviada",
  [StatusPipeline.Negociacao]: "negociacao",
  [StatusPipeline.CriouConta]: "criou_conta",
  [StatusPipeline.Convertido]: "convertido",
  [StatusPipeline.Perdido]: "perdido",
};

const ORIGIN_COLORS: Record<Origem, string> = {
  [Origem.Instagram]: "#ec4899",
  [Origem.WhatsApp]: "#22c55e",
  [Origem.Google]: "#3b82f6",
  [Origem.Indicacao]: "#f59e0b",
  [Origem.ManyChat]: "#8b5cf6",
  [Origem.API]: "#6b7280",
  [Origem.Manual]: "#9ca3af",
};

const PERIOD_OPTIONS = [
  "Últimos 7 dias",
  "Últimos 30 dias",
  "Últimos 90 dias",
  "Todo período",
] as const;

const selectStyle = {
  background: "rgba(15,12,5,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "8px 16px",
  color: "rgba(255,255,255,0.7)",
  fontSize: 13,
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
  outline: "none",
  cursor: "pointer",
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR");
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export default function AnalyticsPage() {
  const [periodo, setPeriodo] = useState<(typeof PERIOD_OPTIONS)[number]>(
    "Últimos 30 dias"
  );

  const totalLeads = mockLeads.length;
  const qualifiedLeads = mockLeads.filter((lead) => lead.score >= 60).length;
  const convertedLeads = mockLeads.filter(
    (lead) => lead.status === StatusPipeline.Convertido
  ).length;

  const qualificationRate = totalLeads
    ? (qualifiedLeads / totalLeads) * 100
    : 0;
  const conversionRate = totalLeads ? (convertedLeads / totalLeads) * 100 : 0;

  const avgPipelineDays = useMemo(() => {
    if (!totalLeads) return 0;
    const totalDays = mockLeads.reduce((acc, lead) => {
      const start = new Date(lead.dataCriacao).getTime();
      const end = new Date(lead.ultimaInteracao).getTime();
      const diff = Math.max(0, end - start);
      return acc + diff / (1000 * 60 * 60 * 24);
    }, 0);
    return totalDays / totalLeads;
  }, [totalLeads]);

  const conversionByOrigin = useMemo(() => {
    return Object.values(Origem).map((origem) => {
      const leadsByOrigin = mockLeads.filter((lead) => lead.origem === origem);
      const converted = leadsByOrigin.filter(
        (lead) => lead.status === StatusPipeline.Convertido
      ).length;
      return {
        origem,
        total: leadsByOrigin.length,
        convertidos: converted,
      };
    });
  }, []);

  const leadsByCountry = useMemo(() => {
    const map = new Map<string, number>();
    mockLeads.forEach((lead) => {
      map.set(lead.pais, (map.get(lead.pais) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([pais, total]) => ({ pais, total }));
  }, []);

  const pipelineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PIPELINE_STAGES.forEach((stage) => {
      counts[stage.id] = 0;
    });
    mockLeads.forEach((lead) => {
      const stageId = STATUS_TO_STAGE[lead.status];
      counts[stageId] = (counts[stageId] ?? 0) + 1;
    });
    return counts;
  }, []);

  const maxStageCount = Math.max(
    1,
    ...PIPELINE_STAGES.map((stage) => pipelineCounts[stage.id] ?? 0)
  );

  const scoreDistribution = useMemo(() => {
    const ranges = [
      { label: "Baixo", min: 0, max: 25, color: "#f87171" },
      { label: "Regular", min: 26, max: 50, color: "#fbbf24" },
      { label: "Bom", min: 51, max: 75, color: "#60a5fa" },
      { label: "Excelente", min: 76, max: 100, color: "#4ade80" },
    ];

    return ranges.map((range) => {
      const count = mockLeads.filter(
        (lead) => lead.score >= range.min && lead.score <= range.max
      ).length;
      const percent = totalLeads ? (count / totalLeads) * 100 : 0;
      return { ...range, count, percent };
    });
  }, [totalLeads]);

  const performanceByOwner = useMemo(() => {
    const map = new Map<
      string,
      { total: number; converted: number; scoreSum: number; latest: string }
    >();

    mockLeads.forEach((lead) => {
      const existing = map.get(lead.responsavel) ?? {
        total: 0,
        converted: 0,
        scoreSum: 0,
        latest: lead.ultimaInteracao,
      };

      const latest =
        new Date(lead.ultimaInteracao).getTime() >
        new Date(existing.latest).getTime()
          ? lead.ultimaInteracao
          : existing.latest;

      map.set(lead.responsavel, {
        total: existing.total + 1,
        converted:
          existing.converted +
          (lead.status === StatusPipeline.Convertido ? 1 : 0),
        scoreSum: existing.scoreSum + lead.score,
        latest,
      });
    });

    return Array.from(map.entries())
      .map(([responsavel, stats]) => {
        const rate = stats.total ? (stats.converted / stats.total) * 100 : 0;
        const avgScore = stats.total ? stats.scoreSum / stats.total : 0;
        return {
          responsavel,
          total: stats.total,
          converted: stats.converted,
          rate,
          avgScore,
          latest: stats.latest,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, []);

  const originList = useMemo(() => {
    return conversionByOrigin
      .map((item) => ({
        ...item,
        percent: totalLeads ? (item.total / totalLeads) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [conversionByOrigin, totalLeads]);

  const nicheList = useMemo(() => {
    const map = new Map<string, number>();
    mockLeads.forEach((lead) => {
      map.set(lead.nicho, (map.get(lead.nicho) ?? 0) + 1);
    });

    return Array.from(map.entries())
      .map(([nicho, total]) => ({
        nicho,
        total,
        percent: totalLeads ? (total / totalLeads) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [totalLeads]);

  const kpiCards = [
    {
      label: "Total de Leads",
      value: totalLeads,
      variation: `${mockContas.length} contas criadas`,
      icon: (
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="9" r="3" />
          <circle cx="15" cy="11" r="3" />
          <path d="M4 20c0-3 2.5-5 5-5" />
          <path d="M11 20c0-2.5 2-4.5 4.5-4.5" />
        </svg>
      ),
    },
    {
      label: "Taxa de Qualificação",
      value: formatPercent(qualificationRate),
      variation: `${qualifiedLeads} leads qualificados`,
      icon: (
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8 10h4" />
          <path d="M14 10h2" />
          <path d="M8 14h2" />
          <path d="M12 14h4" />
        </svg>
      ),
    },
    {
      label: "Taxa de Conversão",
      value: formatPercent(conversionRate),
      variation: `${convertedLeads} leads convertidos`,
      icon: (
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 6h14" />
          <path d="M7 6v4c0 3 2 5 5 5h0c3 0 5-2 5-5V6" />
          <path d="M9 4h6" />
          <path d="M10 17h4" />
          <path d="M9 20h6" />
        </svg>
      ),
    },
    {
      label: "Tempo Médio no Pipeline",
      value: `${avgPipelineDays.toFixed(1)} dias`,
      variation: `Base ${totalLeads} leads`,
      icon: (
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#ffffff" }}>
            Analytics
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              marginTop: 4,
            }}
          >
            Visão analítica da operação comercial
          </div>
        </div>
        <select
          value={periodo}
          onChange={(event) =>
            setPeriodo(event.target.value as (typeof PERIOD_OPTIONS)[number])
          }
          style={selectStyle}
        >
          {PERIOD_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {kpiCards.map((card) => (
          <div
            key={card.label}
            style={{
              ...GLASS_CARD_STYLE,
              padding: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(240,218,172,0.4), transparent)",
              }}
            />
            <div
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(240,218,172,0.1)",
                border: "1px solid rgba(240,218,172,0.2)",
                borderRadius: 12,
                color: "#f0daac",
              }}
            >
              {card.icon}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: 12,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#ffffff",
                marginTop: 4,
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                marginTop: 6,
              }}
            >
              {card.variation}
            </div>
          </div>
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <div style={{ ...GLASS_CARD_STYLE, padding: 24 }}>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            Conversão por Origem
          </div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionByOrigin}>
                <CartesianGrid
                  strokeDasharray="1 6"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="origem"
                  stroke="none"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                />
                <YAxis
                  stroke="none"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,8,5,0.98)",
                    border: "1px solid rgba(240,218,172,0.2)",
                    borderRadius: 12,
                    color: "#ffffff",
                    fontSize: 12,
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Legend
                  wrapperStyle={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}
                />
                <Bar
                  dataKey="total"
                  name="Total"
                  fill="rgba(181,164,114,0.5)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="convertidos"
                  name="Convertidos"
                  fill="#f0daac"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...GLASS_CARD_STYLE, padding: 24 }}>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            Leads por País
          </div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByCountry} layout="vertical">
                <CartesianGrid
                  strokeDasharray="1 6"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="none"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="pais"
                  stroke="none"
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,8,5,0.98)",
                    border: "1px solid rgba(240,218,172,0.2)",
                    borderRadius: 12,
                    color: "#ffffff",
                    fontSize: 12,
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar
                  dataKey="total"
                  name="Total"
                  fill="rgba(181,164,114,0.6)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <div style={{ ...GLASS_CARD_STYLE, padding: 24 }}>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            Funil do Pipeline
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PIPELINE_STAGES.map((stage) => {
              const count = pipelineCounts[stage.id] ?? 0;
              const width = (count / maxStageCount) * 100;
              return (
                <div
                  key={stage.id}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.6)",
                      width: 120,
                    }}
                  >
                    {stage.label}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${width}%`,
                        height: "100%",
                        background: STAGE_COLORS[stage.id],
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#ffffff",
                      width: 24,
                      textAlign: "right",
                    }}
                  >
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...GLASS_CARD_STYLE, padding: 24 }}>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            Distribuição de Score
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {scoreDistribution.map((range) => (
              <div key={range.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    {range.label}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                    {range.count} ({formatPercent(range.percent)})
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    height: 8,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${range.percent}%`,
                      height: "100%",
                      background: range.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...GLASS_CARD_STYLE, padding: 24, marginBottom: 32 }}>
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 24,
          }}
        >
          Performance por Responsável
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                "Responsável",
                "Leads",
                "Convertidos",
                "Taxa",
                "Score Médio",
                "Última Atividade",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    paddingBottom: 12,
                    textAlign: "left",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {performanceByOwner.map((row) => {
              const rateColor = row.rate >= 15 ? "#4ade80" : row.rate >= 8 ? "#fbbf24" : "#f87171";
              const scoreColor = row.avgScore >= 70 ? "#4ade80" : row.avgScore >= 50 ? "#fbbf24" : "#f87171";
              return (
                <tr key={row.responsavel} className="analytics-row">
                  <td style={{ padding: "12px 0", color: "rgba(255,255,255,0.7)" }}>
                    {row.responsavel}
                  </td>
                  <td style={{ padding: "12px 0", color: "rgba(255,255,255,0.7)" }}>
                    {row.total}
                  </td>
                  <td style={{ padding: "12px 0", color: "rgba(255,255,255,0.7)" }}>
                    {row.converted}
                  </td>
                  <td style={{ padding: "12px 0", color: "rgba(255,255,255,0.7)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 54,
                          height: 6,
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.08)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, row.rate * 3)}%`,
                            height: "100%",
                            background: rateColor,
                          }}
                        />
                      </div>
                      <span>{formatPercent(row.rate)}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 0", color: scoreColor }}>
                    {row.avgScore.toFixed(0)}
                  </td>
                  <td style={{ padding: "12px 0", color: "rgba(255,255,255,0.7)" }}>
                    {formatDate(row.latest)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 24,
        }}
      >
        <div style={{ ...GLASS_CARD_STYLE, padding: 24 }}>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            Origens de Captação
          </div>
          {originList.map((item) => (
            <div
              key={item.origem}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}
            >
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", flex: 1 }}>
                {item.origem}
              </div>
              <div style={{ flex: 2 }}>
                <div
                  style={{
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.percent}%`,
                      height: "100%",
                      background: ORIGIN_COLORS[item.origem],
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {formatPercent(item.percent)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...GLASS_CARD_STYLE, padding: 24 }}>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            Distribuição por Nicho
          </div>
          {nicheList.map((item, index) => {
            const opacity = Math.max(0.3, 0.9 - index * 0.1);
            return (
              <div
                key={item.nicho}
                style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}
              >
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", flex: 1 }}>
                  {item.nicho}
                </div>
                <div style={{ flex: 2 }}>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percent}%`,
                        height: "100%",
                        background: "rgba(240,218,172,1)",
                        opacity,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  {formatPercent(item.percent)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .analytics-row {
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .analytics-row:hover {
          background: rgba(240,218,172,0.03);
        }
      `}</style>
    </div>
  );
}
