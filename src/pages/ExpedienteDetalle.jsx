import { useState } from 'react'
import { ChevronRight, FilePlus2, FileText, FolderOpen, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Encabezado from '@/components/Encabezado'
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
  const { usuario, permisos } = useSesion()
  const [modalDocumento, setModalDocumento] = useState(false)

  if (loading) return <PantallaMensaje texto="Cargando…" />
  if (error) return <PantallaMensaje texto={error} tono="error" />
  if (!expediente) return <PantallaMensaje texto="Causa no encontrada." />

  const documentos = [...(expediente.documentos ?? [])].sort(
    (a, b) => new Date(a.creadoEn) - new Date(b.creadoEn)
  )

  const trasCambio = () => {
    setModalDocumento(false)
    refetch()
    refrescarUsuario()
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

              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                
                {/* Encabezado de la tabla modificado con líneas verticales (divide-x) */}
                <div className="hidden grid-cols-[4rem_1fr_12rem_3rem] items-stretch border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400 divide-x divide-slate-200 md:grid">
                  <div className="flex items-center justify-center px-4 py-3">
                    <span className="text-sm">N°</span>
                  </div>
                  <div className="flex items-center px-4 py-3">
                    <span>Documento</span>
                  </div>
                  <div className="flex items-center px-4 py-3">
                    <span>Fecha de ingreso</span>
                  </div>
                  <div className="flex items-center justify-center px-4 py-3">
                    <span className="sr-only">Abrir</span>
                  </div>
                </div>

                {/* Cuerpo de la tabla */}
                <ul className="divide-y divide-slate-200">
                  {documentos
                    .map((doc, i) => ({ doc, numero: i + 1 }))
                    .reverse()
                    .map(({ doc, numero }) => (
                      <FilaDocumento
                        key={doc.uid}
                        documento={doc}
                        numero={numero}
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

function FilaDocumento({ documento, numero, onAbrir }) {
  return (
    <li className="group relative">
      {/* Botón de fila modificado para tener división de bordes en escritorio (md:divide-x) */}
      <button
        type="button"
        onClick={onAbrir}
        className="grid w-full cursor-pointer grid-cols-[3rem_1fr_auto] items-stretch text-left transition-colors hover:bg-slate-50 md:grid-cols-[4rem_1fr_12rem_3rem] md:divide-x md:divide-slate-200"
      >
        <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
        
        {/* Celda: Número */}
        <span className="flex items-center justify-center px-4 py-3.5">
          <span className="mx-auto flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 font-mono text-sm font-semibold tabular-nums text-slate-500 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            {numero}
          </span>
        </span>
        
        {/* Celda: Nombre Documento */}
        <span className="flex min-w-0 items-center gap-3 px-4 py-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-slate-200">
            <FileText size={18} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-slate-900">{documento.nombre}</span>
            <span className="mt-0.5 block text-xs text-slate-400 md:hidden">{formatearFecha(documento.creadoEn)}</span>
          </span>
        </span>
        
        {/* Celda: Fecha (Sólo Desktop) */}
        <span className="hidden items-center px-4 py-3.5 md:flex">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200/80">
            {formatearFecha(documento.creadoEn)}
          </span>
        </span>
        
        {/* Celda: Acción/Icono (Sólo Desktop) */}
        <span className="hidden items-center justify-center px-4 py-3.5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600 md:flex">
          <ChevronRight size={18} />
        </span>
      </button>
    </li>
  )
}