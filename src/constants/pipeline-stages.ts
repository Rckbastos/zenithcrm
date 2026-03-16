export const PIPELINE_STAGES: Array<{
  id: string
  label: string
  cor: string
  ordem: number
}> = [
  {
    id: 'lead_captado',
    label: 'Lead Captado',
    cor: 'bg-slate-100',
    ordem: 1,
  },
  {
    id: 'qualificacao',
    label: 'Qualificação',
    cor: 'bg-yellow-100',
    ordem: 2,
  },
  {
    id: 'lead_qualificado',
    label: 'Lead Qualificado',
    cor: 'bg-blue-100',
    ordem: 3,
  },
  {
    id: 'proposta_enviada',
    label: 'Proposta Enviada',
    cor: 'bg-purple-100',
    ordem: 4,
  },
  {
    id: 'negociacao',
    label: 'Negociação',
    cor: 'bg-orange-100',
    ordem: 5,
  },
  {
    id: 'criou_conta',
    label: 'Criou Conta',
    cor: 'bg-cyan-100',
    ordem: 6,
  },
  {
    id: 'convertido',
    label: 'Convertido',
    cor: 'bg-green-100',
    ordem: 7,
  },
  {
    id: 'perdido',
    label: 'Perdido',
    cor: 'bg-red-100',
    ordem: 8,
  },
]

type PipelineStage = typeof PIPELINE_STAGES[0]

export const PIPELINE_STAGE_MAP: Record<string, typeof PIPELINE_STAGES[0]> =
  PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = stage
    return acc
  }, {} as Record<string, PipelineStage>)
