"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ContaCriada, Origem, StatusOperacional } from "@/types";
import { mockContas } from "@/mocks/contas";
import { mockLeads } from "@/mocks/leads";
import ScoreBadge from "@/components/dashboard/score-badge";

const GLASS_CARD_STYLE = {
  background: "rgba(240,218,172,0.04)",
  backdropFilter: "blur(40px) saturate(160%)",
  WebkitBackdropFilter: "blur(40px) saturate(160%)",
  border: "1px solid rgba(240,218,172,0.15)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(240,218,172,0.15)",
} as const;

const STATUS_LABELS: Record<StatusOperacional, string> = {
  [StatusOperacional.ContaCriada]: "Conta Criada",
  [StatusOperacional.DocumentacaoPendente]: "Doc. Pendente",
  [StatusOperacional.EmAnalise]: "Em Análise",
  [StatusOperacional.Aprovado]: "Aprovado",
  [StatusOperacional.Integrando]: "Integrando",
  [StatusOperacional.Ativo]: "Ativo",
};

const STATUS_DESCRIPTIONS: Record<StatusOperacional, string> = {
  [StatusOperacional.ContaCriada]:
    "Conta registrada, aguardando próximos passos",
  [StatusOperacional.DocumentacaoPendente]:
    "Documentação necessária para prosseguir",
  [StatusOperacional.EmAnalise]: "Em processo de análise pela equipe",
  [StatusOperacional.Aprovado]: "Aprovado, pronto para integração",
  [StatusOperacional.Integrando]: "Em processo de integração técnica",
  [StatusOperacional.Ativo]: "Conta ativa e operando normalmente",
};

const STATUS_STYLES: Record<StatusOperacional, { background: string; color: string }> =
  {
    [StatusOperacional.ContaCriada]: {
      background: "rgba(96,165,250,0.15)",
      color: "#60a5fa",
    },
    [StatusOperacional.DocumentacaoPendente]: {
      background: "rgba(251,191,36,0.15)",
      color: "#fbbf24",
    },
    [StatusOperacional.EmAnalise]: {
      background: "rgba(251,146,60,0.15)",
      color: "#fb923c",
    },
    [StatusOperacional.Aprovado]: {
      background: "rgba(74,222,128,0.15)",
      color: "#4ade80",
    },
    [StatusOperacional.Integrando]: {
      background: "rgba(34,211,238,0.15)",
      color: "#22d3ee",
    },
    [StatusOperacional.Ativo]: {
      background: "rgba(74,222,128,0.15)",
      color: "#4ade80",
    },
  };

const ORIGEM_LABELS: Record<Origem, string> = {
  [Origem.Instagram]: "Instagram",
  [Origem.WhatsApp]: "WhatsApp",
  [Origem.Google]: "Google",
  [Origem.Indicacao]: "Indicação",
  [Origem.ManyChat]: "ManyChat",
  [Origem.API]: "API",
  [Origem.Manual]: "Manual",
};

const RESPONSAVEIS = [
  "Fernanda Lima",
  "Rafael Souza",
  "Marcos Vinicius",
  "Bianca Prado",
] as const;

const COUNTRIES = ["BR", "MX", "CO", "AR", "US", "PT"] as const;
const STATUS_OPTIONS = Object.values(StatusOperacional);

type Filters = {
  status: StatusOperacional | "";
  pais: string;
  responsavel: string;
};

const DEFAULT_FILTERS: Filters = {
  status: "",
  pais: "",
  responsavel: "",
};

function formatarData(data: string): string {
  const date = new Date(data);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = String(date.getFullYear());
  return `${dia}/${mes}/${ano}`;
}

function StatusOperacionalBadge({
  status,
  size = "sm",
}: {
  status: StatusOperacional;
  size?: "sm" | "lg";
}) {
  const style = STATUS_STYLES[status];
  const padding = size === "lg" ? "6px 12px" : "3px 10px";
  const fontSize = size === "lg" ? 12 : 11;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize,
        fontWeight: 500,
        padding,
        borderRadius: 20,
        background: style.background,
        color: style.color,
      }}
    >
      {status === StatusOperacional.Ativo ? (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#4ade80",
            animation: "pulse 2s infinite",
          }}
        />
      ) : null}
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function ContasCriadasPage() {
  const [filtros, setFiltros] = useState<Filters>(DEFAULT_FILTERS);
  const [contaSelecionada, setContaSelecionada] =
    useState<ContaCriada | null>(null);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-dropdown-root]")) return;
      setDropdownAberto(null);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const contasFiltradas = useMemo(() => {
    return mockContas.filter((conta) => {
      if (filtros.status && conta.statusOperacional !== filtros.status) {
        return false;
      }
      if (filtros.pais && conta.pais !== filtros.pais) {
        return false;
      }
      if (filtros.responsavel && conta.responsavel !== filtros.responsavel) {
        return false;
      }
      return true;
    });
  }, [filtros]);

  const totalContas = mockContas.length;
  const contasAtivas = mockContas.filter(
    (conta) => conta.statusOperacional === StatusOperacional.Ativo
  ).length;
  const contasIntegrando = mockContas.filter(
    (conta) => conta.statusOperacional === StatusOperacional.Integrando
  ).length;
  const contasPendentes = mockContas.filter(
    (conta) =>
      conta.statusOperacional === StatusOperacional.DocumentacaoPendente ||
      conta.statusOperacional === StatusOperacional.EmAnalise
  ).length;

  const leadOriginal = useMemo(() => {
    if (!contaSelecionada) return null;
    return (
      mockLeads.find((lead) => lead.id === contaSelecionada.leadId) ?? null
    );
  }, [contaSelecionada]);

  const handleRowClick = (conta: ContaCriada) => {
    setContaSelecionada(conta);
    setDrawerAberto(true);
    setDropdownAberto(null);
  };

  const handleCloseDrawer = () => {
    setDrawerAberto(false);
  };

  const selectStyle: CSSProperties = {
    background: "rgba(15,12,5,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "8px 16px",
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    appearance: "none",
    WebkitAppearance: "none",
    outline: "none",
    cursor: "pointer",
  };

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
            Contas Criadas
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              marginTop: 4,
            }}
          >
            {totalContas} contas registradas
          </div>
        </div>
        <button
          type="button"
          style={{
            background: "rgba(240,218,172,0.08)",
            border: "1px solid rgba(240,218,172,0.2)",
            borderRadius: 10,
            padding: "8px 16px",
            color: "rgba(255,255,255,0.8)",
            fontSize: 13,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          <svg
            width={15}
            height={15}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 3v10" />
            <path d="M6 9l4 4 4-4" />
            <path d="M4 17h12" />
          </svg>
          Exportar
        </button>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          {
            titulo: "Total de Contas",
            valor: totalContas,
            icon: (
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f0daac"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="7" y="7" width="3" height="3" rx="0.5" />
                <rect x="14" y="7" width="3" height="3" rx="0.5" />
                <rect x="7" y="14" width="3" height="3" rx="0.5" />
                <rect x="14" y="14" width="3" height="3" rx="0.5" />
              </svg>
            ),
          },
          {
            titulo: "Contas Ativas",
            valor: contasAtivas,
            icon: (
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f0daac"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 12.5l2.5 2.5 4.5-5" />
              </svg>
            ),
          },
          {
            titulo: "Em Integração",
            valor: contasIntegrando,
            icon: (
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f0daac"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 0 1 14.5-6.9" />
                <path d="M17 3v4h4" />
                <path d="M21 12a9 9 0 0 1-14.5 6.9" />
                <path d="M7 21v-4H3" />
              </svg>
            ),
          },
          {
            titulo: "Pendentes",
            valor: contasPendentes,
            icon: (
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f0daac"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            ),
          },
        ].map((card) => (
          <div
            key={card.titulo}
            style={{
              ...GLASS_CARD_STYLE,
              padding: 20,
              position: "relative",
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
                  "linear-gradient(90deg, transparent, rgba(240,218,172,0.3), transparent)",
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
              }}
            >
              {card.icon}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: 12,
              }}
            >
              {card.titulo}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#ffffff",
                marginTop: 4,
              }}
            >
              {card.valor}
            </div>
          </div>
        ))}
      </section>

      <section
        style={{
          ...GLASS_CARD_STYLE,
          padding: 16,
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
        }}
      >
        <select
          value={filtros.status}
          onChange={(event) =>
            setFiltros((prev) => ({
              ...prev,
              status: event.target.value as StatusOperacional | "",
            }))
          }
          style={selectStyle}
        >
          <option value="">Todos</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <select
          value={filtros.pais}
          onChange={(event) =>
            setFiltros((prev) => ({ ...prev, pais: event.target.value }))
          }
          style={selectStyle}
        >
          <option value="">Todos</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={filtros.responsavel}
          onChange={(event) =>
            setFiltros((prev) => ({
              ...prev,
              responsavel: event.target.value,
            }))
          }
          style={selectStyle}
        >
          <option value="">Todos</option>
          {RESPONSAVEIS.map((responsavel) => (
            <option key={responsavel} value={responsavel}>
              {responsavel}
            </option>
          ))}
        </select>
      </section>

      <section style={{ ...GLASS_CARD_STYLE, overflow: "hidden" }}>
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(240,218,172,0.4), transparent)",
          }}
        />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "rgba(240,218,172,0.05)" }}>
            <tr>
              {[
                "Empresa",
                "Responsável",
                "País",
                "Nicho",
                "Score Inicial",
                "Origem",
                "Status",
                "Data de Criação",
                "Ações",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "14px 16px",
                    textAlign: "left",
                    borderBottom: "1px solid rgba(240,218,172,0.1)",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contasFiltradas.map((conta) => (
              <tr
                key={conta.id}
                className="contas-row"
                onClick={() => handleRowClick(conta)}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>
                    {conta.empresa}
                  </div>
                  {conta.gatewayAccountId ? (
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                        fontFamily: "monospace",
                        marginTop: 4,
                      }}
                    >
                      {conta.gatewayAccountId}
                    </div>
                  ) : null}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    verticalAlign: "middle",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {conta.responsavel}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    verticalAlign: "middle",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {conta.pais}
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <span
                    style={{
                      background: "rgba(240,218,172,0.08)",
                      border: "1px solid rgba(240,218,172,0.15)",
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontSize: 11,
                      color: "#b5a472",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {conta.nicho}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <ScoreBadge score={conta.scoreInicial} />
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    verticalAlign: "middle",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {ORIGEM_LABELS[conta.origem]}
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <StatusOperacionalBadge status={conta.statusOperacional} />
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    verticalAlign: "middle",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {formatarData(conta.dataCriacaoConta)}
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <div style={{ position: "relative" }} data-dropdown-root>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setDropdownAberto((prev) =>
                          prev === conta.id ? null : conta.id
                        );
                      }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.02)",
                        color: "rgba(255,255,255,0.7)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <circle cx="10" cy="4" r="1.6" />
                        <circle cx="10" cy="10" r="1.6" />
                        <circle cx="10" cy="16" r="1.6" />
                      </svg>
                    </button>
                    {dropdownAberto === conta.id ? (
                      <div
                        onClick={(event) => event.stopPropagation()}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          right: 0,
                          minWidth: 200,
                          ...GLASS_CARD_STYLE,
                          border: "1px solid rgba(240,218,172,0.2)",
                          borderRadius: 12,
                          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                          overflow: "hidden",
                          zIndex: 20,
                        }}
                      >
                        {[
                          "Ver detalhes",
                          "Ver lead original",
                          "Atualizar status",
                        ].map((item) => (
                          <button
                            key={item}
                            type="button"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "10px 16px",
                              fontSize: 13,
                              color: "rgba(255,255,255,0.7)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {drawerAberto && contaSelecionada ? (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 49,
            }}
            onClick={handleCloseDrawer}
          />
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: 500,
              background: "rgba(15,12,5,0.97)",
              backdropFilter: "blur(40px)",
              borderLeft: "1px solid rgba(240,218,172,0.15)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
              zIndex: 50,
              transform: "translateX(0)",
              transition: "transform 0.3s ease",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: 24,
                borderBottom: "1px solid rgba(240,218,172,0.1)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                  {contaSelecionada.empresa}
                </div>
                {contaSelecionada.gatewayAccountId ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "monospace",
                      marginTop: 4,
                    }}
                  >
                    {contaSelecionada.gatewayAccountId}
                  </div>
                ) : null}
                <div style={{ marginTop: 12 }}>
                  <StatusOperacionalBadge
                    status={contaSelecionada.statusOperacional}
                    size="lg"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseDrawer}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                }}
              >
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M5 5l10 10" />
                  <path d="M15 5l-10 10" />
                </svg>
              </button>
            </div>

            <div
              style={{
                padding: 24,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 12,
                  }}
                >
                  Dados da Conta
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 16,
                  }}
                >
                  {[
                    {
                      label: "Responsável",
                      value: contaSelecionada.responsavel,
                    },
                    { label: "País", value: contaSelecionada.pais },
                    { label: "Nicho", value: contaSelecionada.nicho },
                    { label: "Origem", value: ORIGEM_LABELS[contaSelecionada.origem] },
                    {
                      label: "Score inicial",
                      value: contaSelecionada.scoreInicial,
                    },
                    {
                      label: "Data criação",
                      value: formatarData(contaSelecionada.dataCriacaoConta),
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: 4,
                        }}
                      >
                        {field.label}
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 12,
                  }}
                >
                  Status Operacional
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <StatusOperacionalBadge
                    status={contaSelecionada.statusOperacional}
                    size="lg"
                  />
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                    {STATUS_DESCRIPTIONS[contaSelecionada.statusOperacional]}
                  </div>
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 12,
                  }}
                >
                  Lead Original
                </div>
                {leadOriginal ? (
                  <div
                    style={{
                      ...GLASS_CARD_STYLE,
                      padding: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>
                        {leadOriginal.nome}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.45)",
                          marginTop: 4,
                        }}
                      >
                        {leadOriginal.empresa}
                      </div>
                    </div>
                    <ScoreBadge score={leadOriginal.score} />
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    Lead original não encontrado.
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                padding: 24,
                borderTop: "1px solid rgba(240,218,172,0.1)",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <button
                type="button"
                style={{
                  background: "rgba(240,218,172,0.08)",
                  border: "1px solid rgba(240,218,172,0.2)",
                  borderRadius: 10,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                  padding: "10px 16px",
                  cursor: "pointer",
                }}
              >
                Ver Lead
              </button>
              <button
                type="button"
                style={{
                  background: "linear-gradient(135deg, #f0daac, #b5a472)",
                  borderRadius: 10,
                  color: "#101010",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "10px 16px",
                  cursor: "pointer",
                }}
              >
                Atualizar Status
              </button>
            </div>
          </aside>
        </>
      ) : null}

      <style>{`
        .contas-row {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .contas-row:hover {
          background: rgba(240,218,172,0.03);
        }

        [data-dropdown-root] div button:hover {
          background: rgba(240,218,172,0.08);
          color: #ffffff;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.6);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
