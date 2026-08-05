import { useState } from 'react'
import { ChevronRight, FilePlus2, FileText, FolderOpen, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Encabezado from '@/components/Encabezado'
import PantallaMensaje from '@/components/PantallaMensaje'
import Boton from '@/components/Boton'
import ModalNuevoDocumento from '@/components/ModalNuevoDocumento'
import BotonDescargarExpediente from '@/components/BotonDescargarExpediente'
import { useExpediente } from '@/hooks/expedientes'
import { formatearFecha } from '@/lib/expedientes'
import { RUTAS } from '@/lib/rutas'
import { useSesion } from '@/lib/sesion'

export default function ExpedienteDetalle() {
  const { rol } = useParams()
  const navigate = useNavigate()
  const { expediente, loading, error, refetch } = useExpediente(rol)
  const { usuario, permisos } = useSesion()
  const [modalDocumento, setModalDocumento] = useState(false)

  if (loading) return <PantallaMensaje texto="Cargando…" />
  if (error) return <PantallaMensaje texto={error} tono="error" />
  if (!expediente) return <PantallaMensaje texto="Causa no encontrada." />

  // Ordenados por fecha de ingreso (más antiguo -> más reciente).
  // El folio se deriva de este orden: el primero en ingresar es el folio 1.
  const documentos = [...(expediente.documentos ?? [])].sort(
    (a, b) => new Date(a.creadoEn) - new Date(b.creadoEn)
  )

  const trasCambio = () => {
    setModalDocumento(false)
    refetch()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Encabezado usuario={usuario} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 lg:py-10">
        <div className="animate-aparecer">
          <section className="sticky top-4 z-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
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
              <div className="mt-8 flex items-baseline justify-between px-1">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Documentos de la causa</h2>
                <span className="text-xs font-medium tabular-nums text-slate-400">
                  {documentos.length} {documentos.length === 1 ? 'documento' : 'documentos'}
                </span>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/[0.02]">
                <div className="hidden grid-cols-[4rem_1fr_11rem_3rem] items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 md:grid">
                  <span>Folio</span>
                  <span>Documento</span>
                  <span>Fecha de ingreso</span>
                  <span className="sr-only">Abrir</span>
                </div>

                <ul className="divide-y divide-slate-100">
    
                  {documentos
                    .map((doc, i) => ({ doc, folio: i + 1 }))
                    .reverse()
                    .map(({ doc, folio }) => (
                      <FilaDocumento
                        key={doc.uid}
                        documento={doc}
                        folio={folio}
                        onAbrir={() => navigate(RUTAS.documento(expediente.rol, doc.uid))}
                      />
                    ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </main>

      <ModalNuevoDocumento abierto={modalDocumento} expedienteId={expediente.id} onCerrar={() => setModalDocumento(false)} onListo={trasCambio} />

    </div>
  )
}

function FilaDocumento({ documento, folio, onAbrir }) {
  return (
    <li className="group relative">
      <button
        type="button"
        onClick={onAbrir}
        className="grid w-full cursor-pointer grid-cols-[3rem_1fr_auto] items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-blue-50/50 md:grid-cols-[4rem_1fr_11rem_3rem] md:px-5"
      >
        <span className="absolute inset-y-0 left-0 w-0.5 bg-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />

        <span className="font-mono text-sm font-semibold tabular-nums text-slate-400 transition-colors group-hover:text-blue-600">
          {String(folio).padStart(2, '0')}
        </span>

        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
            <FileText size={17} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-slate-900">{documento.nombre}</span>
            <span className="block truncate text-xs text-slate-400">{documento.nombreArchivo}</span>
          </span>
        </span>

        <span className="hidden text-sm text-slate-500 md:block">{formatearFecha(documento.creadoEn)}</span>

        <span className="hidden justify-self-end text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600 md:block">
          <ChevronRight size={18} />
        </span>
      </button>
    </li>
  )
}