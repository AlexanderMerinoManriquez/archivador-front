import axiosClient from './axiosClient'
import { rutParaApi } from '@/lib/rut'
import { normalizarUsuario } from '@/lib/normalizar'

export const authApi = {
  login: async ({ rut, clave }) => {
    const rutLimpio = rutParaApi(rut)

    const { token, funcionario } = await axiosClient.post('/login', {
      rut: rutLimpio,
      clave,
    })

    localStorage.setItem('token', token)

    let me = {}
    try {
      me = await axiosClient.get('/me')
    } catch {
      //
    }

    return {
      token,
      usuario: normalizarUsuario(funcionario, me),
    }
  },

  yo: async () => {
    const me = await axiosClient.get('/me')
    return normalizarUsuario(me, me)
  },

  logout: () => Promise.resolve(true),

  loginClaveUnica: () => {
    const url = import.meta.env.VITE_CLAVE_UNICA_AUTH_URL
    if (!url) {
      return Promise.reject({ message: 'Clave Única todavía no está habilitada.' })
    }
    window.location.href = url
  },
}