import { defineStore } from 'pinia'
import axios from '@/config/axios'
import { API_ENDPOINTS } from '@/config/api'

interface AuthState {
  token: string | null
  user: any | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    user: null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async login(credentials: { identifier: string; password: string; type: string }) {
      try {
        const loginData: any = {
          password: credentials.password
        }

        if (credentials.type === 'email') {
          loginData.email = credentials.identifier
        } else {
          loginData.username = credentials.identifier
        }

        console.log('Enviando datos de login:', loginData)

        const response = await axios.post(API_ENDPOINTS.LOGIN, loginData)

        if (response.data.token) {
          this.token = response.data.token
          this.user = response.data.user || null
          this.isAuthenticated = true

          // Guardar en localStorage
          localStorage.setItem('token', response.data.token)

          // Configurar axios para futuras peticiones
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

          return { success: true, data: response.data }
        }

        return { success: false, message: 'No se recibió token' }
      } catch (error: any) {
        console.error('Error en login:', error)
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          headers: error.response?.headers
        })
        console.error('Respuesta completa del servidor:', error.response)
        return {
          success: false,
          message: error.response?.data?.error || error.response?.data?.message || 'Error al iniciar sesión'
        }
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    // Restaurar sesión desde localStorage
    restoreSession() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    }
  }
})
