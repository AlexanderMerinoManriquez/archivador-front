import { useMemo, useState } from 'react'
import { ChevronRight, ClipboardList, FolderOpen, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Boton from '@/components/Boton'
import ModalNuevoExpediente from '@/components/ModalNuevoExpediente'
import { useRecientes } from '@/hooks/expedientes'
import { useAuth } from '@/hooks/auth'
import { ROL_REGEX } from '@/lib/constantes'
import { RUTAS } from '@/lib/rutas'
import { useSesion } from '@/lib/sesion'

export default function Recientes() {
  const navigate = useNavigate()
  const { refrescarUsuario } = useAuth()
  const { usuario, permisos } = useSesion()
  const { cargando, recientes, error } = useRecientes()
  const [q, setQ] = useState('')
  const [modalNuevo, setModalNuevo] = useState(false)

  const causas = useMemo(
    () =>
      (recientes ?? []).map((exp) => ({
        id: exp.id,
        rol: exp.rol,
        detalle: exp.caratula || 'Sin carátula',
        fecha: exp.actualizadoEn ?? exp.creadoEn,
        ir: () => navigate(RUTAS.expediente(exp.rol)),
      })),
    [recientes, navigate]
  )

  const filtradas = useMemo(() => {
    const texto = q.trim().toLowerCase()
    if (!texto) return causas
    return causas.filter(
      (c) => c.rol?.toLowerCase().includes(texto) || c.detalle?.toLowerCase().includes(texto)
    )
  }, [causas, q])

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-12 lg:py-14">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
          <ClipboardList size={24} className="text-blue-600" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Mi actividad</h1>
          <p className="text-sm text-slate-500">Causas que has trabajado</p>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por ROL o detalle"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        {permisos.digitalizar && (
          <Boton onClick={() => setModalNuevo(true)}>
            <Plus size={18} />
            Nueva Causa
          </Boton>
        )}
      </div>
      <div className="mt-6">
        {cargando && <p className="text-sm text-slate-400">Cargando…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!cargando && !error && filtradas.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No hay causas para mostrar.
          </p>
        )}

        {!cargando && !error && filtradas.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="w-16 border-b border-r border-slate-200 px-6 py-3.5 text-center">#</th>
                    <th className="border-b border-r border-slate-200 px-6 py-3.5">ROL</th>
                    <th className="border-b border-r border-slate-200 px-6 py-3.5">Detalle</th>
                    <th className="w-40 border-b border-r border-slate-200 px-6 py-3.5">Fecha</th>
                    <th className="w-14 border-b border-slate-200 px-6 py-3.5 text-center"><span className="sr-only">Abrir</span></th>
                  </tr>
                </thead>
                <tbody className="text-[15px]">
                  {filtradas.map((c, i) => (
                    <tr
                      key={c.id}
                      onClick={c.ir}
                      className="group cursor-pointer border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="border-r border-slate-200 px-6 py-4 text-center text-slate-400 tabular-nums">{i + 1}</td>
                      <td className="border-r border-slate-200 px-6 py-4">
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <FolderOpen size={17} />
                          </span>
                          <span className="font-semibold tabular-nums text-slate-800">{c.rol}</span>
                        </span>
                      </td>
                      <td className="max-w-md truncate border-r border-slate-200 px-6 py-4 text-slate-600">{c.detalle}</td>
                      <td className="border-r border-slate-200 px-6 py-4 text-slate-500">{fechaCorta(c.fecha)}</td>
                      <td className="px-6 py-4 text-center text-slate-300">
                        <ChevronRight size={18} className="mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-2.5 sm:hidden">
              {filtradas.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={c.ir}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <FolderOpen size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold tabular-nums text-slate-800">{c.rol}</span>
                    <span className="block truncate text-sm text-slate-500">{c.detalle}</span>
                  </span>
                  <ChevronRight size={20} className="shrink-0 text-slate-300 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {modalNuevo && (
        <ModalNuevoExpediente
          abierto
          departamentoFijo={usuario?.departamentoId}
          rolInicial={ROL_REGEX.test(q.trim()) ? q.trim() : ''}
          onCerrar={() => setModalNuevo(false)}
          onCreado={(exp) => {
            refrescarUsuario()
            navigate(RUTAS.expediente(exp.rol))
          }}
        />
      )}
    </main>
  )
}

function fechaCorta(v) {
  if (!v) return '—'
  const d = new Date(v)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}