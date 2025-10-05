import { useInitialSetup } from '@/composables/useInitialSetup'

// Middleware para verificar si el setup inicial está completado
export function useSetupMiddleware() {
  const { isInitialSetupCompleted, checkSetupStatus } = useInitialSetup()

  // Verificar si el setup está completado antes de permitir acceso
  const verifySetupCompleted = async () => {
    // Siempre verificar el estado del setup desde la API
    await checkSetupStatus()
    return isInitialSetupCompleted.value
  }

  // Middleware para rutas que requieren setup completado
  const requireSetupCompleted = async (to: any, from: any, next: any) => {
    const isCompleted = await verifySetupCompleted()
    
    if (!isCompleted) {
      // Si el setup no está completado, redirigir a configuración inicial
      next('/initial-setup')
      return
    }
    
    // Si está completado, continuar
    next()
  }

  // Middleware para rutas que requieren setup NO completado (como configuración inicial)
  const requireSetupNotCompleted = async (to: any, from: any, next: any) => {
    const isCompleted = await verifySetupCompleted()
    
    if (isCompleted) {
      // Si el setup ya está completado, redirigir al dashboard
      next('/app/dashboard')
      return
    }
    
    // Si no está completado, continuar
    next()
  }

  return {
    verifySetupCompleted,
    requireSetupCompleted,
    requireSetupNotCompleted
  }
}
