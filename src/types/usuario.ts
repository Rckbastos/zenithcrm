import { RolePerfil } from './common'

export interface Usuario {
  id: string
  nome: string
  email: string
  role: RolePerfil
  ativo: boolean
  avatar?: string
}
