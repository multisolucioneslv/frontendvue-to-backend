import { computed } from 'vue'
import { useSystemStore } from '@/stores/system'
import { useRouter } from 'vue-router'

export function useSystem() {
  const systemStore = useSystemStore()
  const router = useRouter()

  // Estado
  const currentSystem = computed(() => systemStore.currentSystem)
  const availableSystems = computed(() => systemStore.availableSystems)
  const activeModules = computed(() => systemStore.getSortedModules)
  const isLoading = computed(() => systemStore.isLoading)
  const isSystemLoaded = computed(() => systemStore.isSystemLoaded)

  /**
   * Inicializar sistema - cargar sistema actual y sistemas disponibles
   */
  const initializeSystem = async () => {
    await Promise.all([
      systemStore.loadCurrentSystem(),
      systemStore.loadAvailableSystems()
    ])
  }

  /**
   * Cargar sistemas disponibles
   */
  const loadAvailableSystems = async () => {
    return await systemStore.loadAvailableSystems()
  }

  /**
   * Cambiar sistema actual
   */
  const changeSystem = async (systemTypeId: number) => {
    const result = await systemStore.changeSystem(systemTypeId)

    if (result.success) {
      // Redirigir al dashboard después de cambiar sistema
      router.push('/app/dashboard')
    }

    return result
  }

  /**
   * Obtener vista previa de módulos de un sistema
   */
  const previewModules = async (systemTypeId: number) => {
    return await systemStore.previewSystemModules(systemTypeId)
  }

  /**
   * Verificar si un módulo está activo
   */
  const isModuleActive = (moduleSlug: string): boolean => {
    return systemStore.isModuleActive(moduleSlug)
  }

  /**
   * Verificar si el usuario tiene un módulo específico
   */
  const hasModule = (moduleSlug: string): boolean => {
    return activeModules.value.some(m => m.slug === moduleSlug)
  }

  /**
   * Obtener módulo por slug
   */
  const getModuleBySlug = (moduleSlug: string) => {
    return activeModules.value.find(m => m.slug === moduleSlug)
  }

  /**
   * Obtener ruta de un módulo
   */
  const getModuleRoute = (moduleSlug: string): string | null => {
    const module = getModuleBySlug(moduleSlug)
    return module?.route || null
  }

  /**
   * Verificar si el usuario tiene permiso en un módulo
   */
  const hasModulePermission = (moduleSlug: string, permission: string): boolean => {
    const module = getModuleBySlug(moduleSlug)
    return module?.permissions.includes(permission) || false
  }

  /**
   * Obtener módulos requeridos
   */
  const getRequiredModules = computed(() => {
    return activeModules.value.filter(m => m.is_required)
  })

  /**
   * Obtener módulos opcionales
   */
  const getOptionalModules = computed(() => {
    return activeModules.value.filter(m => !m.is_required)
  })

  /**
   * Comparar módulos entre dos sistemas
   */
  const compareModules = (currentModules: any[], newModules: any[]) => {
    const currentSlugs = new Set(currentModules.map(m => m.slug))
    const newSlugs = new Set(newModules.map(m => m.slug))

    const toActivate = newModules.filter(m => !currentSlugs.has(m.slug))
    const toDeactivate = currentModules.filter(m => !newSlugs.has(m.slug))
    const common = newModules.filter(m => currentSlugs.has(m.slug))

    return {
      toActivate,
      toDeactivate,
      common
    }
  }

  return {
    // Estado
    currentSystem,
    availableSystems,
    activeModules,
    isLoading,
    isSystemLoaded,

    // Módulos computados
    requiredModules: getRequiredModules,
    optionalModules: getOptionalModules,

    // Acciones
    initializeSystem,
    loadAvailableSystems,
    changeSystem,
    previewModules,

    // Utilidades
    isModuleActive,
    hasModule,
    getModuleBySlug,
    getModuleRoute,
    hasModulePermission,
    compareModules
  }
}
