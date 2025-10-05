<template>
  <div class="admin-dashboard">
    <div class="admin-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">
            <Shield class="h-8 w-8" />
            Panel de Administración
          </h1>
          <p class="page-subtitle">
            Gestiona el sistema multi-servicio y sus configuraciones
          </p>
        </div>
        <div class="header-actions">
          <Button @click="refreshData" :disabled="loading" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
            Actualizar
          </Button>
        </div>
      </div>
    </div>

    <!-- Estadísticas generales -->
    <div class="stats-grid">
      <Card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-blue-100 text-blue-600">
            <Settings class="h-6 w-6" />
          </div>
          <div class="stat-info">
            <h3 class="stat-number">{{ stats.totalSystems }}</h3>
            <p class="stat-label">Sistemas Totales</p>
          </div>
        </div>
      </Card>

      <Card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-green-100 text-green-600">
            <Power class="h-6 w-6" />
          </div>
          <div class="stat-info">
            <h3 class="stat-number">{{ stats.activeSystems }}</h3>
            <p class="stat-label">Sistemas Activos</p>
          </div>
        </div>
      </Card>

      <Card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-purple-100 text-purple-600">
            <Layers class="h-6 w-6" />
          </div>
          <div class="stat-info">
            <h3 class="stat-number">{{ stats.totalModules }}</h3>
            <p class="stat-label">Módulos Totales</p>
          </div>
        </div>
      </Card>

      <Card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-orange-100 text-orange-600">
            <Users class="h-6 w-6" />
          </div>
          <div class="stat-info">
            <h3 class="stat-number">{{ stats.totalUsers }}</h3>
            <p class="stat-label">Usuarios con Acceso</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Navegación de administración -->
    <div class="admin-navigation">
      <h2 class="section-title">Gestión del Sistema</h2>
      <div class="nav-grid">
        <Card 
          v-for="navItem in navigationItems" 
          :key="navItem.id"
          class="nav-card"
          @click="navigateTo(navItem.route)"
        >
          <div class="nav-content">
            <div class="nav-icon" :style="{ backgroundColor: navItem.color }">
              <component :is="navItem.icon" class="h-6 w-6 text-white" />
            </div>
            <div class="nav-info">
              <h3 class="nav-title">{{ navItem.title }}</h3>
              <p class="nav-description">{{ navItem.description }}</p>
            </div>
            <div class="nav-arrow">
              <ChevronRight class="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Sistema actual -->
    <div class="current-system">
      <h2 class="section-title">Sistema Actual</h2>
      <Card v-if="currentSystem" class="current-system-card">
        <div class="current-system-content">
          <div class="system-main-info">
            <div class="system-icon" :style="{ backgroundColor: currentSystem.color }">
              <component :is="getIcon(currentSystem.icon)" class="h-8 w-8 text-white" />
            </div>
            <div class="system-details">
              <h3 class="system-name">{{ currentSystem.name }}</h3>
              <p class="system-description">{{ currentSystem.description }}</p>
              <div class="system-badges">
                <span class="badge badge-default">Sistema Actual</span>
                <span v-if="currentSystem.is_active" class="badge badge-active">Activo</span>
              </div>
            </div>
          </div>
          <div class="system-actions">
            <Button @click="changeSystem" variant="outline">
              <Settings class="h-4 w-4 mr-2" />
              Cambiar Sistema
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Actividad reciente -->
    <div class="recent-activity">
      <h2 class="section-title">Actividad Reciente</h2>
      <Card class="activity-card">
        <div class="activity-list">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon" :class="activity.type">
              <component :is="activity.icon" class="h-4 w-4" />
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { 
  Shield, 
  RefreshCw, 
  Settings, 
  Power, 
  Layers, 
  Users, 
  ChevronRight,
  LayoutDashboard,
  Stethoscope,
  Heart,
  Building2,
  FileText,
  ShoppingCart,
  Scale,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  Cog
} from 'lucide-vue-next'

const router = useRouter()
const { success, error: showError } = useToast()

// Estado reactivo
const loading = ref(false)
const currentSystem = ref(null)
const stats = reactive({
  totalSystems: 0,
  activeSystems: 0,
  totalModules: 0,
  totalUsers: 0
})

// Navegación
const navigationItems = [
  {
    id: 'system-types',
    title: 'Tipos de Sistema',
    description: 'Gestiona los diferentes tipos de sistema disponibles',
    icon: Settings,
    color: '#3B82F6',
    route: '/app/admin/system-types'
  },
  {
    id: 'system-modules',
    title: 'Módulos del Sistema',
    description: 'Configura los módulos disponibles para cada sistema',
    icon: Layers,
    color: '#10B981',
    route: '/app/admin/system-modules'
  },
  {
    id: 'user-access',
    title: 'Acceso de Usuarios',
    description: 'Gestiona el acceso de usuarios a diferentes sistemas',
    icon: UserCheck,
    color: '#8B5CF6',
    route: '/app/admin/user-access'
  },
  {
    id: 'system-config',
    title: 'Configuraciones',
    description: 'Configura parámetros específicos de cada sistema',
    icon: Cog,
    color: '#F59E0B',
    route: '/app/admin/system-configurations'
  }
]

// Actividad reciente (simulada por ahora)
const recentActivity = ref([
  {
    id: 1,
    type: 'success',
    icon: Plus,
    text: 'Nuevo sistema "Clínica Dental" creado',
    time: 'Hace 2 horas'
  },
  {
    id: 2,
    type: 'info',
    icon: Edit,
    text: 'Sistema "Hospital" actualizado',
    time: 'Hace 4 horas'
  },
  {
    id: 3,
    type: 'warning',
    icon: Settings,
    text: 'Configuración de módulos modificada',
    time: 'Hace 6 horas'
  },
  {
    id: 4,
    type: 'success',
    icon: UserCheck,
    text: 'Acceso de usuario otorgado',
    time: 'Hace 1 día'
  }
])

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

const loadStats = async () => {
  try {
    const response = await fetch('/api/admin/system-types', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error('Error al cargar estadísticas')
    
    const data = await response.json()
    const systems = data.data
    
    stats.totalSystems = systems.length
    stats.activeSystems = systems.filter(s => s.is_active).length
    stats.totalModules = systems.reduce((total, system) => total + (system.modules?.length || 0), 0)
    
    // Buscar sistema por defecto
    currentSystem.value = systems.find(s => s.is_default) || systems[0]
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'No se pudieron cargar las estadísticas')
  }
}

const refreshData = async () => {
  loading.value = true
  await loadStats()
  loading.value = false
  success('Datos actualizados', 'Las estadísticas se han actualizado correctamente')
}

const navigateTo = (route: string) => {
  router.push(route)
}

const changeSystem = () => {
  router.push('/app/admin/system-types')
}

// Lifecycle
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.admin-navigation {
  margin-bottom: 2rem;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.nav-card {
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.nav-info {
  flex: 1;
}

.nav-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.nav-description {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.nav-arrow {
  flex-shrink: 0;
}

.current-system {
  margin-bottom: 2rem;
}

.current-system-card {
  border: 2px solid #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.current-system-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.system-main-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.system-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  flex-shrink: 0;
}

.system-details {
  flex: 1;
}

.system-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.system-description {
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
}

.system-badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-default {
  background: #f59e0b;
  color: white;
}

.badge-active {
  background: #10b981;
  color: white;
}

.recent-activity {
  margin-bottom: 2rem;
}

.activity-card {
  border: 1px solid #e2e8f0;
}

.activity-list {
  padding: 1.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-icon.success {
  background: #dcfce7;
  color: #16a34a;
}

.activity-icon.info {
  background: #dbeafe;
  color: #2563eb;
}

.activity-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: #374151;
  margin: 0 0 0.25rem 0;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

/* Dark mode */
.dark .page-title {
  color: #f1f5f9;
}

.dark .page-subtitle {
  color: #94a3b8;
}

.dark .stat-card {
  border-color: #334155;
  background: #1e293b;
}

.dark .stat-number {
  color: #f1f5f9;
}

.dark .stat-label {
  color: #94a3b8;
}

.dark .section-title {
  color: #f1f5f9;
}

.dark .nav-card {
  border-color: #334155;
  background: #1e293b;
}

.dark .nav-title {
  color: #f1f5f9;
}

.dark .nav-description {
  color: #94a3b8;
}

.dark .current-system-card {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
}

.dark .system-name {
  color: #f1f5f9;
}

.dark .system-description {
  color: #94a3b8;
}

.dark .activity-card {
  border-color: #334155;
  background: #1e293b;
}

.dark .activity-item {
  border-bottom-color: #334155;
}

.dark .activity-text {
  color: #e2e8f0;
}

.dark .activity-time {
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-grid {
    grid-template-columns: 1fr;
  }
  
  .current-system-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .system-main-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
