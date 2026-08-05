import axiosClient from './axiosClient'
import { normalizarExpediente } from '@/lib/normalizar'

async function buscarPorRol(rol) {
  try {
    const data = await axiosClient.get('/causas/buscar', { params: { rol } })
    return (data ?? []).map(normalizarExpediente)
  } catch (err) {
    if (err?.error || err?.message) return []
    return []
  }
}

export const expedientesApi = {
  getById: async (rol) => {
    const encontrados = await buscarPorRol(rol)
    return encontrados[0] ?? null
  },

  consultaPublica: (rol) => buscarPorRol(rol),

  crear: async (datos) => {
    const causa = await axiosClient.post('/causas', {
      rol: datos.rol,
      caratula: datos.caratula,
    })
    return normalizarExpediente(causa)
  },

  recientes: async () => {
    const data = await axiosClient.get('/causas/recientes')
    return (data ?? []).map(normalizarExpediente)
  },

  eliminarDocumento: (uid) => axiosClient.delete(`/documentos/${uid}`),

  agregarDocumento: (expedienteId, datos, archivo) => {
    const form = new FormData()
    form.append('archivo', archivo)
    if (datos?.nombre) form.append('nombre', datos.nombre)
    return axiosClient.post(`/causas/${expedienteId}/documentos`, form)
  },
}