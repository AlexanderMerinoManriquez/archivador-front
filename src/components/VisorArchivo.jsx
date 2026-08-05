import { useEffect, useRef, useState } from 'react'
import { Download, ExternalLink, FileWarning, Maximize2, Minus, Plus, Printer, X } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import { documentosApi } from '@/api/documentos'

pdfjs.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.mjs`

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2.5
const ZOOM_PASO = 0.25
const ANCHO_MAX_PAGINA = 900
const MARGEN = 32
const PROPORCION_A4 = 1.414

const BOTON = 'inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600'

export default function VisorArchivo({ documento, alto = 'h-[50vh] lg:h-[70vh]' }) {
  const [expandido, setExpandido] = useState(false)
  const [paginas, setPaginas] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [ancho, setAncho] = useState(0)
  const [errorCarga, setErrorCarga] = useState(false)
  const [blobUrl, setBlobUrl] = useState(null)
  const lienzoRef = useRef(null)

  const [documentoId, setDocumentoId] = useState(documento?.id)

  if (documento?.id !== documentoId) {
    setDocumentoId(documento?.id)
    setPaginas(null)
    setZoom(1)
    setErrorCarga(false)
    setBlobUrl(null)
  }

  useEffect(() => {
    if (!documento?.uid) return
    let vigente = true
    let urlActual = null
    documentosApi
      .objectUrl(documento.uid)
      .then((url) => {
        if (!vigente) {
          URL.revokeObjectURL(url)
          return
        }
        urlActual = url
        setBlobUrl(url)
      })
      .catch(() => vigente && setErrorCarga(true))
    return () => {
      vigente = false
      if (urlActual) URL.revokeObjectURL(urlActual)
    }
  }, [documento?.uid])

  useEffect(() => {
    lienzoRef.current?.scrollTo({ top: 0 })
  }, [documentoId])

  useEffect(() => {
    const nodo = lienzoRef.current
    if (!nodo) return
    const observador = new ResizeObserver(([entrada]) => setAncho(entrada.contentRect.width))
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [expandido])

  useEffect(() => {
    if (!expandido) return
    const escuchar = (e) => e.key === 'Escape' && setExpandido(false)
    window.addEventListener('keydown', escuchar)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', escuchar)
      document.body.style.overflow = ''
    }
  }, [expandido])

  if (!documento?.uid) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-center shadow-md ${alto}`}>
        <FileWarning size={32} className="text-slate-300" />
        <p className="text-sm text-slate-500">Este documento no tiene archivo asociado.</p>
      </div>
    )
  }

  const cambiarZoom = (delta) => setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z + delta)))

  const abrirEnPestana = () => blobUrl && window.open(blobUrl, '_blank', 'noopener')

  const imprimir = () => {
    if (!blobUrl) return
    const pestana = window.open(blobUrl, '_blank')
    try {
      pestana?.addEventListener('load', () => pestana.print())
    } catch {
      //
    }
  }

  const anchoPagina = Math.round(Math.min(Math.max(ancho - MARGEN, 0), ANCHO_MAX_PAGINA) * zoom)

  const barra = () => (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2">
      <span className="px-1 text-sm tabular-nums text-slate-600">
        {paginas ? `${paginas} página${paginas === 1 ? '' : 's'}` : '–'}
      </span>

      <div className="flex items-center gap-1">
        <button type="button" onClick={() => cambiarZoom(-ZOOM_PASO)} disabled={zoom <= ZOOM_MIN} className={BOTON} title="Alejar">
          <Minus size={16} />
        </button>
        <span className="w-12 text-center text-sm tabular-nums text-slate-600">{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => cambiarZoom(ZOOM_PASO)} disabled={zoom >= ZOOM_MAX} className={BOTON} title="Acercar">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button type="button" onClick={abrirEnPestana} disabled={!blobUrl} className={BOTON} title="Abrir en pestaña nueva">
          <ExternalLink size={16} />
        </button>
        <button type="button" onClick={imprimir} disabled={!blobUrl} className={BOTON} title="Imprimir">
          <Printer size={16} />
        </button>
        <a
          href={blobUrl ?? undefined}
          download={documento.nombreArchivo}
          className={`${BOTON} ${blobUrl ? '' : 'pointer-events-none opacity-40'}`}
          title="Descargar"
        >
          <Download size={16} />
        </a>
        {expandido ? (
          <button type="button" onClick={() => setExpandido(false)} className={BOTON} title="Cerrar (Esc)">
            <X size={17} />
          </button>
        ) : (
          <button type="button" onClick={() => setExpandido(true)} className={BOTON} title="Pantalla completa">
            <Maximize2 size={16} />
          </button>
        )}
      </div>
    </div>
  )

  const lienzo = () => (
    <div ref={lienzoRef} className={`min-h-0 flex-1 overflow-auto ${expandido ? 'bg-slate-200' : 'bg-slate-100'}`}>
      {errorCarga ? (
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="text-sm text-slate-400">No se pudo cargar el documento.</p>
        </div>
      ) : !blobUrl ? (
        <div className="flex flex-col items-center gap-3 px-10 py-20">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-300 border-t-blue-600" />
          <p className="text-sm text-slate-400">Cargando documento…</p>
        </div>
      ) : (
        <div className="mx-auto w-fit px-4 py-4">
          <Document
            key={documento.id}
            file={blobUrl}
            onLoadSuccess={({ numPages }) => setPaginas(numPages)}
            onLoadError={() => setErrorCarga(true)}
            onSourceError={() => setErrorCarga(true)}
            loading={
              <div className="flex flex-col items-center gap-3 px-10 py-20">
                <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-300 border-t-blue-600" />
                <p className="text-sm text-slate-400">Cargando documento…</p>
              </div>
            }
          >
            {ancho > 0 &&
              paginas &&
              Array.from({ length: paginas }, (_, i) => (
                <PaginaPerezosa key={i + 1} numero={i + 1} ancho={anchoPagina} />
              ))}
          </Document>
        </div>
      )}
    </div>
  )

  if (expandido) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-200">
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
          <p className="truncate text-sm font-medium text-slate-800">{documento.nombreArchivo}</p>
        </div>
        {barra()}
        {lienzo()}
      </div>
    )
  }

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md ${alto}`}>
      {barra()}
      {lienzo()}
    </div>
  )
}

function PaginaPerezosa({ numero, ancho }) {
  const contenedorRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) return
    const nodo = contenedorRef.current
    if (!nodo) return
    const observador = new IntersectionObserver(
      ([entrada]) => entrada.isIntersecting && setVisible(true),
      { rootMargin: '600px 0px' }
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [visible])

  const altoEstimado = Math.round(ancho * PROPORCION_A4)

  return (
    <div ref={contenedorRef} className="mb-4 last:mb-0" style={{ width: ancho }}>
      {visible ? (
        <Page
          pageNumber={numero}
          width={ancho}
          renderTextLayer
          renderAnnotationLayer={false}
          className="bg-white shadow-lg"
          loading={<div style={{ width: ancho, height: altoEstimado }} className="bg-white/60 shadow-lg" />}
        />
      ) : (
        <div style={{ height: altoEstimado }} className="bg-white/60 shadow-lg" />
      )}
    </div>
  )
}