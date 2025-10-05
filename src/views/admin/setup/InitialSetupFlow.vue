<template>
  <div class="initial-setup-flow">
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
              Configura tu sistema multi-servicio paso a paso
            </p>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            ></div>
          </div>
          <div class="progress-text">
            Paso {{ currentStep }} de {{ totalSteps }} - {{ getStepTitle(currentStep) }}
          </div>
          
          <!-- Step Indicators -->
          <div class="step-indicators">
            <div 
              v-for="step in totalSteps" 
              :key="step"
              :class="['step-indicator', { 
                'completed': step < currentStep, 
                'current': step === currentStep,
                'pending': step > currentStep
              }]"
            >
              <div class="step-number">
                <CheckCircle v-if="step < currentStep" class="h-4 w-4" />
                <span v-else>{{ step }}</span>
              </div>
              <div class="step-label">{{ getStepTitle(step) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="setup-content">
        <!-- Paso 1: Seleccionar Tipo de Sistema -->
        <div v-if="currentStep === 1" class="step-content">
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
              @mouseenter="showSystemInfo(system)"
              @mouseleave="hideSystemInfo"
            >
              <div class="system-content">
                <div class="system-icon" :style="{ backgroundColor: system.color }">
                  <component :is="getIcon(system.icon)" class="h-8 w-8 text-white" />
                </div>
                <div class="system-info">
                  <h3 class="system-name">{{ system.name }}</h3>
                  <p class="system-description">{{ system.description }}</p>
                </div>
                <div class="system-status">
                  <div v-if="selectedSystem?.id === system.id" class="selected-indicator">
                    <CheckCircle class="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- System Info Popup -->
          <div 
            v-if="hoveredSystem" 
            class="system-popup"
            :style="popupPosition"
          >
            <div class="popup-header">
              <div class="popup-icon" :style="{ backgroundColor: hoveredSystem.color }">
                <component :is="getIcon(hoveredSystem.icon)" class="h-6 w-6 text-white" />
              </div>
              <h3 class="popup-title">{{ hoveredSystem.name }}</h3>
            </div>
            <div class="popup-content">
              <p class="popup-description">{{ hoveredSystem.description }}</p>
              <div class="popup-features">
                <h4>Características:</h4>
                <ul>
                  <li v-for="feature in hoveredSystem.features" :key="feature">
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <div class="popup-tables">
                <h4>Tablas requeridas:</h4>
                <ul>
                  <li v-for="table in hoveredSystem.required_tables" :key="table">
                    {{ table }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Paso 2: Seleccionar Módulos -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="step-header">
            <h2 class="step-title">Selecciona los Módulos</h2>
            <p class="step-description">
              Elige los módulos que deseas habilitar para {{ selectedSystem?.name }}
            </p>
          </div>

          <div class="modules-grid">
            <Card 
              v-for="module in availableModules" 
              :key="module.id"
              class="module-card"
              :class="{ 'selected': selectedModules[module.id] }"
              @click="toggleModule(module.id)"
            >
              <div class="module-content">
                <div class="module-icon" :style="{ backgroundColor: module.color }">
                  <component :is="getIcon(module.icon)" class="h-6 w-6 text-white" />
                </div>
                <div class="module-info">
                  <h3 class="module-name">{{ module.name }}</h3>
                  <p class="module-description">{{ module.description }}</p>
                  <div class="module-badges">
                    <span v-if="module.is_required" class="badge required">Requerido</span>
                    <span v-if="module.is_active" class="badge active">Activo</span>
                  </div>
                </div>
                <div class="module-status">
                  <div v-if="selectedModules[module.id]" class="selected-indicator">
                    <CheckCircle class="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <!-- Paso 3: Datos del Administrador -->
        <div v-if="currentStep === 3" class="step-content">
          <div class="step-header">
            <h2 class="step-title">Datos del Administrador</h2>
            <p class="step-description">
              Configura la cuenta de administrador del sistema
            </p>
          </div>

          <div class="admin-form">
            <div class="form-group">
              <Label for="admin-name">Nombre completo</Label>
              <Input 
                id="admin-name"
                v-model="adminData.name"
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>

            <div class="form-group">
              <Label for="admin-email">Correo electrónico</Label>
              <Input 
                id="admin-email"
                v-model="adminData.email"
                type="email"
                placeholder="admin@empresa.com"
                required
              />
            </div>

            <div class="form-group">
              <Label for="admin-password">Contraseña</Label>
              <Input 
                id="admin-password"
                v-model="adminData.password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>

            <div class="form-group">
              <Label for="admin-confirm-password">Confirmar contraseña</Label>
              <Input 
                id="admin-confirm-password"
                v-model="adminData.confirmPassword"
                type="password"
                placeholder="Repite la contraseña"
                required
              />
            </div>
          </div>
        </div>

        <!-- Paso 4: Resumen y Confirmación -->
        <div v-if="currentStep === 4" class="step-content">
          <div class="step-header">
            <h2 class="step-title">Resumen de Configuración</h2>
            <p class="step-description">
              Revisa la configuración antes de continuar
            </p>
          </div>

          <div class="summary-content">
            <div class="summary-section">
              <h3>Sistema Seleccionado</h3>
              <div class="summary-item">
                <div class="summary-icon" :style="{ backgroundColor: selectedSystem?.color }">
                  <component :is="getIcon(selectedSystem?.icon)" class="h-6 w-6 text-white" />
                </div>
                <div class="summary-text">
                  <h4>{{ selectedSystem?.name }}</h4>
                  <p>{{ selectedSystem?.description }}</p>
                </div>
              </div>
            </div>

            <div class="summary-section">
              <h3>Módulos Seleccionados</h3>
              <div class="modules-summary">
                <div 
                  v-for="moduleId in Object.keys(selectedModules).filter(id => selectedModules[id])" 
                  :key="moduleId"
                  class="module-summary-item"
                >
                  <component 
                    :is="getIcon(availableModules.find(m => m.id == moduleId)?.icon)" 
                    class="h-4 w-4"
                  />
                  <span>{{ availableModules.find(m => m.id == moduleId)?.name }}</span>
                </div>
              </div>
            </div>

            <div class="summary-section">
              <h3>Administrador</h3>
              <div class="admin-summary">
                <p><strong>Nombre:</strong> {{ adminData.name }}</p>
                <p><strong>Email:</strong> {{ adminData.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="setup-navigation">
        <Button 
          v-if="currentStep > 1"
          @click="previousStep"
          variant="outline"
        >
          <ChevronLeft class="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <Button 
          v-if="currentStep < totalSteps"
          @click="nextStep"
          :disabled="!canProceed"
          class="primary-button"
        >
          Siguiente
          <ChevronRight class="h-4 w-4 ml-2" />
        </Button>

        <Button 
          v-if="currentStep === totalSteps"
          @click="completeSetup"
          :disabled="!canProceed"
          :loading="loading"
          class="primary-button"
        >
          <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
          Completar Configuración
          <CheckCircle class="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useInitialSetup } from '@/composables/useInitialSetup'
import { API_CONFIG } from '@/config/api'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { 
  Settings, 
  CheckCircle, 
  Loader2,
  ChevronLeft,
  ChevronRight,
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

// Estado del setup
const currentStep = ref(1)
const totalSteps = 4
const loading = ref(false)

// Datos del sistema
const systemTypes = ref([
  {
    id: 1,
    name: 'Sistema por Defecto',
    slug: 'default',
    description: 'Sistema básico con funcionalidades generales',
    features: ['Dashboard', 'Usuarios', 'Configuraciones', 'Reportes'],
    required_tables: ['users', 'settings', 'logs'],
    color: '#3b82f6',
    icon: 'LayoutDashboard'
  },
  {
    id: 2,
    name: 'Clínica Dental',
    slug: 'dental-clinic',
    description: 'Sistema especializado para clínicas dentales',
    features: ['Pacientes', 'Citas', 'Tratamientos', 'Historial', 'Facturación'],
    required_tables: ['patients', 'appointments', 'treatments', 'medical_records'],
    color: '#10b981',
    icon: 'Stethoscope'
  },
  {
    id: 3,
    name: 'Clínica Médica',
    slug: 'medical-clinic',
    description: 'Sistema para clínicas médicas generales',
    features: ['Pacientes', 'Citas', 'Consultas', 'Recetas', 'Exámenes'],
    required_tables: ['patients', 'appointments', 'consultations', 'prescriptions'],
    color: '#ef4444',
    icon: 'Heart'
  },
  {
    id: 4,
    name: 'Hospital',
    slug: 'hospital',
    description: 'Sistema completo para hospitales',
    features: ['Pacientes', 'Admisiones', 'Quirófanos', 'Inventario', 'Personal'],
    required_tables: ['patients', 'admissions', 'operating_rooms', 'inventory', 'staff'],
    color: '#f59e0b',
    icon: 'Building2'
  },
  {
    id: 5,
    name: 'Servicio de Cotizaciones',
    slug: 'quotations',
    description: 'Sistema para gestión de cotizaciones',
    features: ['Cotizaciones', 'Clientes', 'Productos', 'Proyectos'],
    required_tables: ['quotations', 'clients', 'products', 'projects'],
    color: '#8b5cf6',
    icon: 'FileText'
  },
  {
    id: 6,
    name: 'Servicio de Ventas',
    slug: 'sales',
    description: 'Sistema de gestión de ventas',
    features: ['Ventas', 'Clientes', 'Productos', 'Inventario', 'Comisiones'],
    required_tables: ['sales', 'customers', 'products', 'inventory'],
    color: '#06b6d4',
    icon: 'ShoppingCart'
  },
  {
    id: 7,
    name: 'Firma de Abogados',
    slug: 'law-firm',
    description: 'Sistema para firmas legales',
    features: ['Clientes', 'Casos', 'Documentos', 'Citas', 'Facturación'],
    required_tables: ['clients', 'cases', 'documents', 'appointments'],
    color: '#84cc16',
    icon: 'Scale'
  }
])

const selectedSystem = ref(null)
const availableModules = ref([])
const selectedModules = reactive({})
const hoveredSystem = ref(null)
const popupPosition = ref({})

// Datos del administrador
const adminData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
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

// Computed
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedSystem.value !== null
    case 2:
      return Object.values(selectedModules).some(Boolean)
    case 3:
      return adminData.name && adminData.email && adminData.password && 
             adminData.password === adminData.confirmPassword && 
             adminData.password.length >= 8
    case 4:
      return true
    default:
      return false
  }
})

// Métodos
const getIcon = (iconName: string) => {
  return iconMap[iconName] || LayoutDashboard
}

const getStepTitle = (step: number) => {
  const titles = {
    1: 'Seleccionar Sistema',
    2: 'Configurar Módulos', 
    3: 'Datos del Admin',
    4: 'Confirmar Configuración'
  }
  return titles[step] || `Paso ${step}`
}

const loadSystemTypes = async () => {
  try {
    console.log('📡 Cargando tipos de sistema...')
    const response = await fetch(`${API_CONFIG.URL_BASE}/system-types/public`, {
      method: 'GET',
      headers: {
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
      console.log('✅ Tipos de sistema cargados:', systemTypes.value.length)
    } catch (parseError) {
      console.error('Error parseando respuesta JSON:', parseError)
      console.log('Respuesta recibida:', responseText)
      throw new Error('Error procesando respuesta del servidor')
    }
  } catch (error) {
    console.error('Error cargando tipos de sistema:', error)
    showError('Error', 'No se pudieron cargar los tipos de sistema')
  }
}

const selectSystem = (system: any) => {
  selectedSystem.value = system
  // Cargar módulos para el sistema seleccionado
  loadModulesForSystem(system.id)
}

const loadModulesForSystem = async (systemTypeId: number) => {
  try {
    console.log('📡 Cargando módulos para sistema:', systemTypeId)
    const response = await fetch(`${API_CONFIG.URL_BASE}/system-modules/public/${systemTypeId}`, {
      method: 'GET',
      headers: {
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
      console.log('✅ Módulos cargados:', availableModules.value.length)
      
      // Seleccionar módulos requeridos por defecto
      availableModules.value.forEach((module: any) => {
        if (module.is_required) {
          selectedModules[module.id] = true
        }
      })
    } catch (parseError) {
      console.error('Error parseando respuesta JSON de módulos:', parseError)
      console.log('Respuesta recibida:', responseText)
      availableModules.value = []
    }
  } catch (error) {
    console.error('Error cargando módulos:', error)
    showError('Error', 'No se pudieron cargar los módulos')
  }
}

const toggleModule = (moduleId: number) => {
  selectedModules[moduleId] = !selectedModules[moduleId]
}

const showSystemInfo = (system: any) => {
  hoveredSystem.value = system
  // Calcular posición del popup (simplificado)
  popupPosition.value = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

const hideSystemInfo = () => {
  hoveredSystem.value = null
}

const nextStep = () => {
  if (canProceed.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const completeSetup = async () => {
  try {
    loading.value = true
    
    // Preparar datos para enviar a la API
    const setupData = {
      systemType: selectedSystem.value,
      modules: Object.keys(selectedModules).filter(id => selectedModules[id]),
      adminData: adminData
    }
    
    // Usar el composable para completar la configuración
    const { completeInitialSetup } = useInitialSetup()
    const result = await completeInitialSetup(setupData)
    
    if (result.success) {
      success('Configuración completada', 'Redirigiendo al panel de administración...')
      
      // Redirigir directamente al panel de administración
      setTimeout(() => {
        router.push('/admin-setup')
      }, 2000)
    } else {
      throw new Error(result.message || 'Error al completar la configuración')
    }
    
  } catch (error) {
    console.error('Error:', error)
    showError('Error', error.message || 'Error inesperado al completar la configuración')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🎯 InitialSetupFlow montado correctamente')
  console.log('📊 Estado inicial:', { currentStep: currentStep.value, totalSteps: totalSteps.value })
  
  console.log('✅ Iniciando configuración desde cero')
  await loadSystemTypes()
})
</script>

<style scoped>
.initial-setup-flow {
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
  max-width: 1200px;
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
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding: 0 1rem;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step-indicator:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 1rem;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.step-indicator.completed:not(:last-child)::after {
  background: #10b981;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
  z-index: 2;
  position: relative;
}

.step-indicator.completed .step-number {
  background: #10b981;
  color: white;
}

.step-indicator.current .step-number {
  background: #3b82f6;
  color: white;
}

.step-label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  text-align: center;
  font-weight: 500;
}

.step-indicator.completed .step-label {
  color: #10b981;
  font-weight: 600;
}

.step-indicator.current .step-label {
  color: #3b82f6;
  font-weight: 600;
}

.setup-content {
  padding: 2rem;
  min-height: 400px;
}

.step-content {
  position: relative;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.system-card {
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.system-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
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
  margin: 0;
}

.system-status {
  flex-shrink: 0;
}

.selected-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.system-popup {
  position: fixed;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-width: 400px;
  z-index: 1000;
  border: 1px solid #e2e8f0;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.popup-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
}

.popup-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.popup-content {
  space-y: 1rem;
}

.popup-description {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
}

.popup-features h4,
.popup-tables h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.popup-features ul,
.popup-tables ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.popup-features li,
.popup-tables li {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.25rem 0;
  border-left: 2px solid #e5e7eb;
  padding-left: 0.5rem;
  margin-bottom: 0.25rem;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.module-card {
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-card:hover {
  border-color: #10b981;
  transform: translateY(-1px);
}

.module-card.selected {
  border-color: #10b981;
  background: #f0fdf4;
}

.module-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.module-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.module-info {
  flex: 1;
}

.module-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.module-description {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.module-badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.required {
  background: #fef3c7;
  color: #92400e;
}

.badge.active {
  background: #d1fae5;
  color: #065f46;
}

.module-status {
  flex-shrink: 0;
}

.admin-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.summary-content {
  max-width: 800px;
  margin: 0 auto;
}

.summary-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.summary-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.summary-text h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.summary-text p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.modules-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.module-summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #374151;
}

.admin-summary p {
  margin: 0.5rem 0;
  color: #374151;
}

.setup-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.primary-button {
  background: #3b82f6;
  color: white;
  border: none;
}

.primary-button:hover {
  background: #2563eb;
}

/* Responsive */
@media (max-width: 768px) {
  .initial-setup-flow {
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
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .setup-navigation {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
