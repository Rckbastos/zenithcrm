import { Origem, StatusPipeline, StatusTarefa, Urgencia } from './common'

export interface Lead {
  id: string
  nome: string
  empresa: string
  email: string
  telefone: string
  origem: Origem
  pais: string
  nicho: string
  site?: string
  gatewayAtual?: string
  ticketMedio?: number
  volumeEstimado?: number
  score: number
  status: StatusPipeline
  responsavel: string
  ultimaInteracao: string
  dataCriacao: string
}

export interface LeadOperacao {
  leadId: string
  ticketMedio: number
  volumeEstimado: number
  moedas: string[]
  paisesInteresse: string[]
  metodosInteresse: string[]
  modeloNegocio?: string
  dorPrincipal?: string
  urgencia: Urgencia
  resumoIA?: string
}

export interface LeadNota {
  id: string
  leadId: string
  autor: string
  conteudo: string
  criadoEm: string
}

export interface LeadTarefa {
  id: string
  leadId: string
  titulo: string
  descricao?: string
  prazo: string
  status: StatusTarefa
  responsavel: string
  criadoPor: string
}

export interface LeadInteracao {
  id: string
  leadId: string
  canal: string
  direcao: 'inbound' | 'outbound' | 'internal'
  mensagem: string
  criadoEm: string
}

export interface LeadHistorico {
  id: string
  leadId: string
  deStage?: string
  paraStage?: string
  descricao: string
  autor: string
  criadoEm: string
}

export interface LeadFiltros {
  search?: string
  status?: StatusPipeline
  origem?: Origem
  pais?: string
  nicho?: string
  responsavel?: string
  scoreMin?: number
  scoreMax?: number
  dataInicio?: string
  dataFim?: string
}
