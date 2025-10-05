<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Tipo de Sistema</h2>
      <p class="text-muted-foreground">
        Configura el tipo de sistema que utilizarás. Los módulos disponibles cambiarán según tu selección.
      </p>
    </div>

    <!-- Sistema Actual -->
    <div v-if="currentSystem" class="rounded-lg border bg-card p-6">
      <div class="flex items-start justify-between">
        <div class="space-y-1">
          <h3 class="text-lg font-medium">Sistema Actual</h3>
          <div class="flex items-center gap-3 mt-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-lg"
              :style="{ backgroundColor: currentSystem.color + '20', color: currentSystem.color }"
            >
              <component :is="getIcon(currentSystem.icon)" class="h-6 w-6" />
            </div>
            <div>
              <p class="font-semibold">{{ currentSystem.name }}</p>
              <p class="text-sm text-muted-foreground">{{ currentSystem.description }}</p>
            </div>
          </div>
        </div>
        <div
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :style="{ backgroundColor: currentSystem.color + '20', color: currentSystem.color }"
        >
          Activo
        </div>
      </div>

      <!-- Módulos Activos -->
      <div class="mt-6">
        <h4 class="text-sm font-medium mb-3">Módulos Activos ({{ activeModules.length }})</h4>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="module in activeModules"
            :key="module.id"
            class="flex items-center gap-2 rounded-md border p-2 text-sm"
          >
            <component :is="getIcon(module.icon)" class="h-4 w-4" :style="{ color: module.color }" />
            <span>{{ module.name }}</span>
            <span
              v-if="module.is_required"
              class="ml-auto text-xs text-muted-foreground"
            >
              Requerido
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Selector de Sistema -->
    <div class="rounded-lg border bg-card p-6">
      <h3 class="text-lg font-medium mb-4">Cambiar Tipo de Sistema</h3>

      <div class="space-y-4">
        <!-- Dropdown de sistemas -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Seleccionar Nuevo Sistema</label>
          <select
            v-model="selectedSystemId"
            @change="handleSystemChange"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option :value="null" disabled>Selecciona un sistema...</option>
            <option
              v-for="system in availableSystems"
              :key="system.id"
              :value="system.id"
              :disabled="!system.is_active || system.id === currentSystem?.id"
            >
              {{ system.name }} {{ !system.is_active ? '(Inactivo)' : '' }}
            </option>
          </select>
        </div>

        <!-- Vista Previa de Módulos -->
        <div v-if="previewModules.length > 0" class="space-y-3">
          <div class="rounded-md bg-blue-50 dark:bg-blue-950 p-4">
            <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Vista Previa de Módulos
            </h4>
            <p class="text-xs text-blue-700 dark:text-blue-300 mb-3">
              El nuevo sistema tendrá {{ previewModules.length }} módulos disponibles
            </p>

            <!-- Comparación de módulos -->
            <div class="space-y-2">
              <!-- Módulos que se activarán -->
              <div v-if="modulesComparison.toActivate.length > 0">
                <p class="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                  + Se activarán ({{ modulesComparison.toActivate.length }}):
                </p>
                <div class="grid grid-cols-2 gap-1">
                  <span
                    v-for="module in modulesComparison.toActivate"
                    :key="module.id"
                    class="text-xs text-green-600 dark:text-green-400"
                  >
                    • {{ module.name }}
                  </span>
                </div>
              </div>

              <!-- Módulos que se desactivarán -->
              <div v-if="modulesComparison.toDeactivate.length > 0">
                <p class="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                  - Se desactivarán ({{ modulesComparison.toDeactivate.length }}):
                </p>
                <div class="grid grid-cols-2 gap-1">
                  <span
                    v-for="module in modulesComparison.toDeactivate"
                    :key="module.id"
                    class="text-xs text-red-600 dark:text-red-400"
                  >
                    • {{ module.name }}
                  </span>
                </div>
              </div>

              <!-- Módulos en común -->
              <div v-if="modulesComparison.common.length > 0">
                <p class="text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                  = Se mantendrán ({{ modulesComparison.common.length }}):
                </p>
                <div class="grid grid-cols-2 gap-1">
                  <span
                    v-for="module in modulesComparison.common"
                    :key="module.id"
                    class="text-xs text-gray-600 dark:text-gray-400"
                  >
                    • {{ module.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Advertencia -->
          <div class="rounded-md bg-yellow-50 dark:bg-yellow-950 p-4">
            <div class="flex">
              <AlertTriangle class="h-5 w-5 text-yellow-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Importante
                </h3>
                <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <ul class="list-disc list-inside space-y-1">
                    <li>Cambiar el tipo de sistema modificará los módulos disponibles</li>
                    <li>Serás redirigido al dashboard después del cambio</li>
                    <li>Algunas configuraciones pueden ser específicas del sistema</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-3">
          <button
            @click="confirmChangeSystem"
            :disabled="!selectedSystemId || isLoading || selectedSystemId === currentSystem?.id"
            class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Cambiando...' : 'Cambiar Sistema' }}
          </button>
          <button
            @click="cancelChange"
            :disabled="isLoading"
            class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSystem } from '@/composables/useSystem'
import { useToast } from '@/composables/useToast'
import {
  AlertTriangle,
  Loader2,
  LayoutDashboard,
  Package,
  Users,
  Building2,
  FolderOpen,
  Settings,
  Calendar,
  FileText,
  Heart,
  ShoppingCart,
  Scale,
  Archive,
  Stethoscope,
  Package as PackageIcon,
  UserCheck
} from 'lucide-vue-next'

const {
  currentSystem,
  availableSystems,
  activeModules,
  isLoading,
  initializeSystem,
  changeSystem,
  previewModules: previewSystemModules,
  compareModules
} = useSystem()

const { showToast } = useToast()

const selectedSystemId = ref<number | null>(null)
const previewModules = ref<any[]>([])
const modulesComparison = ref({
  toActivate: [],
  toDeactivate: [],
  common: []
})

// Iconos disponibles
const iconMap: Record<string, any> = {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  FolderOpen,
  Settings,
  Calendar,
  FileText,
  Heart,
  ShoppingCart,
  Scale,
  Archive,
  Stethoscope,
  PackageIcon,
  UserCheck
}

const getIcon = (iconName: string) => {
  return iconMap[iconName] || LayoutDashboard
}

// Cargar vista previa cuando cambia la selección
const handleSystemChange = async () => {
  if (!selectedSystemId.value) {
    previewModules.value = []
    return
  }

  const result = await previewSystemModules(selectedSystemId.value)
  if (result.success && result.data) {
    previewModules.value = result.data.filter((m: any) => m.is_active)

    // Comparar módulos
    modulesComparison.value = compareModules(
      activeModules.value,
      previewModules.value
    )
  }
}

// Confirmar cambio de sistema
const confirmChangeSystem = async () => {
  if (!selectedSystemId.value) return

  const result = await changeSystem(selectedSystemId.value)

  if (result.success) {
    showToast({
      title: 'Sistema cambiado',
      description: `Has cambiado al sistema ${result.data.name}`,
      variant: 'success'
    })

    // Limpiar selección
    selectedSystemId.value = null
    previewModules.value = []
  } else {
    showToast({
      title: 'Error',
      description: result.message || 'No se pudo cambiar el sistema',
      variant: 'destructive'
    })
  }
}

// Cancelar cambio
const cancelChange = () => {
  selectedSystemId.value = null
  previewModules.value = []
  modulesComparison.value = {
    toActivate: [],
    toDeactivate: [],
    common: []
  }
}

// Inicializar
onMounted(async () => {
  await initializeSystem()
})
</script>
