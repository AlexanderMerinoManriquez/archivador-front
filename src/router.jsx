import { createBrowserRouter, Navigate } from 'react-router-dom'
import Inicio from '@/pages/Inicio'
import Login from '@/pages/Login'
import ExpedienteDetalle from '@/pages/ExpedienteDetalle'
import DocumentoDetalle from '@/pages/DocumentoDetalle'
import RutaProtegida from '@/components/RutaProtegida'
import { RUTAS } from '@/lib/rutas'

export const router = createBrowserRouter(
  [
    { path: RUTAS.login, element: <Login /> },
    {
      element: <RutaProtegida />,
      children: [
        { path: RUTAS.inicio, element: <Inicio /> },
        { path: RUTAS.expedientePatron, element: <ExpedienteDetalle /> },
        { path: RUTAS.documentoPatron, element: <DocumentoDetalle /> },
      ],
    },
    { path: '*', element: <Navigate to={RUTAS.inicio} replace /> },
  ],
  {
    basename: '/archivadordigital',
  }
)