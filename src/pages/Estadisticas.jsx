import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartColumn, FileText, FolderOpen } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useEstadisticasDepartamento } from '@/hooks/estadisticas'
import { RUTAS } from '@/lib/rutas'
import { useSesion } from '@/lib/sesion'

const PALETA = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#64748b']

export default function Estadisticas() {
  const { usuario, permisos } = useSesion()
  const est = useEstadisticasDepartamento()

  if (!permisos.estadisticas) return <Navigate to={RUTAS.inicio} replace />

  const causasPorMes = (est.causasPorMes ?? []).map((d) => ({ ...d, label: etiquetaMes(d.mes) }))
  const documentosPorMes = (est.documentosPorMes ?? []).map((d) => ({ ...d, label: etiquetaMes(d.mes) }))
  const porEstado = (est.causasPorEstado ?? []).map((d) => ({
    ...d,
    label: String(d.estado).replace(/_/g, ' '),
  }))
  const topFuncionarios = est.topFuncionarios ?? []

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-10 lg:py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
          <ChartColumn size={24} className="text-blue-600" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Estadísticas</h1>
          <p className="text-sm text-slate-500">
            Departamento{usuario?.departamentoNombre ? ` · ${usuario.departamentoNombre}` : ''}
          </p>
        </div>
      </div>
      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Total icono={FolderOpen} etiqueta="Total de causas" valor={est.totalCausas} />
        <Total icono={FileText} etiqueta="Total de documentos" valor={est.totalDocumentos} />
      </section>
      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel titulo="Causas por mes">
          <Barras datos={causasPorMes} color="#2563eb" />
        </Panel>

        <Panel titulo="Documentos por mes">
          <Barras datos={documentosPorMes} color="#f59e0b" />
        </Panel>

        <Panel titulo="Causas por estado">
          <Dona datos={porEstado} />
        </Panel>

        <Panel titulo="Funcionarios más activos">
          <BarrasH datos={topFuncionarios} />
        </Panel>
      </section>
    </main>
  )
}

function Total({ icono: Icono, etiqueta, valor }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400">
        <Icono size={18} />
        <span className="text-sm font-medium text-slate-500">{etiqueta}</span>
      </div>
      <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-slate-900">{valor ?? 0}</p>
    </div>
  )
}

function Panel({ titulo, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-700">{titulo}</h2>
      <div className="mt-4 h-56">{children}</div>
    </div>
  )
}

function SinDatos() {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
      Sin datos aún
    </div>
  )
}

const ejeComun = {
  tick: { fill: '#94a3b8', fontSize: 12 },
  axisLine: false,
  tickLine: false,
}

const tooltipEstilo = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    fontSize: 13,
    boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
  },
}

function Barras({ datos, color }) {
  if (!datos || datos.length === 0) return <SinDatos />
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={datos} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="label" {...ejeComun} />
        <YAxis allowDecimals={false} {...ejeComun} />
        <Tooltip cursor={{ fill: '#f8fafc' }} {...tooltipEstilo} />
        <Bar dataKey="total" fill={color} radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function BarrasH({ datos }) {
  if (!datos || datos.length === 0) return <SinDatos />
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={datos} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="#f1f5f9" />
        <XAxis type="number" allowDecimals={false} {...ejeComun} />
        <YAxis type="category" dataKey="nombre" width={110} {...ejeComun} />
        <Tooltip cursor={{ fill: '#f8fafc' }} {...tooltipEstilo} />
        <Bar dataKey="total" fill="#2563eb" radius={[0, 6, 6, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function Dona({ datos }) {
  if (!datos || datos.length === 0) return <SinDatos />
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={datos}
          dataKey="total"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={2}
        >
          {datos.map((_, i) => (
            <Cell key={i} fill={PALETA[i % PALETA.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipEstilo} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function etiquetaMes(mes) {
  if (!mes) return ''
  const d = new Date(`${mes}-02`)
  if (isNaN(d.getTime())) return mes
  return d.toLocaleDateString('es-CL', { month: 'short' })
}