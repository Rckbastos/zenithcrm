"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Lead } from "@/types";
import { Origem, StatusPipeline } from "@/types";
import { mockLeads } from "@/mocks/leads";
import { PIPELINE_STAGES } from "@/constants/pipeline-stages";
import ScoreBadge from "@/components/dashboard/score-badge";
import StatusBadge from "@/components/dashboard/status-badge";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

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

const STAGE_STATUS_MAP: Record<string, StatusPipeline> = {
  lead_captado: StatusPipeline.LeadCaptado,
  qualificacao: StatusPipeline.Qualificacao,
  lead_qualificado: StatusPipeline.LeadQualificado,
  proposta_enviada: StatusPipeline.PropostaEnviada,
  negociacao: StatusPipeline.Negociacao,
  criou_conta: StatusPipeline.CriouConta,
  convertido: StatusPipeline.Convertido,
  perdido: StatusPipeline.Perdido,
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

const RESPONSAVEIS = [
  "Fernanda Lima",
  "Rafael Souza",
  "Marcos Vinicius",
  "Bianca Prado",
] as const;

const COUNTRIES = ["BR", "MX", "CO", "AR", "US", "PT"] as const;
const ORIGEM_OPTIONS = Object.values(Origem) as Origem[];

type Filters = {
  responsavel: string;
  origem: Origem | "";
  pais: string;
};

const DEFAULT_FILTERS: Filters = {
  responsavel: "",
  origem: "",
  pais: "",
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

type Stage = (typeof PIPELINE_STAGES)[0];

interface KanbanColumnProps {
  stage: Stage;
  leads: Lead[];
  cor: string;
  onCardClick: (lead: Lead) => void;
}

interface KanbanCardProps {
  lead: Lead;
  cor: string;
  onClick: (lead: Lead) => void;
  isOverlay?: boolean;
}

function KanbanCard({ lead, cor, onClick, isOverlay = false }: KanbanCardProps) {
  const [hovered, setHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead.id, disabled: isOverlay });

  const dragTransform = transform ? CSS.Translate.toString(transform) : undefined;
  const baseTransform = dragTransform ?? (hovered ? "translateY(-2px)" : "translateY(0px)");
  const { border: _ignoredBorder, ...glassBase } = GLASS_CARD_STYLE;

  const cardStyle: CSSProperties = {
    ...glassBase,
    padding: 16,
    cursor: isOverlay ? "default" : "grab",
    borderTop: "1px solid rgba(240,218,172,0.15)",
    borderRight: "1px solid rgba(240,218,172,0.15)",
    borderBottom: "1px solid rgba(240,218,172,0.15)",
    borderLeft: `4px solid ${cor}`,
    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
    opacity: isDragging ? 0.4 : 1,
    transform: baseTransform,
  };

  const hoverStyle: CSSProperties = hovered && !isDragging && !isOverlay
    ? {
        background: "rgba(240,218,172,0.08)",
        borderTop: "1px solid rgba(240,218,172,0.25)",
        borderRight: "1px solid rgba(240,218,172,0.25)",
        borderBottom: "1px solid rgba(240,218,172,0.25)",
        borderLeft: `4px solid ${cor}`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        transform: "translateY(-2px)",
      }
    : {};

  const overlayStyle: CSSProperties = isOverlay
    ? {
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        opacity: 1,
        transform: "scale(1.02)",
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{ ...cardStyle, ...hoverStyle, ...overlayStyle }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(lead)}
      {...attributes}
      {...listeners}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>
        {lead.nome}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.4)",
          marginTop: 4,
        }}
      >
        {lead.empresa}
      </div>
      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <ScoreBadge score={lead.score} />
        <span
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "2px 8px",
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {lead.origem}
        </span>
        <span
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "2px 8px",
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {lead.pais}
        </span>
      </div>
      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
          {lead.responsavel}
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          {formatarInteracao(lead.ultimaInteracao)}
        </span>
      </div>
    </div>
  );
}

function KanbanColuna({ stage, leads, cor, onCardClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: stage.id });

  return (
    <div style={{ width: 280, flexShrink: 0 }} ref={setNodeRef}>
      <div style={{ height: 3, borderRadius: 3, background: cor, marginBottom: 12 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
          {stage.label}
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "2px 10px",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {leads.length}
        </div>
      </div>
      <div
        style={{
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 12,
        }}
      >
        {leads.map((lead) => (
          <KanbanCard key={lead.id} lead={lead} cor={cor} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [filtros, setFiltros] = useState<Filters>(DEFAULT_FILTERS);
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const leadsAtivos = leads.filter(
    (lead) => lead.status !== StatusPipeline.Perdido
  ).length;

  const leadsFiltrados = useMemo(() => {
    return leads.filter((lead) => {
      const matchesResponsavel = filtros.responsavel
        ? lead.responsavel === filtros.responsavel
        : true;
      const matchesOrigem = filtros.origem
        ? lead.origem === filtros.origem
        : true;
      const matchesPais = filtros.pais ? lead.pais === filtros.pais : true;

      return matchesResponsavel && matchesOrigem && matchesPais;
    });
  }, [leads, filtros]);

  const getLeadsByStage = (stageId: string) => {
    const status = STAGE_STATUS_MAP[stageId];
    return leadsFiltrados.filter((lead) => lead.status === status);
  };

  const handleCardClick = (lead: Lead) => {
    setLeadSelecionado(lead);
    setDrawerAberto(true);
  };

  const handleCloseDrawer = () => {
    setDrawerAberto(false);
    setLeadSelecionado(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = String(active.id);
    const nextStageId = String(over.id);
    const nextStatus = STAGE_STATUS_MAP[nextStageId];

    if (!nextStatus) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: nextStatus } : lead
      )
    );
  };

  const activeLead = useMemo(
    () => leads.find((lead) => lead.id === activeId) ?? null,
    [activeId, leads]
  );

  const overlayColor = activeLead
    ? STAGE_COLORS[
        Object.keys(STAGE_STATUS_MAP).find(
          (key) => STAGE_STATUS_MAP[key] === activeLead.status
        ) ?? "lead_captado"
      ]
    : "#94a3b8";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#ffffff" }}>
            Pipeline
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              marginTop: 4,
            }}
          >
            {leadsAtivos} leads ativos
          </div>
        </div>
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
      </header>

      <section
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <select
          value={filtros.responsavel}
          onChange={(event) =>
            setFiltros((prev) => ({ ...prev, responsavel: event.target.value }))
          }
          style={{
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
          }}
        >
          <option value="">Todos</option>
          {RESPONSAVEIS.map((responsavel) => (
            <option key={responsavel} value={responsavel}>
              {responsavel}
            </option>
          ))}
        </select>

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
            padding: "8px 16px",
            color: "rgba(255,255,255,0.7)",
            fontSize: 13,
            appearance: "none" as const,
            WebkitAppearance: "none" as const,
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">Todas</option>
          {ORIGEM_OPTIONS.map((origem) => (
            <option key={origem} value={origem}>
              {origem}
            </option>
          ))}
        </select>

        <select
          value={filtros.pais}
          onChange={(event) =>
            setFiltros((prev) => ({ ...prev, pais: event.target.value }))
          }
          style={{
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
          }}
        >
          <option value="">Todos</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </section>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <section
          className="kanban-scroll"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            paddingBottom: 16,
            minHeight: "calc(100vh - 220px)",
            scrollbarColor: "rgba(240,218,172,0.3) rgba(255,255,255,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              minWidth: "max-content",
              alignItems: "flex-start",
              minHeight: "calc(100vh - 252px)",
            }}
          >
            {PIPELINE_STAGES.map((stage) => (
              <KanbanColuna
                key={stage.id}
                stage={stage}
                leads={getLeadsByStage(stage.id)}
                cor={STAGE_COLORS[stage.id] ?? "#94a3b8"}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </section>

        <DragOverlay>
          {activeLead ? (
            <KanbanCard
              lead={activeLead}
              cor={overlayColor}
              onClick={() => undefined}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {drawerAberto && leadSelecionado ? (
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
              width: 480,
              background: "rgba(15,12,5,0.97)",
              backdropFilter: "blur(40px)",
              borderLeft: "1px solid rgba(240,218,172,0.15)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
              zIndex: 50,
              transform: drawerAberto ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
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
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <ScoreBadge score={leadSelecionado.score} />
                  <StatusBadge status={STATUS_LABELS[leadSelecionado.status]} />
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseDrawer}
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
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
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
                      label: "Data criação",
                      value: new Date(
                        leadSelecionado.dataCriacao
                      ).toLocaleDateString("pt-BR"),
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
                  background: "rgba(240,218,172,0.08)",
                  border: "1px solid rgba(240,218,172,0.2)",
                  borderRadius: 10,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                  padding: "10px 16px",
                  cursor: "pointer",
                }}
              >
                Ver completo
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
                Mover etapa
              </button>
            </div>
          </aside>
        </>
      ) : null}
      <style jsx global>{`
        .kanban-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.03);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
