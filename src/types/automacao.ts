export interface Automacao {
  id: string
  nome: string
  descricao: string
  trigger: string
  acao: string
  ativo: boolean
  ultimaExecucao?: string
  totalExecucoes: number
}

export interface AutomacaoLog {
  id: string
  automacaoId: string
  leadId?: string
  status: 'success' | 'error' | 'skipped'
  payload?: Record<string, unknown>
  executadoEm: string
}
