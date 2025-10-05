import { ref, computed } from 'vue'
import { API_CONFIG } from '@/config/api'

// Estado global de configuración inicial
const isInitialSetupCompleted = ref(false)
const selectedSystemType = ref(null)
const setupStep = ref(0) // 0: no iniciado, 1: seleccionando sistema, 2: configurando módulos, 3: completado

// Configuración de pasos del setup
const setupSteps = [
  {
    id: 1,
    title: 'Seleccionar Tipo de Sistema',
    description: 'Elige el tipo de sistema que deseas implementar',
    icon: 'Settings',
    completed: false
  },
  {
    id: 2,
    title: 'Configurar Módulos',
    description: 'Selecciona los módulos que estarán disponibles',
    icon: 'Layers',
    completed: false
  },
  {
    id: 3,
    title: 'Configuración Inicial',
    description: 'Establece la configuración básica del sistema',
    icon: 'Cog',
    completed: false
  },
  {
    id: 4,
    title: 'Completar Setup',
    description: 'Finaliza la configuración inicial',
    icon: 'CheckCircle',
    completed: false
  }
]

export function useInitialSetup() {
  // Verificar si el setup inicial está completado
  const checkSetupStatus = async () => {
    try {
      console.log('🔍 useInitialSetup - Verificando estado del setup...')
      const response = await fetch(`${API_CONFIG.URL_BASE}/initial-config/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        console.error(`Error ${response.status}: ${response.statusText}`)
        isInitialSetupCompleted.value = false
        console.log('❌ useInitialSetup - Error en respuesta, setup = false')
        return
      }
      
      const responseText = await response.text()
      
      if (!responseText || responseText.trim() === '') {
        console.log('Respuesta vacía de la API, asumiendo setup no completado')
        isInitialSetupCompleted.value = false
        console.log('❌ useInitialSetup - Respuesta vacía, setup = false')
        return
      }
      
      try {
        const data = JSON.parse(responseText)
        console.log('📊 useInitialSetup - Datos recibidos:', data)
        
        if (data.success && data.data) {
          isInitialSetupCompleted.value = data.data.is_completed
          console.log('✅ useInitialSetup - Estado actualizado:', isInitialSetupCompleted.value)
          
          // Si está completado, cargar datos adicionales
          if (isInitialSetupCompleted.value) {
            await loadSystemConfiguration()
          }
        } else {
          isInitialSetupCompleted.value = false
          console.log('❌ useInitialSetup - Datos inválidos, setup = false')
        }
      } catch (parseError) {
        console.error('Error parseando respuesta JSON:', parseError)
        console.log('Respuesta recibida:', responseText)
        isInitialSetupCompleted.value = false
        console.log('❌ useInitialSetup - Error parseando JSON, setup = false')
      }
    } catch (error) {
      console.error('Error verificando estado del setup:', error)
      isInitialSetupCompleted.value = false
      console.log('❌ useInitialSetup - Error general, setup = false')
    }
  }

  // Cargar configuración del sistema
  const loadSystemConfiguration = async () => {
    try {
      const response = await fetch(`${API_CONFIG.URL_BASE}/initial-config/public`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const responseText = await response.text()
        
        if (responseText && responseText.trim() !== '') {
          try {
            const data = JSON.parse(responseText)
            
            if (data.success && data.data) {
              // Buscar configuración del tipo de sistema
              const systemTypeConfig = data.data.find((config: any) => config.key === 'selected_system_type')
              if (systemTypeConfig && systemTypeConfig.value) {
                selectedSystemType.value = systemTypeConfig.value
              }
              
              // Buscar configuración de módulos
              const modulesConfig = data.data.find((config: any) => config.key === 'selected_modules')
              if (modulesConfig && modulesConfig.value) {
                // Aquí podrías cargar los módulos seleccionados
                console.log('Módulos seleccionados:', modulesConfig.value)
              }
            }
          } catch (parseError) {
            console.error('Error parseando configuración del sistema:', parseError)
          }
        }
      }
    } catch (error) {
      console.error('Error cargando configuración del sistema:', error)
    }
  }

  // Marcar paso como completado
  const completeStep = (stepId: number) => {
    const step = setupSteps.find(s => s.id === stepId)
    if (step) {
      step.completed = true
      setupStep.value = stepId
    }
  }

  // Completar setup inicial
  const completeInitialSetup = async (setupData: any) => {
    try {
      const response = await fetch(`${API_CONFIG.URL_BASE}/initial-config/mark-completed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          system_type: setupData.systemType?.slug || setupData.systemType,
          admin_data: setupData.adminData,
          modules: setupData.modules || []
        })
      })
      
      if (!response.ok) {
        console.error(`Error ${response.status}: ${response.statusText}`)
        throw new Error(`Error al completar configuración: ${response.status}`)
      }
      
      const responseText = await response.text()
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Respuesta vacía del servidor')
      }
      
      try {
        const data = JSON.parse(responseText)
        
        if (data.success) {
          isInitialSetupCompleted.value = true
          selectedSystemType.value = setupData.systemType
          setupStep.value = 4
          
          // Limpiar datos locales ya que ahora usamos la API
          localStorage.removeItem('initialSetupData')
          localStorage.removeItem('initialSetupCompleted')
          
          return { 
            success: true, 
            message: data.message,
            redirectTo: '/admin-setup'
          }
        } else {
          throw new Error(data.message || 'Error al completar configuración')
        }
      } catch (parseError) {
        console.error('Error parseando respuesta JSON:', parseError)
        console.log('Respuesta recibida:', responseText)
        throw new Error('Error procesando respuesta del servidor')
      }
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

  // Reiniciar setup
  const resetSetup = () => {
    isInitialSetupCompleted.value = false
    selectedSystemType.value = null
    setupStep.value = 0
    setupSteps.forEach(step => step.completed = false)
  }

  // Computed properties
  const canProceedToLogin = computed(() => isInitialSetupCompleted.value)
  const currentStep = computed(() => setupSteps.find(s => s.id === setupStep.value))
  const progressPercentage = computed(() => (setupStep.value / setupSteps.length) * 100)

  return {
    // Estado
    isInitialSetupCompleted,
    selectedSystemType,
    setupStep,
    setupSteps,
    
    // Computed
    canProceedToLogin,
    currentStep,
    progressPercentage,
    
    // Métodos
    checkSetupStatus,
    completeStep,
    completeInitialSetup,
    resetSetup
  }
}
