import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { RUTAS } from '@/lib/rutas'

export default function RutaProtegida() {
  const { autenticado, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    )
  }

  if (!autenticado) {
    return <Navigate to={RUTAS.login} replace />
  }

  return <Outlet />
}