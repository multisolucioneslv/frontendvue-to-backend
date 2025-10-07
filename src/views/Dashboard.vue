<template>
  <div class="dashboard-container">
    <!-- Header con saludo personalizado -->
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1 class="welcome-title">
          ¡Bienvenido de vuelta, {{ userName }}! 👋
        </h1>
        <p class="welcome-subtitle">
          Aquí tienes un resumen de tu negocio hoy
        </p>
      </div>
      <div class="date-section">
        <div class="current-date">{{ currentDate }}</div>
        <div class="current-time">{{ currentTime }}</div>
      </div>
    </div>

    <!-- Stats Cards con efectos espectaculares -->
    <div class="stats-grid">
      <!-- Productos Card -->
      <div class="stat-card productos-card" :class="{ 'loading': loading.productos }">
        <div class="card-background">
          <div class="gradient-overlay"></div>
          <div class="pattern-overlay"></div>
        </div>
        
        <div class="card-content">
          <div class="card-header">
            <div class="icon-container">
              <Package class="card-icon" />
              <div class="icon-glow"></div>
            </div>
            <div class="trend-indicator" v-if="!loading.productos">
              <TrendingUp class="trend-icon" />
              <span class="trend-text">+12%</span>
            </div>
          </div>
          
          <div class="card-body">
            <h3 class="card-title">Productos</h3>
            <div class="number-container">
              <div v-if="loading.productos" class="skeleton-number">
                <div class="skeleton-bar"></div>
              </div>
              <div v-else class="animated-number">
                <CountUp :end="stats.productos" :duration="2" />
              </div>
            </div>
            <p class="card-subtitle">Total en inventario</p>
          </div>
          
          <div class="card-footer">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: '75%' }"></div>
            </div>
            <router-link to="/app/productos" class="card-link">
              <span>Ver productos</span>
              <ArrowRight class="link-icon" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Customers Card -->
      <div class="stat-card customers-card" :class="{ 'loading': loading.customers }">
        <div class="card-background">
          <div class="gradient-overlay"></div>
          <div class="pattern-overlay"></div>
        </div>
        
        <div class="card-content">
          <div class="card-header">
            <div class="icon-container">
              <Users class="card-icon" />
              <div class="icon-glow"></div>
            </div>
            <div class="trend-indicator" v-if="!loading.customers">
              <TrendingUp class="trend-icon" />
              <span class="trend-text">+8%</span>
            </div>
          </div>
          
          <div class="card-body">
            <h3 class="card-title">Clientes</h3>
            <div class="number-container">
              <div v-if="loading.customers" class="skeleton-number">
                <div class="skeleton-bar"></div>
              </div>
              <div v-else class="animated-number">
                <CountUp :end="stats.customers" :duration="2" />
              </div>
            </div>
            <p class="card-subtitle">Clientes registrados</p>
          </div>
          
          <div class="card-footer">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: '60%' }"></div>
            </div>
            <router-link to="/app/customers" class="card-link">
              <span>Ver clientes</span>
              <ArrowRight class="link-icon" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Sucursales Card -->
      <div class="stat-card sucursales-card" :class="{ 'loading': loading.sucursales }">
        <div class="card-background">
          <div class="gradient-overlay"></div>
          <div class="pattern-overlay"></div>
        </div>
        
        <div class="card-content">
          <div class="card-header">
            <div class="icon-container">
              <Building2 class="card-icon" />
              <div class="icon-glow"></div>
            </div>
            <div class="trend-indicator" v-if="!loading.sucursales">
              <TrendingUp class="trend-icon" />
              <span class="trend-text">+3%</span>
            </div>
          </div>
          
          <div class="card-body">
            <h3 class="card-title">Sucursales</h3>
            <div class="number-container">
              <div v-if="loading.sucursales" class="skeleton-number">
                <div class="skeleton-bar"></div>
              </div>
              <div v-else class="animated-number">
                <CountUp :end="stats.sucursales" :duration="2" />
              </div>
            </div>
            <p class="card-subtitle">Puntos de venta</p>
          </div>
          
          <div class="card-footer">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: '40%' }"></div>
            </div>
            <router-link to="/app/sucursales" class="card-link">
              <span>Ver sucursales</span>
              <ArrowRight class="link-icon" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Categories Card -->
      <div class="stat-card categories-card" :class="{ 'loading': loading.categories }">
        <div class="card-background">
          <div class="gradient-overlay"></div>
          <div class="pattern-overlay"></div>
        </div>
        
        <div class="card-content">
          <div class="card-header">
            <div class="icon-container">
              <FolderOpen class="card-icon" />
              <div class="icon-glow"></div>
            </div>
            <div class="trend-indicator" v-if="!loading.categories">
              <TrendingUp class="trend-icon" />
              <span class="trend-text">+5%</span>
            </div>
          </div>
          
          <div class="card-body">
            <h3 class="card-title">Categorías</h3>
            <div class="number-container">
              <div v-if="loading.categories" class="skeleton-number">
                <div class="skeleton-bar"></div>
              </div>
              <div v-else class="animated-number">
                <CountUp :end="stats.categories" :duration="2" />
              </div>
            </div>
            <p class="card-subtitle">Categorías disponibles</p>
          </div>
          
          <div class="card-footer">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: '85%' }"></div>
            </div>
            <router-link to="/app/categories" class="card-link">
              <span>Ver categorías</span>
              <ArrowRight class="link-icon" />
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2 class="section-title">Acciones Rápidas</h2>
      <div class="actions-grid">
        <router-link to="/app/productos" class="action-card">
          <div class="action-icon">
            <Plus class="icon" />
          </div>
          <div class="action-content">
            <h3>Nuevo Producto</h3>
            <p>Agregar un nuevo producto al inventario</p>
          </div>
          <ArrowRight class="action-arrow" />
        </router-link>

        <router-link to="/app/customers" class="action-card">
          <div class="action-icon">
            <UserPlus class="icon" />
          </div>
          <div class="action-content">
            <h3>Nuevo Cliente</h3>
            <p>Registrar un nuevo cliente</p>
          </div>
          <ArrowRight class="action-arrow" />
        </router-link>

        <router-link to="/app/sucursales" class="action-card">
          <div class="action-icon">
            <Building class="icon" />
          </div>
          <div class="action-content">
            <h3>Nueva Sucursal</h3>
            <p>Agregar una nueva sucursal</p>
          </div>
          <ArrowRight class="action-arrow" />
        </router-link>

        <router-link to="/app/categories" class="action-card">
          <div class="action-icon">
            <FolderPlus class="icon" />
          </div>
          <div class="action-content">
            <h3>Nueva Categoría</h3>
            <p>Crear una nueva categoría de productos</p>
          </div>
          <ArrowRight class="action-arrow" />
        </router-link>
      </div>
    </div>

    <!-- Admin Section -->
    <div v-if="isSuperAdmin || isAdmin" class="admin-section">
      <h2 class="section-title">Administración del Sistema</h2>
      <div class="admin-actions">
        <template v-if="isSuperAdmin">
          <router-link to="/admin-setup" class="admin-button superadmin-button">
            <Settings class="button-icon" />
            <span>Panel SuperAdmin</span>
          </router-link>
          <button @click="resetInitialSetup" class="admin-button reset-button">
            <RotateCcw class="button-icon" />
            <span v-if="!isSetupCompleted">Completar Configuración Inicial</span>
            <span v-else>Resetear Configuración Inicial</span>
          </button>
        </template>
        <template v-else-if="isAdmin">
          <router-link to="/admin-panel" class="admin-button admin-panel-button">
            <Settings class="button-icon" />
            <span>Panel Admin</span>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import axios from '@/config/axios'
import { API_ENDPOINTS } from '@/config/api'
import CountUp from '@/components/ui/CountUp.vue'
import { 
  Package, 
  Users, 
  Building2, 
  FolderOpen, 
  TrendingUp,
  Plus,
  UserPlus,
  Building,
  FolderPlus,
  ArrowRight,
  RotateCcw,
  Settings  // CORREGIDO: Agregado el import faltante de Settings
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

// Estado reactivo
const stats = ref({
  productos: 0,
  customers: 0,
  sucursales: 0,
  categories: 0
})

const loading = ref({
  productos: true,
  customers: true,
  sucursales: true,
  categories: true
})

const currentDate = ref('')
const currentTime = ref('')

// Computed properties
const userName = computed(() => {
  const user = authStore.user
  if (!user) return 'Usuario'
  return user.name || user.username || 'Usuario'
})

const isSuperAdmin = computed(() => {
  const user = authStore.user
  return user?.roles?.includes('SuperAdmin') || false
})

const isAdmin = computed(() => {
  const user = authStore.user
  return user?.roles?.includes('Admin') || user?.roles?.includes('SuperAdmin') || false
})

// TEMPORALMENTE DESHABILITADO: isSetupCompleted
// const isSetupCompleted = computed(() => {
//   // Implementar lógica de verificación de setup si es necesario
//   return true
// })

// Funciones
const updateDateTime = () => {
  const now = new Date()
  
  // Formatear fecha
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  currentDate.value = now.toLocaleDateString('es-ES', options)
  
  // Formatear hora
  currentTime.value = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const loadStats = async () => {
  try {
    // Simular carga de estadísticas con delays
    setTimeout(() => {
      stats.value.productos = 156
      loading.value.productos = false
    }, 500)

    setTimeout(() => {
      stats.value.customers = 89
      loading.value.customers = false
    }, 800)

    setTimeout(() => {
      stats.value.sucursales = 4
      loading.value.sucursales = false
    }, 1200)

    setTimeout(() => {
      stats.value.categories = 23
      loading.value.categories = false
    }, 1500)

  } catch (error) {
    console.error('Error cargando estadísticas:', error)
    showToast('Error al cargar las estadísticas', 'error')
  }
}

const resetInitialSetup = () => {
  showToast('Función de reset deshabilitada temporalmente', 'info')
  // Implementar lógica de reset si es necesario
}

// Lifecycle
onMounted(() => {
  updateDateTime()
  loadStats()
  
  // Actualizar hora cada segundo
  setInterval(updateDateTime, 1000)
})
</script>

<style scoped>
/* Estilos existentes del Dashboard - se mantienen igual */
.dashboard-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.welcome-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.welcome-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.date-section {
  text-align: right;
}

.current-date {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.current-time {
  font-size: 0.9rem;
  opacity: 0.8;
  font-family: 'Courier New', monospace;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  position: relative;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.pattern-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="%23667eea" opacity="0.3"/></svg>') repeat;
  opacity: 0.5;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.icon-container {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 1rem;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.card-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.icon-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 1rem;
  opacity: 0.2;
  filter: blur(10px);
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.trend-icon {
  width: 16px;
  height: 16px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.number-container {
  margin-bottom: 0.5rem;
}

.animated-number {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.skeleton-number {
  height: 3rem;
  display: flex;
  align-items: center;
}

.skeleton-bar {
  width: 120px;
  height: 2rem;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 0.5rem;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.card-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-right: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.card-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.card-link:hover {
  color: #764ba2;
}

.link-icon {
  width: 16px;
  height: 16px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.quick-actions {
  margin-bottom: 3rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.action-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon .icon {
  width: 20px;
  height: 20px;
  color: white;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.action-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.action-arrow {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  transition: color 0.2s;
}

.action-card:hover .action-arrow {
  color: #667eea;
}

.admin-section {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.superadmin-button {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
}

.superadmin-button:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
}

.admin-panel-button {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
}

.admin-panel-button:hover {
  background: linear-gradient(135deg, #047857, #065f46);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);
}

.reset-button {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
}

.reset-button:hover {
  background: linear-gradient(135deg, #b45309, #92400e);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(217, 119, 6, 0.3);
}

.button-icon {
  width: 20px;
  height: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .welcome-section h1 {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .admin-actions {
    flex-direction: column;
  }
}
</style>