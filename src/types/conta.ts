import { Origem, StatusOperacional } from './common'

export interface ContaCriada {
  id: string
  leadId: string
  empresa: string
  responsavel: string
  pais: string
  nicho: string
  scoreInicial: number
  dataCriacaoConta: string
  statusOperacional: StatusOperacional
  gatewayAccountId?: string
  origem: Origem
}
