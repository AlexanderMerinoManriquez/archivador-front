import { useAuth } from '@/hooks/auth'

const ROLES = {
  ADMIN: 'admin',
  ENCARGADO: 'encargado',
  FUNCIONARIO: 'funcionario',
  PUBLICO: 'publico',
}

export const ROL_LABEL = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.ENCARGADO]: 'Encargado',
  [ROLES.FUNCIONARIO]: 'Funcionario',
  [ROLES.PUBLICO]: 'Consulta',
}

const PERMISOS = {
  [ROLES.ADMIN]:       { digitalizar: true,  estadisticas: true  },
  [ROLES.ENCARGADO]:   { digitalizar: true,  estadisticas: true  },
  [ROLES.FUNCIONARIO]: { digitalizar: true,  estadisticas: false },
  [ROLES.PUBLICO]:     { digitalizar: false, estadisticas: false },
}

const SIN_PERMISOS = { digitalizar: false, estadisticas: false }

export function useSesion() {
  const { usuario } = useAuth()

  return {
    usuario: usuario ?? {},
    permisos: usuario ? (PERMISOS[usuario.rol] ?? SIN_PERMISOS) : SIN_PERMISOS,
  }
}
