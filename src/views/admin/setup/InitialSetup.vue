<template>
  <div class="initial-setup">
    <div class="setup-container">
      <!-- Header -->
      <div class="setup-header">
        <div class="header-content">
          <div class="header-icon">
            <Settings class="h-12 w-12 text-blue-600" />
          </div>
          <div class="header-text">
            <h1 class="setup-title">Configuración Inicial del Sistema</h1>
            <p class="setup-subtitle">
              Configura tu sistema multi-servicio antes de comenzar
            </p>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <div class="progress-text">
            Paso {{ setupStep }} de {{ setupSteps.length }} - {{ currentStep?.title }}
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="setup-content">
        <!-- Paso 1: Seleccionar Tipo de Sistema -->
        <div v-if="setupStep === 1" class="step-content">
          <div class="step-header">
            <h2 class="step-title">Selecciona el Tipo de Sistema</h2>
            <p class="step-description">
              Elige el tipo de sistema que mejor se adapte a tus necesidades
            </p>
          </div>

          <div class="systems-grid">
            <Card 
              v-for="system in systemTypes" 
              :key="system.id"
              class="system-card"
              :class="{ 'selected': selectedSystem?.id === system.id }"
              @click="selectSystem(system)"
            >
              <div class="system-content">
                <div class="system-icon" :style="{ backgroundColor: system.color }">
                  <component :is="getIcon(system.icon)" class="h-8 w-8 text-white" />
                </div>
                <div class="system-info">
                  <h3 class="system-name">{{ system.name }}</h3>
                  <p class="system-description">{{ system.description }}</p>
                  <div class="system-features">
                    <span 
                      v-for="feature in system.features?.slice(0, 3)" 
                      :key="feature"
                      class="feature-tag"
                    >
                      {{ feature }}
                    </span>
                    <span v-if="system.features?.length > 3" class="more-features">
                      +{{ system.features.length - 3 }} más
                    </span>
                  </div>
                </div>
                <div class="system-status">
                  <div v-if="selectedSystem?.id === system.id" class="selected-indicator">
                    <CheckCircle class="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div class="step-actions">
            <Button 
              @click="nextStep" 
              :disabled="!selectedSystem"
              class="primary-button"
            >
              Continuar
              <ChevronRight class="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <!-- Paso 2: Configurar Módulos -->
        <div v-if="setupStep === 2" class="step-content">
          <div class="step-header">
            <h2 class="step-title">Configuración de Módulos</h2>
            <p class="step-description">
              Selecciona los módulos que estarán disponibles en tu sistema
            </p>
          </div>

          <div class="modules-config">
            <div class="selected-system-info">
              <div class="system-preview">
                <div class="system-icon" :style="{ backgroundColor: selectedSystem?.color }">
                  <component :is="getIcon(selectedSystem?.icon)" class="h-6 w-6 text-white" />
                </div>
                <div class="system-details">
                  <h3>{{ selectedSystem?.name }}</h3>
                  <p>{{ selectedSystem?.description }}</p>
                </div>
              </div>
            </div>

            <div class="modules-list">
              <h3 class="modules-title">Módulos Disponibles</h3>
              <div class="modules-grid">
                <div 
                  v-for="module in availableModules" 
                  :key="module.id"
                  class="module-item"
                >
                  <div class="module-content">
                    <div class="module-checkbox">
                      <input 
                        type="checkbox" 
                        :id="`module-${module.id}`"
                        v-model="selectedModules"
                        :value="module.id"
                        class="checkbox-input"
                      />
                      <label :for="`module-${module.id}`" class="checkbox-label">
                        <div class="module-icon" :style="{ backgroundColor: module.color }">
                          <component :is="getIcon(module.icon)" class="h-5 w-5 text-white" />
                        </div>
                        <div class="module-info">
                          <h4 class="module-name">{{ module.name }}</h4>
                          <p class="module-description">{{ module.description }}</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <Button @click="prevStep" variant="outline" class="secondary-button">
              <ChevronLeft class="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button 
              @click="nextStep" 
              :disabled="selectedModules.length === 0"
              class="primary-button"
            >
              Continuar
              <ChevronRight class="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <!-- Paso 3: Configuración Inicial -->
        <div v-if="setupStep === 3" class="step-content">
          <div class="step-header">
            <h2 class="step-title">Configuración Inicial</h2>
            <p class="step-description">
              Establece la configuración básica de tu sistema
            </p>
          </div>

          <div class="config-form">
            <div class="form-section">
              <h3 class="section-title">Información del Sistema</h3>
              <div class="form-grid">
                <div class="form-group">
                  <Label for="system-name">Nombre del Sistema</Label>
                  <Input 
                    id="system-name"
                    v-model="systemConfig.name" 
                    placeholder="Ej: Mi Clínica Dental"
                  />
                </div>
                <div class="form-group">
                  <Label for="system-description">Descripción</Label>
                  <Input 
                    id="system-description"
                    v-model="systemConfig.description" 
                    placeholder="Descripción breve del sistema"
                  />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Configuración de Acceso</h3>
              <div class="form-grid">
                <div class="form-group">
                  <Label for="admin-email">Email del Administrador</Label>
                  <Input 
                    id="admin-email"
                    v-model="systemConfig.adminEmail" 
                    type="email"
                    placeholder="admin@ejemplo.com"
                  />
                </div>
                <div class="form-group">
                  <Label for="admin-password">Contraseña del Administrador</Label>
                  <Input 
                    id="admin-password"
                    v-model="systemConfig.adminPassword" 
                    type="password"
                    placeholder="Contraseña segura"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <Button @click="prevStep" variant="outline" class="secondary-button">
              <ChevronLeft class="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button 
              @click="nextStep" 
              :disabled="!systemConfig.name || !systemConfig.adminEmail"
              class="primary-button"
            >
              Continuar
              <ChevronRight class="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <!-- Paso 4: Completar Setup -->
        <div v-if="setupStep === 4" class="step-content">
          <div class="step-header">
            <h2 class="step-title">¡Configuración Completada!</h2>
            <p class="step-description">
              Tu sistema está listo para usar
            </p>
          </div>

          <div class="completion-summary">
            <div class="summary-card">
              <div class="summary-header">
                <div class="system-icon" :style="{ backgroundColor: selectedSystem?.color }">
                  <component :is="getIcon(selectedSystem?.icon)" class="h-8 w-8 text-white" />
                </div>
                <div class="summary-info">
                  <h3>{{ selectedSystem?.name }}</h3>
                  <p>{{ selectedSystem?.description }}</p>
                </div>
              </div>
              
              <div class="summary-details">
                <div class="detail-item">
                  <span class="detail-label">Módulos activos:</span>
                  <span class="detail-value">{{ selectedModules.length }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Administrador:</span>
                  <span class="detail-value">{{ systemConfig.adminEmail }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Estado:</span>
                  <span class="detail-value status-active">Activo</span>
                </div>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <Button @click="completeSetup" class="primary-button" :disabled="loading">
              <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
              Finalizar Configuración
              <CheckCircle class="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInitialSetup } from '@/composables/useInitialSetup'
import { useToast } from '@/composables/useToast'
import { API_CONFIG } from '@/config/api'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Loader2,
  LayoutDashboard,
  Stethoscope,
  Heart,
  Building2,
  FileText,
  ShoppingCart,
  Scale
} from 'lucide-vue-next'

const router = useRouter()
const { success, error: showError } = useToast()
const { 
  setupStep, 
  setupSteps, 
  selectedSystemType, 
  progressPercentage, 
  currentStep,
  completeInitialSetup 
} = useInitialSetup()

// Estado local
const systemTypes = ref([])
const selectedSystem = ref(null)
const selectedModules = ref([])
const availableModules = ref([])
const loading = ref(false)

// Configuración del sistema
const systemConfig = reactive({
  name: '',
  description: '',
  adminEmail: '',
  adminPassword: ''
})

// Iconos disponibles
const iconMap = {
  LayoutDashboard,
  Stethoscope,
  Heart,
  Building2,
  FileText,
  ShoppingCart,
  Scale
}

// Métodos
const getIcon = (iconName: string) => {
  return iconMap[iconName] || LayoutDashboard
}

const loadSystemTypes = async () => {
  try {
    const response = await fetch(`${API_CONFIG.URL_BASE}/admin/system-types-active`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.error(`Error ${response.status}: ${response.statusText}`)
      throw new Error(`Error al cargar tipos de sistema: ${response.status}`)
    }
    
    const responseText = await response.text()
    
    if (!responseText || responseText.trim() === '') {
      console.log('Respuesta vacía de la API')
      throw new Error('Respuesta vacía del servidor')
    }
    
    try {
      const data = JSON.parse(responseText)
      systemTypes.value = data.data || []
    } catch (parseError) {
      console.error('Error parseando respuesta JSON:', parseError)
      console.log('Respuesta recibida:', responseText)
      throw new Error('Error procesando respuesta del servidor')
    }
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'No se pudieron cargar los tipos de sistema')
  }
}

const loadModulesForSystem = async (systemTypeId: number) => {
  try {
    const response = await fetch(`${API_CONFIG.URL_BASE}/admin/system-modules/by-system-type/${systemTypeId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.error(`Error ${response.status}: ${response.statusText}`)
      throw new Error(`Error al cargar módulos: ${response.status}`)
    }
    
    const responseText = await response.text()
    
    if (!responseText || responseText.trim() === '') {
      console.log('Respuesta vacía de la API para módulos')
      availableModules.value = []
      return
    }
    
    try {
      const data = JSON.parse(responseText)
      availableModules.value = data.data || []
      console.log('Módulos cargados:', availableModules.value)
    } catch (parseError) {
      console.error('Error parseando respuesta JSON de módulos:', parseError)
      console.log('Respuesta recibida:', responseText)
      availableModules.value = []
    }
  } catch (error) {
    console.error('Error cargando módulos:', error)
    availableModules.value = []
  }
}

const selectSystem = async (system: any) => {
  selectedSystem.value = system
  selectedSystemType.value = system
  
  // Cargar módulos del sistema seleccionado
  await loadModulesForSystem(system.id)
}

const nextStep = () => {
  if (setupStep.value < setupSteps.length) {
    setupStep.value++
  }
}

const prevStep = () => {
  if (setupStep.value > 1) {
    setupStep.value--
  }
}

const completeSetup = async () => {
  try {
    loading.value = true
    
    const result = await completeInitialSetup(selectedSystem.value)
    
    if (result.success) {
      success('Configuración completada', 'El sistema está listo para usar')
      router.push('/app/dashboard')
    } else {
      showError('Error', 'No se pudo completar la configuración')
    }
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'Error inesperado al completar la configuración')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadSystemTypes()
  setupStep.value = 1
})
</script>

<style scoped>
.initial-setup {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.setup-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  width: 100%;
  overflow: hidden;
}

.setup-header {
  background: #f8fafc;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: #dbeafe;
  border-radius: 1rem;
}

.setup-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.setup-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.progress-container {
  space-y: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: #e2e8f0;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
  margin-top: 0.5rem;
}

.setup-content {
  padding: 2rem;
}

.step-content {
  space-y: 2rem;
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.step-description {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.systems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.system-card {
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.system-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.system-card.selected {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.system-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.system-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.system-info {
  flex: 1;
}

.system-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.system-description {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.system-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.feature-tag {
  padding: 0.125rem 0.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #475569;
}

.more-features {
  padding: 0.125rem 0.5rem;
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #3730a3;
}

.system-status {
  flex-shrink: 0;
}

.selected-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.primary-button {
  background: #3b82f6;
  color: white;
  border: none;
}

.primary-button:hover {
  background: #2563eb;
}

.secondary-button {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.secondary-button:hover {
  background: #f9fafb;
}

.modules-config {
  space-y: 2rem;
}

.selected-system-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.system-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.system-details h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.system-details p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.modules-list {
  space-y: 1rem;
}

.modules-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.module-item {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.module-content {
  space-y: 0.5rem;
}

.module-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

.module-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.module-info {
  flex: 1;
}

.module-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.module-description {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

.config-form {
  space-y: 2rem;
}

.form-section {
  space-y: 1rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.completion-summary {
  space-y: 1rem;
}

.summary-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.summary-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.summary-info p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.summary-details {
  space-y: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 0.875rem;
  color: #64748b;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
}

.status-active {
  color: #10b981;
}

/* Responsive */
@media (max-width: 768px) {
  .initial-setup {
    padding: 1rem;
  }
  
  .setup-container {
    border-radius: 0.5rem;
  }
  
  .setup-header {
    padding: 1.5rem;
  }
  
  .setup-content {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .systems-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .step-actions {
    flex-direction: column;
  }
}
</style>
