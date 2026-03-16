"use client";

import type { CSSProperties } from "react";
import KpiCard from "@/components/dashboard/kpi-card";
import LeadsChart from "@/components/dashboard/leads-chart";
import PipelineSummary from "@/components/dashboard/pipeline-summary";
import ScoreBadge from "@/components/dashboard/score-badge";
import StatusBadge from "@/components/dashboard/status-badge";
import { mockLeads } from "@/mocks/leads";
import { mockContas } from "@/mocks/contas";
import { PIPELINE_STAGES } from "@/constants/pipeline-stages";
import { StatusPipeline } from "@/types";

const sectionTitleStyle: CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.6)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 500,
  marginBottom: 16,
};

const tableContainerStyle: CSSProperties = {
  background: "rgba(240,218,172,0.03)",
  border: "1px solid rgba(240,218,172,0.12)",
  borderRadius: 20,
  padding: 24,
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(240,218,172,0.15)",
};

const tableTitleStyle: CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.6)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 500,
  marginBottom: 20,
};

const headerCellStyle: CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.75)",
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  paddingBottom: 12,
  paddingRight: 16,
  textAlign: "left",
};

const bodyCellStyle: CSSProperties = {
  fontSize: 13,
  color: "rgba(255,255,255,0.7)",
  padding: "10px 16px 10px 0",
  verticalAlign: "middle",
};

const statusLabelMap: Record<StatusPipeline, string> = {
  [StatusPipeline.LeadCaptado]: "Lead Captado",
  [StatusPipeline.Qualificacao]: "Qualificação",
  [StatusPipeline.LeadQualificado]: "Lead Qualificado",
  [StatusPipeline.PropostaEnviada]: "Proposta Enviada",
  [StatusPipeline.Negociacao]: "Negociação",
  [StatusPipeline.CriouConta]: "Criou Conta",
  [StatusPipeline.Convertido]: "Convertido",
  [StatusPipeline.Perdido]: "Perdido",
};

const statusByStage: Record<string, StatusPipeline> = {
  lead_captado: StatusPipeline.LeadCaptado,
  qualificacao: StatusPipeline.Qualificacao,
  lead_qualificado: StatusPipeline.LeadQualificado,
  proposta_enviada: StatusPipeline.PropostaEnviada,
  negociacao: StatusPipeline.Negociacao,
  criou_conta: StatusPipeline.CriouConta,
  convertido: StatusPipeline.Convertido,
  perdido: StatusPipeline.Perdido,
};

const getDateKey = (value: string) => value.slice(0, 10);

export default function DashboardPage() {
  const latestLead = mockLeads.reduce((latest, lead) =>
    new Date(lead.dataCriacao) > new Date(latest.dataCriacao) ? lead : latest
  );
  const todayKey = getDateKey(latestLead.dataCriacao);

  const leadsHoje = mockLeads.filter(
    (lead) => getDateKey(lead.dataCriacao) === todayKey
  ).length;

  const qualifiedStatuses = new Set<StatusPipeline>([
    StatusPipeline.LeadQualificado,
    StatusPipeline.PropostaEnviada,
    StatusPipeline.Negociacao,
    StatusPipeline.CriouConta,
    StatusPipeline.Convertido,
  ]);

  const leadsQualificados = mockLeads.filter((lead) =>
    qualifiedStatuses.has(lead.status)
  ).length;

  const leadsConvertidos = mockLeads.filter(
    (lead) => lead.status === StatusPipeline.Convertido
  ).length;

  const contasCriadas = mockContas.length;
  const taxaConversao = mockLeads.length
    ? `${((leadsConvertidos / mockLeads.length) * 100).toFixed(1)}%`
    : "0.0%";

  const pipelineSummary = PIPELINE_STAGES.map((stage) => ({
    id: stage.id,
    label: stage.label,
    count: mockLeads.filter(
      (lead) => lead.status === statusByStage[stage.id]
    ).length,
  }));

  const leadsQuentes = [...mockLeads]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const leadsRecentes = [...mockLeads]
    .sort(
      (a, b) =>
        new Date(b.dataCriacao).getTime() -
        new Date(a.dataCriacao).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <div>
        <div style={sectionTitleStyle}>Indicadores</div>
        <div className="grid grid-cols-5 gap-4">
          <KpiCard
            title="Leads hoje"
            value={leadsHoje}
            change={0}
            icon={
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="10" cy="10" r="7.5" />
                <path d="M10 7V13" />
                <path d="M7 10H13" />
              </svg>
            }
          />
          <KpiCard
            title="Leads qualificados"
            value={leadsQualificados}
            change={0}
            icon={
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="10" cy="10" r="7.5" />
                <path d="M7 10.5L9.5 13L13.5 8.5" />
              </svg>
            }
          />
          <KpiCard
            title="Leads convertidos"
            value={leadsConvertidos}
            change={0}
            icon={
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M6 4.5h8v2.5c0 2.7-2 4.9-4 4.9S6 9.7 6 7V4.5z" />
                <path d="M6 4.5H4.5v1.7C4.5 8 5.6 9 7 9" />
                <path d="M14 4.5h1.5v1.7C15.5 8 14.4 9 13 9" />
                <path d="M8 14h4" />
                <path d="M8 14v2h4v-2" />
              </svg>
            }
          />
          <KpiCard
            title="Contas criadas"
            value={contasCriadas}
            change={0}
            icon={
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <rect x="4.5" y="3.5" width="11" height="13" rx="1" />
                <rect x="7" y="6" width="2" height="2" />
                <rect x="11" y="6" width="2" height="2" />
                <rect x="7" y="10" width="2" height="2" />
                <rect x="11" y="10" width="2" height="2" />
              </svg>
            }
          />
          <KpiCard
            title="Taxa de conversão"
            value={taxaConversao}
            change={0}
            icon={
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="4.5" cy="14.5" r="1.5" />
                <circle cx="10" cy="9" r="1.5" />
                <path d="M4.5 14.5L17 2" />
                <path d="M13 2H17V6" />
              </svg>
            }
          />
        </div>
      </div>

      <div>
        <div style={sectionTitleStyle}>Pipeline</div>
        <PipelineSummary stages={pipelineSummary} />
      </div>

      <div>
        <div style={sectionTitleStyle}>Origens</div>
        <LeadsChart />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div style={tableContainerStyle}>
          <div style={tableTitleStyle}>Leads quentes</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Lead</th>
                <th style={headerCellStyle}>Score</th>
                <th style={headerCellStyle}>Origem</th>
                <th style={headerCellStyle}>Responsável</th>
                <th style={headerCellStyle}>Etapa</th>
              </tr>
            </thead>
            <tbody>
              {leadsQuentes.map((lead) => (
                <tr
                  key={lead.id}
                  style={{ transition: "background 0.2s" }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background =
                      "rgba(255,255,255,0.02)";
                    event.currentTarget.style.borderRadius = "8px";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "transparent";
                    event.currentTarget.style.borderRadius = "0px";
                  }}
                >
                  <td style={bodyCellStyle}>
                    <div style={{ color: "#ffffff", fontWeight: 500 }}>
                      {lead.nome}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
                      {lead.empresa}
                    </div>
                  </td>
                  <td style={bodyCellStyle}>
                    <ScoreBadge score={lead.score} />
                  </td>
                  <td style={bodyCellStyle}>{lead.origem}</td>
                  <td style={bodyCellStyle}>{lead.responsavel}</td>
                  <td style={bodyCellStyle}>
                    <StatusBadge status={statusLabelMap[lead.status]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={tableContainerStyle}>
          <div style={tableTitleStyle}>Últimos leads</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Lead</th>
                <th style={headerCellStyle}>Origem</th>
                <th style={headerCellStyle}>Score</th>
                <th style={headerCellStyle}>Status</th>
                <th style={headerCellStyle}>Data</th>
              </tr>
            </thead>
            <tbody>
              {leadsRecentes.map((lead) => (
                <tr
                  key={lead.id}
                  style={{ transition: "background 0.2s" }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background =
                      "rgba(255,255,255,0.02)";
                    event.currentTarget.style.borderRadius = "8px";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "transparent";
                    event.currentTarget.style.borderRadius = "0px";
                  }}
                >
                  <td style={bodyCellStyle}>
                    <div style={{ color: "#ffffff", fontWeight: 500 }}>
                      {lead.nome}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
                      {lead.empresa}
                    </div>
                  </td>
                  <td style={bodyCellStyle}>{lead.origem}</td>
                  <td style={bodyCellStyle}>
                    <ScoreBadge score={lead.score} />
                  </td>
                  <td style={bodyCellStyle}>
                    <StatusBadge status={statusLabelMap[lead.status]} />
                  </td>
                  <td
                    style={{
                      ...bodyCellStyle,
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 12,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    }}
                  >
                    {getDateKey(lead.dataCriacao)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
