export const RUTAS = {
  inicio: '/',
  login: '/login',
  buscar: '/buscar',
  recientes: '/recientes',
  estadisticas: '/estadisticas',
  expediente: (rol) => `/expedientes/${encodeURIComponent(rol)}`,
  documento: (rol, uid) => `/expedientes/${encodeURIComponent(rol)}/documentos/${uid}`,
  expedientePatron: '/expedientes/:rol',
  documentoPatron: '/expedientes/:rol/documentos/:uid',
}