<template>
  <div class="initial-setup-simple">
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
      </div>

      <!-- Step Content -->
      <div class="setup-content">
        <!-- Paso 1: Seleccionar Tipo de Sistema -->
        <div class="step-content">
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
              @click="completeSetup" 
              :disabled="!selectedSystem"
              class="primary-button"
            >
              <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
              Configurar Sistema
              <CheckCircle class="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { 
  Settings, 
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

// Estado local
const systemTypes = ref([
  {
    id: 1,
    name: 'Sistema por Defecto',
    slug: 'default',
    description: 'Sistema básico con funcionalidades generales',
    features: ['Dashboard', 'Usuarios', 'Configuraciones'],
    color: '#3b82f6',
    icon: 'LayoutDashboard'
  },
  {
    id: 2,
    name: 'Clínica Dental',
    slug: 'dental-clinic',
    description: 'Sistema especializado para clínicas dentales',
    features: ['Pacientes', 'Citas', 'Tratamientos', 'Historial'],
    color: '#10b981',
    icon: 'Stethoscope'
  },
  {
    id: 3,
    name: 'Clínica Médica',
    slug: 'medical-clinic',
    description: 'Sistema para clínicas médicas generales',
    features: ['Pacientes', 'Citas', 'Consultas', 'Recetas'],
    color: '#ef4444',
    icon: 'Heart'
  },
  {
    id: 4,
    name: 'Hospital',
    slug: 'hospital',
    description: 'Sistema completo para hospitales',
    features: ['Pacientes', 'Admisiones', 'Quirófanos', 'Inventario'],
    color: '#f59e0b',
    icon: 'Building2'
  },
  {
    id: 5,
    name: 'Servicio de Cotizaciones',
    slug: 'quotations',
    description: 'Sistema para gestión de cotizaciones',
    features: ['Cotizaciones', 'Clientes', 'Productos'],
    color: '#8b5cf6',
    icon: 'FileText'
  },
  {
    id: 6,
    name: 'Servicio de Ventas',
    slug: 'sales',
    description: 'Sistema de gestión de ventas',
    features: ['Ventas', 'Clientes', 'Productos', 'Inventario'],
    color: '#06b6d4',
    icon: 'ShoppingCart'
  },
  {
    id: 7,
    name: 'Firma de Abogados',
    slug: 'law-firm',
    description: 'Sistema para firmas legales',
    features: ['Clientes', 'Casos', 'Documentos', 'Citas'],
    color: '#84cc16',
    icon: 'Scale'
  }
])

const selectedSystem = ref(null)
const loading = ref(false)

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

const selectSystem = (system: any) => {
  selectedSystem.value = system
}

const completeSetup = async () => {
  try {
    loading.value = true
    
    // Simular configuración (en una implementación real, esto se guardaría en la BD)
    localStorage.setItem('systemType', JSON.stringify(selectedSystem.value))
    localStorage.setItem('initialSetupCompleted', 'true')
    
    success('Configuración completada', 'El sistema está listo para usar')
    
    // Redirigir al login
    router.push('/')
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'Error inesperado al completar la configuración')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Cargar tipos de sistema estáticos
})
</script>

<style scoped>
.initial-setup-simple {
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

/* Responsive */
@media (max-width: 768px) {
  .initial-setup-simple {
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
}
</style>
