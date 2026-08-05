import { useCallback, useState } from 'react'
import { authApi } from '@/api/auth'
import { AuthContext } from '@/context/authContextObj'

const TOKEN_KEY = 'token'
const USUARIO_KEY = 'usuario'

function usuarioGuardadoInicial() {
  const token = localStorage.getItem(TOKEN_KEY)
  const usuarioGuardado = localStorage.getItem(USUARIO_KEY)
  if (!token || !usuarioGuardado) return null

  try {
    return JSON.parse(usuarioGuardado)
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USUARIO_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(usuarioGuardadoInicial)

  const login = useCallback(async ({ rut, clave }) => {
    const { token, usuario: datosUsuario } = await authApi.login({ rut, clave })
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USUARIO_KEY, JSON.stringify(datosUsuario))
    setUsuario(datosUsuario)
    return datosUsuario
  }, [])

  const logout = useCallback(() => {
    authApi.logout().catch(() => {})
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USUARIO_KEY)
    setUsuario(null)
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, autenticado: !!usuario, cargando: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
