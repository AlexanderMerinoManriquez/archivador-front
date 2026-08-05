import { useAuth } from '@/hooks/auth'

export const ROL_LABEL = {
  admin: 'Administrador',
  encargado: 'Encargado',
  funcionario: 'Funcionario',
  publico: 'Consulta',
}

const PERMISOS_FALLBACK = {
  admin: { digitalizar: true, estadisticas: true },
  encargado: { digitalizar: true, estadisticas: true },
  funcionario: { digitalizar: true, estadisticas: false },
  publico: { digitalizar: false, estadisticas: false },
}

const SIN_PERMISOS = { digitalizar: false, estadisticas: false }

export function useSesion() {
  const { usuario } = useAuth()

  if (!usuario) {
    return { usuario: {}, permisos: SIN_PERMISOS }
  }
  
  const permisos = usuario.permisos ?? PERMISOS_FALLBACK[usuario.rol] ?? SIN_PERMISOS

  return { usuario, permisos }
}