import { useState } from 'react'

const VACIO = {
  cargando: false,
  error: null,
  totalCausas: 0,
  totalDocumentos: 0,
  causasPorMes: [],
  documentosPorMes: [],
  causasPorEstado: [],
  topFuncionarios: [],
}

export function useEstadisticasDepartamento() {
  const [estado] = useState(VACIO)
  return estado
}