import { useEffect, useState } from 'react'
import { ChartColumn, ClipboardList, FileSearch, Home, LogOut, Menu, X } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { ROL_LABEL, useSesion } from '@/lib/sesion'
import { RUTAS } from '@/lib/rutas'
import logo from '../assets/logo-chillan-letras.png'

export default function Layout() {
  const { usuario, permisos } = useSesion()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const location = useLocation()

  useEffect(() => setAbierto(false), [location.pathname])

  const enlaces = [
    { a: RUTAS.inicio, texto: 'Inicio', detalle: 'Registro de hoy', icono: Home, mostrar: true },
    { a: RUTAS.buscar, texto: 'Buscar causa', detalle: 'Consulta por ROL', icono: FileSearch, mostrar: true },
    { a: RUTAS.recientes, texto: 'Mi actividad', detalle: 'Causas y documentos', icono: ClipboardList, mostrar: permisos.digitalizar },
    { a: RUTAS.estadisticas, texto: 'Estadísticas', detalle: 'Resumen de causas', icono: ChartColumn, mostrar: permisos.estadisticas },
  ].filter((e) => e.mostrar)

  const cuerpoSidebar = (
    <>
      <Cabecera />
      <Navegacion enlaces={enlaces} />
      <TarjetaUsuario usuario={usuario} />
    </>
  )

  return (
    <div className="relative min-h-screen bg-slate-100 lg:pl-72">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-72 flex-col border-r border-slate-200 bg-white">
        {cuerpoSidebar}
      </aside>
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Municipalidad de Chillán" className="h-9 w-auto object-contain" />
          <span className="text-sm font-semibold text-slate-800">Archivador Digital</span>
        </div>
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
      </header>
      {abierto && (
        <div className="lg:hidden fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="absolute inset-0 bg-slate-900/40"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-sm font-semibold text-slate-800">Menú</span>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar menú"
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            {cuerpoSidebar}
          </aside>
        </div>
      )}
      <div className="relative min-h-screen">
        <FondoDecorativo />
        <div className="relative z-10 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function Cabecera() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 pb-5 pt-7 text-center">
      <img src={logo} alt="Municipalidad de Chillán" className="h-16 w-auto object-contain" />
      <div>
        <p className="text-base font-bold leading-tight text-slate-900">Archivador Digital</p>
        <p className="text-xs text-slate-500">Municipalidad de Chillán</p>
      </div>
    </div>
  )
}

function Navegacion({ enlaces }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
      {enlaces.map(({ a, texto, detalle, icono: Icono }) => (
        <NavLink
          key={a}
          to={a}
          end={a === RUTAS.inicio}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icono size={19} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
              <span className="leading-tight">
                <span className="block text-sm font-medium">{texto}</span>
                <span className="block text-xs text-slate-400">{detalle}</span>
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function TarjetaUsuario({ usuario }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  if (!usuario?.rol) return null

  const nombre = usuario.nombre || ROL_LABEL[usuario.rol]
  const codigo = usuario.departamentoCodigo?.toUpperCase() ?? null
  const iniciales = nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  const cerrarSesion = () => {
    logout()
    navigate(RUTAS.login, { replace: true })
  }

  return (
    <div className="border-t border-slate-100 p-3">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {iniciales || '·'}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-medium text-slate-800">{nombre}</span>
          <span className="block truncate text-xs">
            {codigo && <span className="font-semibold text-blue-600">{codigo}</span>}
            {codigo && <span className="mx-1 text-slate-300">•</span>}
            <span className="text-slate-500">{ROL_LABEL[usuario.rol]}</span>
          </span>
        </span>
        <button
          type="button"
          onClick={cerrarSesion}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  )
}

function FondoDecorativo() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute left-1/2 top-16 h-72 w-2xl -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-64 w-96 -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl" />
    </div>
  )
}