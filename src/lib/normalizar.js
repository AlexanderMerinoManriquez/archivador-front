const ROL_FUNCIONARIO = 'funcionario'

export function normalizarUsuario(funcionario = {}, me = {}) {
  const nombre = [funcionario.nombre ?? me.nombre, funcionario.apellido ?? me.apellido]
    .filter(Boolean)
    .join(' ')
    .trim()

  return {
    rut: funcionario.rut ?? me.rut,
    nombre: nombre || (funcionario.rut ?? me.rut),
    rol: ROL_FUNCIONARIO,
    departamentoId: funcionario.departamento_id ?? me.departamento_id ?? null,
    departamentoNombre: me.departamento_nombre ?? null,
    departamentoCodigo: me.departamento_codigo ?? null,
  }
}

export function normalizarDocumento(doc = {}) {
  const pesoMb = parseFloat(doc.peso_mb ?? 0) || 0
  return {
    id: doc.id,
    uid: doc.uid,
    nombre: doc.nombre || doc.observacion || doc.nombre_archivo || 'Documento',
    nombreArchivo: doc.nombre_archivo,
    observacion: doc.observacion ?? '',
    creadoEn: doc.fecha_subida,
    pesoMb,
    tamano: Math.round(pesoMb * 1024 * 1024),
  }
}

export function normalizarExpediente(causa = {}) {
  return {
    id: causa.id,
    rol: causa.rol,
    caratula: causa.caratula ?? '',
    anio: causa.anio,
    departamentoId: causa.departamento_id ?? null,
    departamentoNombre: causa.departamento_nombre ?? null,
    departamentoCodigo: causa.departamento_codigo ?? null,
    creadoEn: causa.fecha_creacion,
    documentos: Array.isArray(causa.documentos)
      ? causa.documentos.map(normalizarDocumento)
      : [],
  }
}