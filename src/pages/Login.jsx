import { useState } from 'react'
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { CAMPO } from '@/lib/constantes'
import { formatearRut, validarRut } from '@/lib/rut'
import { RUTAS } from '@/lib/rutas'
import logo from "../assets/logo-chillan-letras.png";

export default function Login() {
  const { autenticado, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [rut, setRut] = useState('')
  const [clave, setClave] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  if (autenticado) {
    const destino = location.state?.desde ?? RUTAS.inicio
    return <Navigate to={destino} replace />
  }

  const onRutChange = (e) => {
    setRut(formatearRut(e.target.value))
    setError(null)
  }

  const enviar = async (e) => {
    e.preventDefault()

    if (!validarRut(rut)) {
      setError('Ingresa un RUT válido.')
      return
    }
    if (!clave.trim()) {
      setError('Ingresa tu clave.')
      return
    }

    setEnviando(true)
    setError(null)
    try {
      await login({ rut, clave })
      const destino = location.state?.desde ?? RUTAS.inicio
      navigate(destino, { replace: true })
    } catch (err) {
      setError(err.message ?? 'RUT o clave incorrectos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-100">
      <FondoDecorativo />

      <header className="relative z-10 flex justify-center px-4 py-6">
        <img src={logo} alt="Municipalidad de Chillán" className="h-12 w-auto object-contain" />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 pt-[6vh]">
        <div className="w-full max-w-sm">
          <div className="mb-7 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Archivador Digital</h1>
            <p className="mt-2 text-sm text-slate-500">Ingresa con tu RUT y clave para continuar.</p>
          </div>

          <div className="animate-aparecer rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5">
            <form onSubmit={enviar}>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">RUT</span>
                <input
                  value={rut}
                  onChange={onRutChange}
                  placeholder="12.345.678-9"
                  autoComplete="username"
                  className={CAMPO}
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Clave</span>
                <input
                  type="password"
                  value={clave}
                  onChange={(e) => { setClave(e.target.value); setError(null) }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={CAMPO}
                />
              </label>

              {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={enviando}
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[15px] font-medium text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {enviando
                  ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  : <>Ingresar <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-slate-400" />
              <p>
                Este acceso es provisorio mientras se aprueba la integración con{' '}
                <span className="font-medium text-slate-600">Clave Única</span>. Una vez habilitada,
                podrás ingresar directamente con ella.
              </p>
            </div>

            <button
              type="button"
              disabled
              title="Disponible cuando se apruebe la integración con Clave Única"
              className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-[15px] font-medium text-slate-400"
            >
              <LockKeyhole size={17} />
              Ingresar con Clave Única (próximamente)
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 shrink-0 pb-5 text-center text-xs text-slate-400">
        Archivador Digital · Municipalidad de Chillán
      </footer>
    </div>
  )
}

function FondoDecorativo() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 left-1/2 h-96 w-2xl -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-slate-200/50 blur-3xl" />
    </div>
  )
}
