import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { RUTAS } from '@/lib/rutas'
import logo from '../assets/logo-chillan-letras.png'

const RUT_TEMPORAL = '22222222-2'

export default function Login() {
  const { autenticado, login } = useAuth()
  const navigate = useNavigate()

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  if (autenticado) {
    return <Navigate to={RUTAS.inicio} replace />
  }

  const iniciarSesion = async () => {
    setEnviando(true)
    setError(null)
    try {
      await login({ rut: RUT_TEMPORAL, clave: 'claveunica' })
      navigate(RUTAS.inicio, { replace: true })
    } catch (err) {
      setError(err?.error ?? err?.message ?? 'No se pudo iniciar sesión.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-100 px-4">
      <FondoDecorativo />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/70 bg-white px-8 py-12 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="Municipalidad de Chillán" className="h-20 w-auto object-contain" />

          <h1 className="mt-8 text-2xl font-bold text-slate-900">Archivador Digital</h1>
          <p className="mt-1.5 text-sm text-slate-500">Iniciar sesión con mi ClaveÚnica</p>

          <button
            onClick={iniciarSesion}
            type="button"
            disabled={enviando}
            className={`btn-cu btn-m btn-color-estandar rounded-full mt-8 ${
              enviando ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <span className="cl-claveunica" aria-hidden="true" />
            <span className="text">{enviando ? 'Dirigiendo…' : 'Iniciar sesión'}</span>
          </button>

          {error && (
            <p className="mt-6 w-full rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function FondoDecorativo() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
    </div>
  )
}