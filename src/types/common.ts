export enum StatusPipeline {
  LeadCaptado = 'LeadCaptado',
  Qualificacao = 'Qualificacao',
  LeadQualificado = 'LeadQualificado',
  PropostaEnviada = 'PropostaEnviada',
  Negociacao = 'Negociacao',
  CriouConta = 'CriouConta',
  Convertido = 'Convertido',
  Perdido = 'Perdido',
}

export enum Origem {
  Instagram = 'Instagram',
  WhatsApp = 'WhatsApp',
  Google = 'Google',
  Indicacao = 'Indicacao',
  ManyChat = 'ManyChat',
  API = 'API',
  Manual = 'Manual',
}

export enum Urgencia {
  Baixa = 'Baixa',
  Media = 'Media',
  Alta = 'Alta',
}

export enum RolePerfil {
  Admin = 'Admin',
  Gestor = 'Gestor',
  Comercial = 'Comercial',
}

export enum StatusTarefa {
  Pendente = 'Pendente',
  EmAndamento = 'EmAndamento',
  Concluida = 'Concluida',
  Cancelada = 'Cancelada',
}

export enum StatusOperacional {
  ContaCriada = 'ContaCriada',
  DocumentacaoPendente = 'DocumentacaoPendente',
  EmAnalise = 'EmAnalise',
  Aprovado = 'Aprovado',
  Integrando = 'Integrando',
  Ativo = 'Ativo',
}

export type TrendDirection = 'up' | 'down' | 'neutral'
