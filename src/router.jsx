import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import RutaProtegida from '@/components/RutaProtegida'
import { RUTAS } from '@/lib/rutas'

const Inicio = lazy(() => import('@/pages/Inicio'))
const Login = lazy(() => import('@/pages/Login'))
const ExpedienteDetalle = lazy(() => import('@/pages/ExpedienteDetalle'))
const DocumentoDetalle = lazy(() => import('@/pages/DocumentoDetalle'))

function Cargando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
    </div>
  )
}

const conSuspense = (Componente) => (
  <Suspense fallback={<Cargando />}>
    <Componente />
  </Suspense>
)

export const router = createBrowserRouter(
  [
    { path: RUTAS.login, element: conSuspense(Login) },
    {
      element: <RutaProtegida />,
      children: [
        { path: RUTAS.inicio, element: conSuspense(Inicio) },
        { path: RUTAS.expedientePatron, element: conSuspense(ExpedienteDetalle) },
        { path: RUTAS.documentoPatron, element: conSuspense(DocumentoDetalle) },
      ],
    },
    { path: '*', element: <Navigate to={RUTAS.inicio} replace /> },
  ],
  {
    basename: '/archivadordigital',
  }
)