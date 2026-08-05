import axiosClient from './axiosClient'

export const documentosApi = {
  bytes: (uid, { descargar = false } = {}) =>
    axiosClient.get(`/documentos/${uid}/archivo`, {
      params: descargar ? { descargar: 'true' } : undefined,
      responseType: 'arraybuffer',
    }),

  objectUrl: async (uid, { descargar = false } = {}) => {
    const blob = await axiosClient.get(`/documentos/${uid}/archivo`, {
      params: descargar ? { descargar: 'true' } : undefined,
      responseType: 'blob',
    })
    return URL.createObjectURL(blob)
  },
}