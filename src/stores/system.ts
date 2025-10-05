import { defineStore } from 'pinia'
import axios from '@/config/axios'
import { API_ENDPOINTS } from '@/config/api'

interface SystemType {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
  is_active: boolean
  is_default: boolean
}

interface SystemModule {
  id: number
  system_type_id: number
  name: string
  slug: string
  description: string
  route: string
  icon: string
  color: string
  permissions: string[]
  is_active: boolean
  is_required: boolean
  sort_order: number
}

interface SystemState {
  currentSystem: SystemType | null
  availableSystems: SystemType[]
  activeModules: SystemModule[]
  isLoading: boolean
}

export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    currentSystem: null,
    availableSystems: [],
    activeModules: [],
    isLoading: false
  }),

  getters: {
    getCurrentSystem: (state) => state.currentSystem,
    getAvailableSystems: (state) => state.availableSystems,
    getActiveModules: (state) => state.activeModules,
    isSystemLoaded: (state) => !!state.currentSystem,

    // Obtener módulos ordenados por sort_order
    getSortedModules: (state) => {
      return [...state.activeModules].sort((a, b) => a.sort_order - b.sort_order)
    },

    // Verificar si un módulo está activo
    isModuleActive: (state) => (moduleSlug: string) => {
      return state.activeModules.some(m => m.slug === moduleSlug && m.is_active)
    }
  },

  actions: {
    /**
     * Cargar sistemas disponibles para el usuario
     */
    async loadAvailableSystems() {
      try {
        this.isLoading = true
        const response = await axios.get(API_ENDPOINTS.SYSTEM_TYPES)

        if (response.data.success) {
          this.availableSystems = response.data.data
        }

        return { success: true, data: this.availableSystems }
      } catch (error: any) {
        console.error('Error cargando sistemas disponibles:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al cargar sistemas'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Cargar sistema actual del usuario
     */
    async loadCurrentSystem() {
      try {
        this.isLoading = true
        const response = await axios.get(API_ENDPOINTS.CURRENT_SYSTEM)

        if (response.data.success) {
          this.currentSystem = response.data.data
          // Cargar módulos del sistema actual
          if (this.currentSystem) {
            await this.loadSystemModules(this.currentSystem.id)
          }
        }

        return { success: true, data: this.currentSystem }
      } catch (error: any) {
        console.error('Error cargando sistema actual:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al cargar sistema actual'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Cargar módulos de un sistema específico
     */
    async loadSystemModules(systemTypeId: number) {
      try {
        const response = await axios.get(
          API_ENDPOINTS.SYSTEM_MODULES.replace(':systemTypeId', systemTypeId.toString())
        )

        if (response.data.success) {
          this.activeModules = response.data.data.filter((m: SystemModule) => m.is_active)
        }

        return { success: true, data: this.activeModules }
      } catch (error: any) {
        console.error('Error cargando módulos del sistema:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al cargar módulos'
        }
      }
    },

    /**
     * Cambiar sistema actual del usuario
     */
    async changeSystem(systemTypeId: number) {
      try {
        this.isLoading = true
        const response = await axios.post(API_ENDPOINTS.CHANGE_SYSTEM, {
          system_type_id: systemTypeId
        })

        if (response.data.success) {
          this.currentSystem = response.data.data
          // Recargar módulos del nuevo sistema
          await this.loadSystemModules(systemTypeId)
        }

        return { success: true, data: this.currentSystem }
      } catch (error: any) {
        console.error('Error cambiando sistema:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al cambiar sistema'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Obtener vista previa de módulos de un sistema
     */
    async previewSystemModules(systemTypeId: number) {
      try {
        const response = await axios.get(
          API_ENDPOINTS.SYSTEM_MODULES.replace(':systemTypeId', systemTypeId.toString())
        )

        if (response.data.success) {
          return { success: true, data: response.data.data }
        }

        return { success: false, data: [] }
      } catch (error: any) {
        console.error('Error obteniendo vista previa de módulos:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al obtener módulos'
        }
      }
    },

    /**
     * Limpiar estado
     */
    clearSystem() {
      this.currentSystem = null
      this.activeModules = []
      this.availableSystems = []
    }
  }
})
