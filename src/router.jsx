import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import RutaProtegida from '@/components/RutaProtegida'
import Layout from '@/components/Layout'
import { RUTAS } from '@/lib/rutas'

const Inicio = lazy(() => import('@/pages/Inicio'))
const Buscar = lazy(() => import('@/pages/Buscar'))
const Recientes = lazy(() => import('@/pages/Recientes'))
const Login = lazy(() => import('@/pages/Login'))
const ExpedienteDetalle = lazy(() => import('@/pages/ExpedienteDetalle'))
const DocumentoDetalle = lazy(() => import('@/pages/DocumentoDetalle'))
const Estadisticas = lazy(() => import('@/pages/Estadisticas'))

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
        {
          element: <Layout />,
          children: [
            { path: RUTAS.inicio, element: conSuspense(Inicio) },
            { path: RUTAS.buscar, element: conSuspense(Buscar) },
            { path: RUTAS.recientes, element: conSuspense(Recientes) },
            { path: RUTAS.estadisticas, element: conSuspense(Estadisticas) },
            { path: RUTAS.expedientePatron, element: conSuspense(ExpedienteDetalle) },
            { path: RUTAS.documentoPatron, element: conSuspense(DocumentoDetalle) },
          ],
        },
      ],
    },
    { path: '*', element: <Navigate to={RUTAS.inicio} replace /> },
  ],
  {
    basename: '/archivadordigital',
  }
)