import { useMemo, useState } from 'react'
import { ArrowLeft, ChevronRight, FilePlus2, FileText, FolderOpen, Plus, Search } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PantallaMensaje from '@/components/PantallaMensaje'
import Boton from '@/components/Boton'
import ModalNuevoDocumento from '@/components/ModalNuevoDocumento'
import BotonDescargarExpediente from '@/components/BotonDescargarExpediente'
import { useExpediente } from '@/hooks/expedientes'
import { useAuth } from '@/hooks/auth'
import { formatearFecha } from '@/lib/expedientes'
import { RUTAS } from '@/lib/rutas'
import { useSesion } from '@/lib/sesion'

export default function ExpedienteDetalle() {
  const { rol } = useParams()
  const navigate = useNavigate()
  const { expediente, loading, error, refetch } = useExpediente(rol)
  const { refrescarUsuario } = useAuth()
  const { permisos } = useSesion()
  const [modalDocumento, setModalDocumento] = useState(false)
  const [q, setQ] = useState('')

  const documentos = useMemo(
    () =>
      [...(expediente?.documentos ?? [])].sort((a, b) => new Date(a.creadoEn) - new Date(b.creadoEn)),
    [expediente]
  )

  const filtrados = useMemo(() => {
    const texto = q.trim().toLowerCase()
    const orden = documentos.map((doc, i) => ({ doc, numero: i + 1 })).reverse()
    if (!texto) return orden
    return orden.filter(({ doc }) => doc.nombre?.toLowerCase().includes(texto))
  }, [documentos, q])

  if (loading) return <PantallaMensaje texto="Cargando…" />
  if (error) return <PantallaMensaje texto={error} tono="error" />
  if (!expediente) return <PantallaMensaje texto="Causa no encontrada." />

  const trasCambio = () => {
    setModalDocumento(false)
    refetch()
    refrescarUsuario()
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-10">
      <div className="animate-aparecer">
        <div className="mb-3">
          <Link to={RUTAS.buscar} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
            <ArrowLeft size={16} />
            Buscar
          </Link>
        </div>
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
          <div className="h-1.5 bg-blue-600" />
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-7">
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                <FolderOpen size={28} className="text-blue-600" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">ROL</p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">{expediente.rol}</h1>
                <p className="mt-0.5 truncate text-[15px] text-slate-600">{expediente.caratula}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <BotonDescargarExpediente expediente={expediente} />
              {permisos.digitalizar && (
                <Boton onClick={() => setModalDocumento(true)}>
                  <Plus size={18} />
                  Agregar documento
                </Boton>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 border-t border-slate-100 px-5 py-3.5 text-sm text-slate-500 lg:px-7">
            <span>{expediente.departamentoNombre ?? '—'}</span>
            <span className="text-slate-300">•</span>
            <span>Creado el {formatearFecha(expediente.creadoEn)}</span>
            <span className="text-slate-300">•</span>
            <span>{documentos.length} documento{documentos.length === 1 ? '' : 's'}</span>
          </div>
        </section>

        {documentos.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <FilePlus2 size={30} className="text-blue-600" />
            </span>
            <div>
              <p className="font-medium text-slate-800">Esta causa aún no tiene documentos.</p>
              <p className="mt-1 text-sm text-slate-500">Digitaliza la primera pieza de la causa para comenzar.</p>
            </div>
            {permisos.digitalizar && (
              <Boton onClick={() => setModalDocumento(true)}>
                <Plus size={18} />
                Agregar el primero
              </Boton>
            )}
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Documentos de la causa</h2>
              <div className="relative sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar documento"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full table-fixed border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="w-16 border-b border-r border-slate-200 px-4 py-3.5 text-center">N°</th>
                    <th className="border-b border-r border-slate-200 px-4 py-3.5">Documento</th>
                    <th className="hidden w-52 border-b border-r border-slate-200 px-4 py-3.5 md:table-cell">Fecha de ingreso</th>
                    <th className="w-14 border-b border-slate-200 px-4 py-3.5 text-center"><span className="sr-only">Abrir</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                        Ningún documento coincide con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filtrados.map(({ doc, numero }) => (
                      <FilaDocumento
                        key={doc.uid}
                        documento={doc}
                        numero={numero}
                        onAbrir={() => navigate(RUTAS.documento(expediente.rol, doc.uid))}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ModalNuevoDocumento abierto={modalDocumento} expedienteId={expediente.id} onCerrar={() => setModalDocumento(false)} onListo={trasCambio} />
    </main>
  )
}

function FilaDocumento({ documento, numero, onAbrir }) {
  return (
    <tr onClick={onAbrir} className="cursor-pointer border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50">
      <td className="border-r border-slate-200 px-4 py-4 text-center align-middle">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 text-sm font-semibold tabular-nums text-slate-500">
          {numero}
        </span>
      </td>
      <td className="border-r border-slate-200 px-4 py-4 align-middle">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <FileText size={18} />
          </span>
          <div className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-slate-900">{documento.nombre}</span>
            <span className="mt-0.5 block text-xs text-slate-400 md:hidden">{formatearFecha(documento.creadoEn)}</span>
          </div>
        </div>
      </td>
      <td className="hidden border-r border-slate-200 px-4 py-4 align-middle text-sm text-slate-500 md:table-cell">
        {formatearFecha(documento.creadoEn)}
      </td>
      <td className="px-4 py-4 text-center align-middle text-slate-300">
        <ChevronRight size={18} className="mx-auto" />
      </td>
    </tr>
  )
}