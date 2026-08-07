import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BotonVolver({ texto = 'Volver', className = '' }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 ${className}`}
    >
      <ArrowLeft size={16} />
      {texto}
    </button>
  )
}