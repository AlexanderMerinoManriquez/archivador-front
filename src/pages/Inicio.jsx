import { Building2, CalendarDays, FileText, FolderPlus, UserRound } from 'lucide-react'
import { useSesion } from '@/lib/sesion'

export default function Inicio() {
  const { usuario, permisos } = useSesion()

  const nombre = usuario?.nombre ?? ''
  const iniciales = nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  const fecha = new Date()
    .toLocaleDateString('es-CL', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      timeZone: 'America/Santiago',
    })
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase())

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
            {iniciales || <UserRound size={32} />}
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Bienvenido/a</h1>
        </div>

        <div className="mt-6 space-y-2.5">
          <Fila icono={UserRound} etiqueta="Usuario" valor={nombre || '—'} />
          <Fila icono={Building2} etiqueta="Departamento" valor={usuario?.departamentoNombre || '—'} />
          <Fila icono={CalendarDays} etiqueta="Fecha" valor={fecha} />
        </div>

        {permisos.digitalizar && (usuario.causasCreadas != null || usuario.documentosSubidos != null) && (
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Stat icono={FolderPlus} valor={usuario.causasCreadas ?? 0} etiqueta="Causas" />
            <Stat icono={FileText} valor={usuario.documentosSubidos ?? 0} etiqueta="Documentos" />
          </div>
        )}
      </div>
    </main>
  )
}

function Fila({ icono: Icono, etiqueta, valor }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icono size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{etiqueta}</p>
        <p className="truncate text-sm font-semibold text-slate-900">{valor}</p>
      </div>
    </div>
  )
}

function Stat({ icono: Icono, valor, etiqueta }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icono size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-semibold tabular-nums leading-none text-slate-900">{valor}</p>
        <p className="mt-0.5 text-xs text-slate-500">{etiqueta}</p>
      </div>
    </div>
  )
}