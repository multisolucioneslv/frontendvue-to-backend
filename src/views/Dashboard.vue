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
            <span class="progress-text">75% capacidad</span>
          </div>
        </div>
      </div>

      <!-- Clientes Card -->
      <div class="stat-card clientes-card" :class="{ 'loading': loading.customers }">
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
            <span class="progress-text">60% activos</span>
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
            <p class="card-subtitle">Ubicaciones activas</p>
          </div>
          
          <div class="card-footer">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: '45%' }"></div>
            </div>
            <span class="progress-text">45% ocupación</span>
          </div>
        </div>
      </div>

      <!-- Categorías Card -->
      <div class="stat-card categorias-card" :class="{ 'loading': loading.categories }">
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
            <span class="progress-text">85% utilizadas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones Rápidas con diseño moderno -->
    <div class="quick-actions-section">
      <div class="section-header">
        <h2 class="section-title">Acciones Rápidas</h2>
        <p class="section-subtitle">Gestiona tu negocio de forma eficiente</p>
      </div>
      
      <div class="actions-grid">
        <router-link to="/app/productos" class="action-card productos-action">
          <div class="action-icon-container">
            <Plus class="action-icon" />
            <div class="action-glow"></div>
          </div>
          <div class="action-content">
            <h3>Nuevo Producto</h3>
            <p>Agregar producto al inventario</p>
          </div>
          <ArrowRight class="action-arrow" />
        </router-link>

        <router-link to="/app/customers" class="action-card clientes-action">
          <div class="action-icon-container">
            <UserPlus class="action-icon" />
            <div class="action-glow"></div>
          </div>
          <div class="action-content">
            <h3>Nuevo Cliente</h3>
            <p>Registrar nuevo cliente</p>
          </div>
          <ArrowRight class="action-arrow" />
        </router-link>

        <router-link to="/app/sucursales" class="action-card sucursales-action">
          <div class="action-icon-container">
            <Building class="action-icon" />
            <div class="action-glow"></div>
          </div>
          <div class="action-content">
            <h3>Nueva Sucursal</h3>
            <p>Crear nueva ubicación</p>
          </div>
          <ArrowRight class="action-arrow" />
        </router-link>

        <router-link to="/app/categories" class="action-card categorias-action">
          <div class="action-icon-container">
            <FolderPlus class="action-icon" />
            <div class="action-glow"></div>
          </div>
          <div class="action-content">
            <h3>Nueva Categoría</h3>
            <p>Organizar productos</p>
          </div>
          <ArrowRight class="action-arrow" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
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
  ArrowRight
} from 'lucide-vue-next'

const authStore = useAuthStore()

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

const userName = computed(() => {
  return authStore.user?.name || 'Usuario'
})

const loadStats = async () => {
  try {
    // Simular carga progresiva para efecto visual
    const promises = [
      { key: 'productos', endpoint: API_ENDPOINTS.PRODUCTOS, delay: 500 },
      { key: 'customers', endpoint: API_ENDPOINTS.CUSTOMERS, delay: 800 },
      { key: 'sucursales', endpoint: API_ENDPOINTS.SUCURSALES, delay: 1200 },
      { key: 'categories', endpoint: API_ENDPOINTS.CATEGORIES, delay: 1500 }
    ]

    for (const promise of promises) {
      setTimeout(async () => {
        try {
          const response = await axios.get(promise.endpoint)
          stats.value[promise.key as keyof typeof stats.value] = 
            response.data.pagination?.total || response.data.data?.length || 0
        } catch (error) {
          console.error(`Error loading ${promise.key}:`, error)
          stats.value[promise.key as keyof typeof stats.value] = 0
        } finally {
          loading.value[promise.key as keyof typeof loading.value] = false
        }
      }, promise.delay)
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  currentTime.value = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadStats()
  updateDateTime()
  
  // Actualizar tiempo cada minuto
  setInterval(updateDateTime, 60000)
})
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header Section */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem 0;
}

.welcome-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.welcome-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
}

.date-section {
  text-align: right;
}

.current-date {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  text-transform: capitalize;
}

.current-time {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-height: 200px;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.stat-card.loading {
  animation: pulse 2s infinite;
}

/* Card Backgrounds */
.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
}

.pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
}

/* Specific Card Colors */
.productos-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.clientes-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.sucursales-card {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.categorias-card {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* Card Content */
.card-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.icon-container {
  position: relative;
}

.card-icon {
  width: 3rem;
  height: 3rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
  height: 4rem;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow 2s ease-in-out infinite alternate;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.trend-icon {
  width: 1rem;
  height: 1rem;
}

.trend-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.number-container {
  margin: 1rem 0;
}

.animated-number {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-number {
  height: 3rem;
  display: flex;
  align-items: center;
}

.skeleton-bar {
  width: 60%;
  height: 2rem;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 75%);
  border-radius: 4px;
  animation: shimmer 2s infinite;
}

.card-subtitle {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

.card-footer {
  margin-top: auto;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  transition: width 1s ease-in-out;
  animation: progressFill 2s ease-out;
}

.progress-text {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Quick Actions */
.quick-actions-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.section-subtitle {
  color: #64748b;
  margin: 0;
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
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.2);
}

.action-card:hover .action-arrow {
  transform: translateX(4px);
}

.action-icon-container {
  position: relative;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.action-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
}

.action-card:hover .action-glow {
  opacity: 1;
  animation: actionGlow 0.6s ease-out;
}

.action-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: all 0.3s ease;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.action-content p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.action-arrow {
  width: 1.25rem;
  height: 1.25rem;
  color: #94a3b8;
  transition: all 0.3s ease;
}

/* Specific Action Colors */
.productos-action:hover .action-icon-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.productos-action:hover .action-glow {
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
}

.clientes-action:hover .action-icon-container {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.clientes-action:hover .action-glow {
  background: radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, transparent 70%);
}

.sucursales-action:hover .action-icon-container {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.sucursales-action:hover .action-glow {
  background: radial-gradient(circle, rgba(79, 172, 254, 0.3) 0%, transparent 70%);
}

.categorias-action:hover .action-icon-container {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.categorias-action:hover .action-glow {
  background: radial-gradient(circle, rgba(67, 233, 123, 0.3) 0%, transparent 70%);
}

/* Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes glow {
  0% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes progressFill {
  0% { width: 0%; }
  100% { width: var(--target-width, 75%); }
}

@keyframes actionGlow {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
}

/* Dark mode support */
.dark .quick-actions-section {
  background: #1e293b;
  border-color: #334155;
}

.dark .section-title {
  color: #f1f5f9;
}

.dark .section-subtitle {
  color: #94a3b8;
}

.dark .action-card {
  background: #1e293b;
  border-color: #334155;
}

.dark .action-card:hover {
  border-color: #667eea;
}

.dark .action-content h3 {
  color: #f1f5f9;
}

.dark .action-content p {
  color: #94a3b8;
}

.dark .action-arrow {
  color: #64748b;
}

.dark .current-date {
  color: #f1f5f9;
}

.dark .current-time {
  color: #94a3b8;
}
</style>