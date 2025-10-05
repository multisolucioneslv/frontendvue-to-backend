<template>
  <div class="timezone-settings">
    <div class="settings-header">
      <Clock class="h-8 w-8 text-blue-600 dark:text-blue-400" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Configuración de Zona Horaria</h1>
    </div>

    <div class="settings-content">
      <!-- Información Actual -->
      <Card class="current-timezone-card">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Zona Horaria Actual</h2>
        </div>
        <div class="card-content">
          <div class="timezone-info">
            <div class="info-item">
              <span class="label">Zona Horaria:</span>
              <span class="value timezone-name">{{ currentTimezone || 'Cargando...' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Fecha y Hora Actual:</span>
              <span class="value current-datetime">{{ currentFormattedDateTime || 'Cargando...' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Offset UTC:</span>
              <span class="value utc-offset">{{ utcOffset || 'Cargando...' }}</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Selector de Zona Horaria -->
      <Card class="timezone-selector-card">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Cambiar Zona Horaria</h2>
          <p class="text-gray-600 dark:text-gray-400">Selecciona la zona horaria que deseas usar en el sistema</p>
        </div>
        <div class="card-content">
          <div class="timezone-selector">
            <label for="timezone-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Zona Horaria
            </label>
            <select 
              id="timezone-select"
              v-model="selectedTimezone"
              class="timezone-select"
              :disabled="loading"
            >
              <option value="" disabled>Selecciona una zona horaria</option>
              <option 
                v-for="(label, value) in availableTimezones" 
                :key="value" 
                :value="value"
              >
                {{ label }}
              </option>
            </select>
            
            <div class="timezone-preview" v-if="selectedTimezone && selectedTimezone !== currentTimezone">
              <h3 class="preview-title">Vista Previa</h3>
              <div class="preview-content">
                <p><strong>Nueva Zona Horaria:</strong> {{ getTimezoneLabel(selectedTimezone) }}</p>
                <p><strong>Fecha y Hora:</strong> {{ previewDateTime }}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Acciones -->
      <div class="settings-actions">
        <Button 
          @click="saveTimezone"
          :loading="saving"
          variant="primary"
          :disabled="!selectedTimezone || selectedTimezone === currentTimezone"
          class="save-button"
        >
          <Save class="h-5 w-5 mr-2" />
          <span v-if="saving">Guardando...</span>
          <span v-else>Guardar Zona Horaria</span>
        </Button>
        
        <Button 
          @click="refreshDateTime"
          :loading="loading"
          variant="secondary"
          class="refresh-button"
        >
          <RefreshCw class="h-5 w-5 mr-2" />
          Actualizar
        </Button>
      </div>

      <!-- Información Adicional -->
      <Card class="info-card">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Información</h2>
        </div>
        <div class="card-content">
          <div class="info-text">
            <p class="mb-4">
              La zona horaria configurada afecta a:
            </p>
            <ul class="info-list">
              <li>📅 Fechas y horas en reportes del sistema</li>
              <li>🕐 Timestamps de logs y auditoría</li>
              <li>📊 Métricas y estadísticas temporales</li>
              <li>🔔 Programación de tareas automáticas</li>
              <li>📋 Sistema de reportes organizados por fecha</li>
            </ul>
            <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <strong>Nota:</strong> Los cambios se aplicarán inmediatamente y afectarán a todos los usuarios del sistema.
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { useDateTime } from '@/composables/useDateTime'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { Clock, Save, RefreshCw } from 'lucide-vue-next'
import axios from '@/config/axios'

const { success, error: showError } = useToast()
const { 
  currentTimezone, 
  currentFormattedDateTime, 
  fetchCurrentDateTime 
} = useDateTime()

// Estado
const selectedTimezone = ref('')
const availableTimezones = ref<Record<string, string>>({})
const loading = ref(false)
const saving = ref(false)
const utcOffset = ref('')
const previewDateTime = ref('')

// Computed
const canSave = computed(() => {
  return selectedTimezone.value && 
         selectedTimezone.value !== currentTimezone.value && 
         !saving.value
})

// Métodos
const loadCurrentTimezone = async () => {
  try {
    loading.value = true
    const response = await axios.get('/timezone/current')
    
    if (response.data.success) {
      selectedTimezone.value = response.data.data.timezone
      utcOffset.value = response.data.data.current_datetime.utc_offset
    }
  } catch (error: any) {
    console.error('Error cargando zona horaria:', error)
    showError('Error', 'No se pudo cargar la zona horaria actual')
  } finally {
    loading.value = false
  }
}

const loadAvailableTimezones = async () => {
  try {
    const response = await axios.get('/timezone/available')
    
    if (response.data.success) {
      availableTimezones.value = response.data.data
    }
  } catch (error: any) {
    console.error('Error cargando zonas horarias:', error)
    showError('Error', 'No se pudieron cargar las zonas horarias disponibles')
  }
}

const refreshDateTime = async () => {
  try {
    loading.value = true
    await fetchCurrentDateTime()
    await loadCurrentTimezone()
    success('Actualizado', 'Información de fecha y hora actualizada')
  } catch (error: any) {
    console.error('Error actualizando fecha:', error)
    showError('Error', 'No se pudo actualizar la información')
  } finally {
    loading.value = false
  }
}

const saveTimezone = async () => {
  try {
    saving.value = true
    
    const response = await axios.post('/timezone/set', {
      timezone: selectedTimezone.value
    })
    
    if (response.data.success) {
      success('Zona Horaria Actualizada', 'La zona horaria se ha cambiado correctamente')
      
      // Actualizar la información local
      await fetchCurrentDateTime()
      await loadCurrentTimezone()
    } else {
      throw new Error(response.data.message || 'Error al guardar zona horaria')
    }
  } catch (error: any) {
    console.error('Error guardando zona horaria:', error)
    showError('Error', error.response?.data?.message || 'No se pudo guardar la zona horaria')
  } finally {
    saving.value = false
  }
}

const getTimezoneLabel = (timezone: string) => {
  return availableTimezones.value[timezone] || timezone
}

// Generar vista previa de fecha/hora cuando cambia la zona horaria seleccionada
const updatePreview = () => {
  if (selectedTimezone.value && selectedTimezone.value !== currentTimezone.value) {
    try {
      const now = new Date()
      previewDateTime.value = now.toLocaleString('es-ES', {
        timeZone: selectedTimezone.value,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch (error) {
      previewDateTime.value = 'Error calculando vista previa'
    }
  } else {
    previewDateTime.value = ''
  }
}

// Watchers
import { watch } from 'vue'
watch(selectedTimezone, updatePreview)

onMounted(async () => {
  await Promise.all([
    loadAvailableTimezones(),
    loadCurrentTimezone(),
    fetchCurrentDateTime()
  ])
})
</script>

<style scoped>
.timezone-settings {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.current-timezone-card,
.timezone-selector-card,
.info-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.dark .current-timezone-card,
.dark .timezone-selector-card,
.dark .info-card {
  background: #374151;
  border-color: #4b5563;
}

.card-header {
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.dark .card-header {
  border-color: #4b5563;
}

.card-content {
  padding: 0 1.5rem 1.5rem;
}

.timezone-info {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.dark .info-item {
  background: #4b5563;
  border-color: #6b7280;
}

.label {
  font-weight: 600;
  color: #374151;
}

.dark .label {
  color: #d1d5db;
}

.value {
  font-family: monospace;
  font-size: 0.9rem;
}

.timezone-name {
  color: #059669;
  font-weight: 600;
}

.dark .timezone-name {
  color: #10b981;
}

.current-datetime {
  color: #2563eb;
}

.dark .current-datetime {
  color: #60a5fa;
}

.utc-offset {
  color: #7c3aed;
}

.dark .utc-offset {
  color: #a78bfa;
}

.timezone-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timezone-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  font-size: 1rem;
  color: #374151;
  transition: border-color 0.2s;
}

.dark .timezone-select {
  background: #4b5563;
  border-color: #6b7280;
  color: #f9fafb;
}

.timezone-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.timezone-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.timezone-preview {
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.dark .timezone-preview {
  background: #1e3a8a;
  border-color: #3b82f6;
}

.preview-title {
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 0.5rem;
}

.dark .preview-title {
  color: #93c5fd;
}

.preview-content p {
  margin: 0.25rem 0;
  color: #0c4a6e;
}

.dark .preview-content p {
  color: #dbeafe;
}

.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
}

.save-button,
.refresh-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.save-button {
  background: #3b82f6;
  color: white;
  border: none;
}

.save-button:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.refresh-button {
  background: #6b7280;
  color: white;
  border: none;
}

.refresh-button:hover:not(:disabled) {
  background: #4b5563;
  transform: translateY(-1px);
}

.info-text {
  color: #6b7280;
}

.dark .info-text {
  color: #9ca3af;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.info-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.dark .info-list li {
  border-color: #4b5563;
}

.info-list li:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .timezone-settings {
    padding: 1rem;
  }
  
  .settings-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .settings-actions {
    flex-direction: column;
  }
  
  .save-button,
  .refresh-button {
    justify-content: center;
  }
}
</style>
