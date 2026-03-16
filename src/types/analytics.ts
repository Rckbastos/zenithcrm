import { TrendDirection } from './common'

export interface KpiData {
  title: string
  value: number | string
  change: number
  trend: TrendDirection
  prefix?: string
  suffix?: string
}

export interface ConversaoPorOrigem {
  origem: string
  total: number
  convertidos: number
  taxa: number
}

export interface DashboardData {
  kpis: KpiData[]
  leadsPorStage: Record<string, number>
  conversaoPorOrigem: ConversaoPorOrigem[]
}
