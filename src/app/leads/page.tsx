"use client";

import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import type { Lead } from "@/types";
import { Origem, StatusPipeline } from "@/types";
import { mockLeads } from "@/mocks/leads";
import ScoreBadge from "@/components/dashboard/score-badge";
import StatusBadge from "@/components/dashboard/status-badge";

const GLASS_CARD_STYLE = {
  background: "rgba(240,218,172,0.04)",
  backdropFilter: "blur(40px) saturate(160%)",
  WebkitBackdropFilter: "blur(40px) saturate(160%)",
  border: "1px solid rgba(240,218,172,0.2)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(240,218,172,0.3)",
} as const;

const COUNTRIES = ["BR", "MX", "CO", "AR", "US", "PT"] as const;
const STATUS_OPTIONS = Object.values(StatusPipeline) as StatusPipeline[];
const ORIGEM_OPTIONS = Object.values(Origem) as Origem[];

type Filters = {
  search: string;
  status: StatusPipeline | "";
  origem: Origem | "";
  pais: string;
};

const DEFAULT_FILTERS: Filters = {
  search: "",
  status: "",
  origem: "",
  pais: "",
};

const STATUS_LABELS: Record<StatusPipeline, string> = {
  [StatusPipeline.LeadCaptado]: "Lead Captado",
  [StatusPipeline.Qualificacao]: "Qualificação",
  [StatusPipeline.LeadQualificado]: "Lead Qualificado",
  [StatusPipeline.PropostaEnviada]: "Proposta Enviada",
  [StatusPipeline.Negociacao]: "Negociação",
  [StatusPipeline.CriouConta]: "Criou Conta",
  [StatusPipeline.Convertido]: "Convertido",
  [StatusPipeline.Perdido]: "Perdido",
};

function formatarInteracao(data: string): string {
  const now = new Date();
  const target = new Date(data);
  const diffMs = now.getTime() - target.getTime();
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays >= 1) {
    return `há ${diffDays} ${diffDays === 1 ? "dia" : "dias"}`;
  }

  return `há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
}

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(mockLeads);
  const [filtros, setFiltros] = useState<Filters>(DEFAULT_FILTERS);
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState<string | null>(null);
  const itensPorPagina = 10;

  const filtrosAtivos =
    filtros.search || filtros.status || filtros.origem || filtros.pais;

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtros.search, filtros.status, filtros.origem, filtros.pais]);

  useEffect(() => {
    if (!dropdownAberto) return;
    const handleClick = () => setDropdownAberto(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dropdownAberto]);

  const leadsFiltrados = useMemo(() => {
    const search = filtros.search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch = search
        ? [lead.nome, lead.empresa, lead.email]
            .join(" ")
            .toLowerCase()
            .includes(search)
        : true;
      const matchesStatus = filtros.status
        ? lead.status === filtros.status
        : true;
      const matchesOrigem = filtros.origem
        ? lead.origem === filtros.origem
        : true;
      const matchesPais = filtros.pais ? lead.pais === filtros.pais : true;

      return matchesSearch && matchesStatus && matchesOrigem && matchesPais;
    });
  }, [leads, filtros]);

  const totalLeads = leadsFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalLeads / itensPorPagina));
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const leadsPaginados = leadsFiltrados.slice(inicio, fim);

  const abrirDrawer = (lead: Lead) => {
    setDropdownAberto(null);
    setLeadSelecionado(lead);
    setDrawerAberto(true);
  };

  const fecharDrawer = () => {
    setDrawerAberto(false);
    setLeadSelecionado(null);
  };

  const handleDropdownToggle = (
    event: MouseEvent<HTMLButtonElement>,
    leadId: string
  ) => {
    event.stopPropagation();
    setDropdownAberto((current) => (current === leadId ? null : leadId));
  };

  const handleDropdownClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
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
            Leads
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              marginTop: 4,
            }}
          >
            {leads.length} leads
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            style={{
              background: "rgba(240,218,172,0.08)",
              border: "1px solid rgba(240,218,172,0.2)",
              borderRadius: 10,
              padding: "8px 16px",
              color: "rgba(255,255,255,0.8)",
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg
              width={15}
              height={15}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <path d="M10 3v9" />
              <path d="M6.5 9.5L10 12.8L13.5 9.5" />
              <path d="M4 16h12" />
            </svg>
            Exportar
          </button>
          <button
            type="button"
            style={{
              background: "linear-gradient(135deg, #f0daac, #b5a472)",
              borderRadius: 10,
              padding: "8px 16px",
              color: "#101010",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 4px 16px rgba(240,218,172,0.3)",
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
            >
              <path d="M10 4v12" />
              <path d="M4 10h12" />
            </svg>
            Novo Lead
          </button>
        </div>
      </header>

      <section
        style={{
          ...GLASS_CARD_STYLE,
          padding: 16,
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <svg
            width={14}
            height={14}
            viewBox="0 0 20 20"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1.6}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M13.5 13.5L18 18" />
          </svg>
          <input
            value={filtros.search}
            onChange={(event) =>
              setFiltros((prev) => ({ ...prev, search: event.target.value }))
            }
            placeholder="Buscar lead, empresa..."
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 12px 8px 36px",
              color: "white",
              fontSize: 13,
              width: 220,
              outline: "none",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <select
            value={filtros.status}
            onChange={(event) =>
              setFiltros((prev) => ({
                ...prev,
                status: event.target.value as StatusPipeline | "",
              }))
            }
            style={{
              background: "rgba(15,12,5,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 32px 8px 12px",
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              cursor: "pointer",
              appearance: "none" as const,
              WebkitAppearance: "none" as const,
              outline: "none",
            }}
          >
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <svg
            width={14}
            height={14}
            viewBox="0 0 20 20"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1.6}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <path d="M5 7L10 12L15 7" />
          </svg>
        </div>

        <div style={{ position: "relative" }}>
          <select
            value={filtros.origem}
            onChange={(event) =>
              setFiltros((prev) => ({
                ...prev,
                origem: event.target.value as Origem | "",
              }))
            }
            style={{
              background: "rgba(15,12,5,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 32px 8px 12px",
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              cursor: "pointer",
              appearance: "none" as const,
              WebkitAppearance: "none" as const,
              outline: "none",
            }}
          >
            <option value="">Todas as origens</option>
            {ORIGEM_OPTIONS.map((origem) => (
              <option key={origem} value={origem}>
                {origem}
              </option>
            ))}
          </select>
          <svg
            width={14}
            height={14}
            viewBox="0 0 20 20"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1.6}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <path d="M5 7L10 12L15 7" />
          </svg>
        </div>

        <div style={{ position: "relative" }}>
          <select
            value={filtros.pais}
            onChange={(event) =>
              setFiltros((prev) => ({ ...prev, pais: event.target.value }))
            }
            style={{
              background: "rgba(15,12,5,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 32px 8px 12px",
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              cursor: "pointer",
              appearance: "none" as const,
              WebkitAppearance: "none" as const,
              outline: "none",
            }}
          >
            <option value="">Todos</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <svg
            width={14}
            height={14}
            viewBox="0 0 20 20"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1.6}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <path d="M5 7L10 12L15 7" />
          </svg>
        </div>

        {filtrosAtivos ? (
          <button
            type="button"
            onClick={() => setFiltros(DEFAULT_FILTERS)}
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 12,
              cursor: "pointer",
              background: "transparent",
              border: "none",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            Limpar
          </button>
        ) : null}
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
          <thead
            style={{
              background: "rgba(240,218,172,0.05)",
            }}
          >
            <tr
              style={{
                borderBottom: "1px solid rgba(240,218,172,0.1)",
              }}
            >
              {[
                "Lead",
                "Empresa",
                "Nicho",
                "País",
                "Origem",
                "Score",
                "Status",
                "Responsável",
                "Última interação",
                "Ações",
              ].map((label) => (
                <th
                  key={label}
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "14px 16px",
                    textAlign: "left",
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leadsPaginados.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => abrirDrawer(lead)}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background =
                    "rgba(240,218,172,0.03)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>
                    {lead.nome}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {lead.email}
                  </div>
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                    {lead.empresa}
                  </div>
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <span
                    style={{
                      background: "rgba(240,218,172,0.08)",
                      border: "1px solid rgba(240,218,172,0.2)",
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.8)",
                      display: "inline-block",
                    }}
                  >
                    {lead.nicho}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    {lead.pais}
                  </div>
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    {lead.origem}
                  </div>
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <ScoreBadge score={lead.score} />
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <StatusBadge status={STATUS_LABELS[lead.status]} />
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    {lead.responsavel}
                  </div>
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {formatarInteracao(lead.ultimaInteracao)}
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    verticalAlign: "middle",
                    position: "relative",
                  }}
                  onClick={handleDropdownClick}
                >
                  <button
                    type="button"
                    onClick={(event) => handleDropdownToggle(event, lead.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.3)",
                      padding: 0,
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.color = "rgba(255,255,255,0.3)";
                    }}
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="10" cy="4" r="1" fill="currentColor" />
                      <circle cx="10" cy="10" r="1" fill="currentColor" />
                      <circle cx="10" cy="16" r="1" fill="currentColor" />
                    </svg>
                  </button>
                  {dropdownAberto === lead.id ? (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        marginTop: 8,
                        background: "rgba(240,218,172,0.04)",
                        backdropFilter: "blur(30px) saturate(160%)",
                        WebkitBackdropFilter: "blur(30px) saturate(160%)",
                        border: "1px solid rgba(240,218,172,0.2)",
                        borderRadius: 12,
                        minWidth: 180,
                        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
                        zIndex: 10,
                      }}
                      onClick={handleDropdownClick}
                    >
                      {[
                        "Ver detalhes",
                        "Editar",
                        "Mover etapa",
                        "Marcar como perdido",
                      ].map((action) => (
                        <div
                          key={action}
                          style={{
                            padding: "10px 16px",
                            fontSize: 13,
                            color: "rgba(255,255,255,0.7)",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.background =
                              "rgba(240,218,172,0.08)";
                            event.currentTarget.style.color = "rgba(255,255,255,0.8)";
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.background = "transparent";
                            event.currentTarget.style.color =
                              "rgba(255,255,255,0.7)";
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            setDropdownAberto(null);
                          }}
                        >
                          {action}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderTop: "1px solid rgba(240,218,172,0.08)",
          }}
        >
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            Mostrando {leadsPaginados.length} de {totalLeads} leads
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => setPaginaAtual((prev) => Math.max(1, prev - 1))}
              disabled={paginaAtual === 1}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
                opacity: paginaAtual === 1 ? 0.3 : 1,
                cursor: paginaAtual === 1 ? "default" : "pointer",
              }}
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() =>
                setPaginaAtual((prev) => Math.min(totalPaginas, prev + 1))
              }
              disabled={paginaAtual >= totalPaginas}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
                opacity: paginaAtual >= totalPaginas ? 0.3 : 1,
                cursor: paginaAtual >= totalPaginas ? "default" : "pointer",
              }}
            >
              Próximo
            </button>
          </div>
        </div>
      </section>

      {drawerAberto && leadSelecionado ? (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 49,
            }}
            onClick={fecharDrawer}
          />
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: 480,
              background: "rgba(15,12,5,0.97)",
              backdropFilter: "blur(40px)",
              borderLeft: "1px solid rgba(240,218,172,0.15)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
              zIndex: 50,
              transform: drawerAberto ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: 24,
                borderBottom: "1px solid rgba(240,218,172,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                  {leadSelecionado.nome}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 4,
                  }}
                >
                  {leadSelecionado.empresa}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 12,
                    alignItems: "center",
                  }}
                >
                  <ScoreBadge score={leadSelecionado.score} />
                  <StatusBadge status={STATUS_LABELS[leadSelecionado.status]} />
                </div>
              </div>
              <button
                type="button"
                onClick={fecharDrawer}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                }}
              >
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                >
                  <path d="M5 5L15 15" />
                  <path d="M15 5L5 15" />
                </svg>
              </button>
            </div>

            <div
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                overflowY: "auto",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  Informações
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 16,
                  }}
                >
                  {[
                    { label: "Email", value: leadSelecionado.email },
                    { label: "Telefone", value: leadSelecionado.telefone },
                    { label: "País", value: leadSelecionado.pais },
                    { label: "Origem", value: leadSelecionado.origem },
                    { label: "Responsável", value: leadSelecionado.responsavel },
                    {
                      label: "Data de criação",
                      value: new Date(
                        leadSelecionado.dataCriacao
                      ).toLocaleDateString("pt-BR"),
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.8)",
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
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  Operação
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
                      label: "Ticket médio",
                      value: leadSelecionado.ticketMedio
                        ? `R$ ${leadSelecionado.ticketMedio}`
                        : "—",
                    },
                    {
                      label: "Volume estimado",
                      value: leadSelecionado.volumeEstimado
                        ? `R$ ${leadSelecionado.volumeEstimado}`
                        : "—",
                    },
                    {
                      label: "Gateway atual",
                      value: leadSelecionado.gatewayAtual ?? "—",
                    },
                    {
                      label: "Site",
                      value: leadSelecionado.site ?? "—",
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.8)",
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
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  Pipeline
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <StatusBadge status={STATUS_LABELS[leadSelecionado.status]} />
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    Última interação: {formatarInteracao(leadSelecionado.ultimaInteracao)}
                  </div>
                </div>
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
                  background: "rgba(240,218,172,0.04)",
                  border: "1px solid rgba(240,218,172,0.2)",
                  borderRadius: 12,
                  padding: "10px 16px",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Ver completo
              </button>
              <button
                type="button"
                style={{
                  background: "linear-gradient(135deg, #f0daac, #b5a472)",
                  borderRadius: 12,
                  padding: "10px 16px",
                  color: "#101010",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Mover etapa
              </button>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
