<template>
  <span :class="badgeClasses">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: string
  label?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  label: ''
})

// Mapeo de variantes a clases
const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
}

// Mapeo de estados específicos (para cotizaciones, por ejemplo)
const statusVariantMap: Record<string, string> = {
  'borrador': 'default',
  'draft': 'default',
  'enviada': 'warning',
  'sent': 'warning',
  'aprobada': 'success',
  'approved': 'success',
  'rechazada': 'danger',
  'rejected': 'danger',
  'vencida': 'purple',
  'expired': 'purple',
  'activo': 'success',
  'active': 'success',
  'inactivo': 'default',
  'inactive': 'default',
  'pendiente': 'warning',
  'pending': 'warning',
  'completado': 'success',
  'completed': 'success',
  'cancelado': 'danger',
  'cancelled': 'danger'
}

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'
  
  // Determinar la variante basada en el status o usar la variante explícita
  const statusKey = props.status.toLowerCase()
  const mappedVariant = statusVariantMap[statusKey] || props.variant
  const variantClass = variantClasses[mappedVariant] || variantClasses.default
  
  return `${baseClasses} ${variantClass}`
})
</script>

<style scoped>
/* Los estilos están en las clases de Tailwind */
</style>

