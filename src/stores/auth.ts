import { defineStore } from 'pinia'
import axios from '@/config/axios'
import { API_ENDPOINTS } from '@/config/api'
import { useSystemStore } from './system'

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
    async loadUser() {
      if (this.token) {
        try {
          const response = await axios.get(API_ENDPOINTS.USER)
          // El backend devuelve los datos del usuario directamente
          this.user = response.data

          console.log('Usuario cargado:', this.user)

          // Cargar sistema del usuario después de cargar el usuario
          await this.loadUserSystem()
        } catch (error) {
          console.error('Error cargando usuario:', error)
          // Si hay error, limpiar sesión
          this.logout()
        }
      }
    },

    async loadUserSystem() {
      try {
        const systemStore = useSystemStore()
        await systemStore.loadCurrentSystem()
      } catch (error) {
        console.error('Error cargando sistema del usuario:', error)
      }
    },

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
          this.isAuthenticated = true

          // Guardar en localStorage
          localStorage.setItem('token', response.data.token)

          // Configurar axios para futuras peticiones
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

          // Cargar datos completos del usuario desde /user
          await this.loadUser()

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

      // Limpiar sistema al cerrar sesión
      const systemStore = useSystemStore()
      systemStore.clearSystem()
    },

    // Restaurar sesión desde localStorage
    async restoreSession() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        // Cargar usuario y sistema si no están cargados
        if (!this.user) {
          await this.loadUser()
        }
      }
    }
  }
})
