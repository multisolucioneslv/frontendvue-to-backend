<template>
  <div class="admin-panel">
    <div class="admin-container">
      <!-- Header -->
      <div class="admin-header">
        <div class="header-content">
          <div class="header-info">
            <h1>Panel de Administración</h1>
            <p>Gestión del sistema - Rol Admin</p>
          </div>
          <div class="header-actions">
            <Button @click="previewConfiguration" variant="secondary">
              <Eye class="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
            <Button @click="saveConfiguration" :loading="saving">
              <Save class="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="admin-content">
        <!-- Navigation Tabs -->
        <div class="admin-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', { 'active': activeTab === tab.id }]"
          >
            <component :is="tab.icon" class="h-5 w-5 mr-2" />
            {{ tab.name }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Gestión de Usuarios -->
          <div v-if="activeTab === 'users'" class="tab-panel">
            <div class="panel-header">
              <h2>Gestión de Usuarios</h2>
              <p>Administra los usuarios del sistema y sus roles</p>
            </div>

            <div class="users-management">
              <Card class="management-card">
                <div class="card-header">
                  <h3>Lista de Usuarios</h3>
                  <Button @click="addUser" class="add-btn">
                    <UserPlus class="h-4 w-4 mr-2" />
                    Agregar Usuario
                  </Button>
                </div>
                
                <div class="users-table">
                  <div class="table-header">
                    <div class="col-name">Nombre</div>
                    <div class="col-username">Usuario</div>
                    <div class="col-email">Email</div>
                    <div class="col-role">Rol</div>
                    <div class="col-status">Estado</div>
                    <div class="col-actions">Acciones</div>
                  </div>
                  
                  <div class="table-body">
                    <div 
                      v-for="user in systemUsers" 
                      :key="user.id"
                      class="table-row"
                    >
                      <div class="col-name">
                        <div class="user-info">
                          <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                          <span>{{ user.name }}</span>
                        </div>
                      </div>
                      <div class="col-username">{{ user.username }}</div>
                      <div class="col-email">{{ user.email }}</div>
                      <div class="col-role">
                        <span class="role-badge" :class="getRoleClass(user.role)">
                          {{ user.role }}
                        </span>
                      </div>
                      <div class="col-status">
                        <span class="status-badge" :class="user.status ? 'active' : 'inactive'">
                          {{ user.status ? 'Activo' : 'Inactivo' }}
                        </span>
                      </div>
                      <div class="col-actions">
                        <Button @click="editUser(user)" size="sm" variant="secondary">
                          <Edit class="h-4 w-4" />
                        </Button>
                        <Button @click="toggleUserStatus(user)" size="sm" :variant="user.status ? 'danger' : 'success'">
                          <component :is="user.status ? 'UserX' : 'UserCheck'" class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- Configuración de Módulos -->
          <div v-if="activeTab === 'modules'" class="tab-panel">
            <div class="panel-header">
              <h2>Configuración de Módulos</h2>
              <p>Gestiona los módulos disponibles para el sistema</p>
            </div>

            <div class="modules-config">
              <div class="modules-grid">
                <Card 
                  v-for="module in availableModules" 
                  :key="module.id"
                  class="module-card"
                  :class="{ 'enabled': module.enabled, 'disabled': !module.enabled }"
                >
                  <div class="module-content">
                    <div class="module-icon" :style="{ backgroundColor: module.color }">
                      <component :is="getIcon(module.icon)" class="h-6 w-6 text-white" />
                    </div>
                    <div class="module-info">
                      <h3 class="module-name">{{ module.name }}</h3>
                      <p class="module-description">{{ module.description }}</p>
                      <div class="module-badges">
                        <span v-if="module.required" class="badge required">Requerido</span>
                        <span v-if="module.enabled" class="badge enabled">Activo</span>
                        <span v-else class="badge disabled">Inactivo</span>
                      </div>
                    </div>
                    <div class="module-controls">
                      <label class="toggle-switch">
                        <input 
                          type="checkbox" 
                          :checked="module.enabled"
                          :disabled="module.required"
                          @change="toggleModule(module.id)"
                        />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <!-- Configuración del Sistema -->
          <div v-if="activeTab === 'system'" class="tab-panel">
            <div class="panel-header">
              <h2>Configuración del Sistema</h2>
              <p>Configuraciones básicas del sistema (acceso limitado)</p>
            </div>

            <div class="system-config">
              <Card class="config-card">
                <h3>Configuración General</h3>
                <div class="config-items">
                  <div class="config-item">
                    <label>Nombre del Sistema</label>
                    <input v-model="systemConfig.name" type="text" placeholder="Nombre del sistema" readonly>
                  </div>
                  <div class="config-item">
                    <label>Descripción</label>
                    <textarea v-model="systemConfig.description" placeholder="Descripción del sistema" readonly></textarea>
                  </div>
                  <div class="config-item">
                    <label>Versión</label>
                    <input v-model="systemConfig.version" type="text" placeholder="Versión del sistema" readonly>
                  </div>
                </div>
              </Card>

              <Card class="config-card">
                <h3>Configuración de Usuarios</h3>
                <div class="config-items">
                  <div class="config-item">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="systemConfig.users.allowRegistration" @change="updateSystemConfig">
                      Permitir registro de nuevos usuarios
                    </label>
                  </div>
                  <div class="config-item">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="systemConfig.users.requireEmailVerification" @change="updateSystemConfig">
                      Requerir verificación de email
                    </label>
                  </div>
                  <div class="config-item">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="systemConfig.users.enablePasswordReset" @change="updateSystemConfig">
                      Habilitar recuperación de contraseña
                    </label>
                  </div>
                </div>
              </Card>

              <Card class="config-card">
                <h3>Configuración de Seguridad</h3>
                <div class="config-items">
                  <div class="config-item">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="systemConfig.security.enableTwoFactor" @change="updateSystemConfig">
                      Habilitar autenticación de dos factores
                    </label>
                  </div>
                  <div class="config-item">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="systemConfig.security.sessionTimeout" @change="updateSystemConfig">
                      Timeout de sesión automático
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- Reportes -->
          <div v-if="activeTab === 'reports'" class="tab-panel">
            <div class="panel-header">
              <h2>Reportes del Sistema</h2>
              <p>Visualiza estadísticas y reportes del sistema</p>
            </div>

            <div class="reports-grid">
              <Card class="report-card">
                <h3>Estadísticas de Usuarios</h3>
                <div class="stats-grid">
                  <div class="stat-item">
                    <span class="stat-number">{{ userStats.total }}</span>
                    <span class="stat-label">Total Usuarios</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ userStats.active }}</span>
                    <span class="stat-label">Activos</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ userStats.inactive }}</span>
                    <span class="stat-label">Inactivos</span>
                  </div>
                </div>
              </Card>

              <Card class="report-card">
                <h3>Actividad Reciente</h3>
                <div class="activity-list">
                  <div 
                    v-for="activity in recentActivity" 
                    :key="activity.id"
                    class="activity-item"
                  >
                    <div class="activity-icon" :style="{ backgroundColor: activity.color }">
                      <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-white" />
                    </div>
                    <div class="activity-content">
                      <p class="activity-text">{{ activity.description }}</p>
                      <span class="activity-time">{{ activity.time }}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="admin-actions">
        <Button 
          @click="saveConfiguration"
          :loading="saving"
          class="save-button"
        >
          <Save class="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
        <Button 
          @click="previewConfiguration"
          class="preview-button"
        >
          <Eye class="h-4 w-4 mr-2" />
          Vista Previa
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { 
  Settings, 
  Save,
  Eye,
  Users,
  UserPlus,
  Edit,
  Package,
  Building2,
  FolderOpen,
  User,
  FileText,
  Clock,
  LayoutDashboard
} from 'lucide-vue-next'

const { success, error: showError } = useToast()

// Estado
const activeTab = ref('users')
const saving = ref(false)

// Tabs disponibles
const tabs = ref([
  { id: 'users', name: 'Usuarios', icon: 'Users' },
  { id: 'modules', name: 'Módulos', icon: 'Package' },
  { id: 'system', name: 'Sistema', icon: 'Settings' },
  { id: 'reports', name: 'Reportes', icon: 'BarChart3' }
])

// Usuarios del sistema
const systemUsers = ref([
  {
    id: 1,
    name: 'Juan Pérez',
    username: 'jperez',
    email: 'juan@empresa.com',
    role: 'Admin',
    status: true
  },
  {
    id: 2,
    name: 'María García',
    username: 'mgarcia',
    email: 'maria@empresa.com',
    role: 'Vendedor',
    status: true
  },
  {
    id: 3,
    name: 'Carlos López',
    username: 'clopez',
    email: 'carlos@empresa.com',
    role: 'Empleado',
    status: false
  }
])

// Módulos disponibles
const availableModules = ref([
  {
    id: 1,
    name: 'Dashboard',
    description: 'Panel principal del sistema',
    icon: 'LayoutDashboard',
    color: '#3b82f6',
    enabled: true,
    required: true
  },
  {
    id: 2,
    name: 'Productos',
    description: 'Gestión de productos',
    icon: 'Package',
    color: '#f59e0b',
    enabled: true,
    required: false
  },
  {
    id: 3,
    name: 'Clientes',
    description: 'Gestión de clientes',
    icon: 'Users',
    color: '#8b5cf6',
    enabled: true,
    required: false
  },
  {
    id: 4,
    name: 'Sucursales',
    description: 'Gestión de sucursales',
    icon: 'Building2',
    color: '#ef4444',
    enabled: true,
    required: false
  },
  {
    id: 5,
    name: 'Categorías',
    description: 'Gestión de categorías',
    icon: 'FolderOpen',
    color: '#06b6d4',
    enabled: true,
    required: false
  }
])

// Configuración del sistema (limitada para Admin)
const systemConfig = ref({
  name: 'Sistema de Gestión',
  description: 'Sistema de gestión empresarial',
  version: '1.0.0',
  users: {
    allowRegistration: true,
    requireEmailVerification: false,
    enablePasswordReset: true
  },
  security: {
    enableTwoFactor: false,
    sessionTimeout: true
  }
})

// Estadísticas de usuarios
const userStats = ref({
  total: 3,
  active: 2,
  inactive: 1
})

// Actividad reciente
const recentActivity = ref([
  {
    id: 1,
    type: 'user_created',
    description: 'Nuevo usuario creado: María García',
    time: 'Hace 2 horas',
    color: '#10b981'
  },
  {
    id: 2,
    type: 'user_updated',
    description: 'Usuario actualizado: Juan Pérez',
    time: 'Hace 4 horas',
    color: '#3b82f6'
  },
  {
    id: 3,
    type: 'module_disabled',
    description: 'Módulo deshabilitado: Reportes',
    time: 'Ayer',
    color: '#f59e0b'
  }
])

// Métodos
const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    LayoutDashboard,
    Users,
    Package,
    Building2,
    FolderOpen,
    User,
    Settings,
    FileText
  }
  return iconMap[iconName] || LayoutDashboard
}

const getActivityIcon = (type: string) => {
  const iconMap = {
    user_created: UserPlus,
    user_updated: Edit,
    module_disabled: Settings,
    default: Clock
  }
  return iconMap[type] || iconMap.default
}

const getRoleClass = (role: string) => {
  const classMap = {
    'SuperAdmin': 'superadmin',
    'Admin': 'admin',
    'Vendedor': 'vendedor',
    'Empleado': 'empleado'
  }
  return classMap[role] || 'default'
}

// Funciones de gestión de usuarios
const addUser = () => {
  success('Agregar Usuario', 'Funcionalidad de agregar usuario - Próximamente')
}

const editUser = (user: { name: string }) => {
  success('Editar Usuario', `Editando usuario: ${user.name}`)
}

const toggleUserStatus = (user: { name: string; status: boolean }) => {
  user.status = !user.status
  const action = user.status ? 'activado' : 'desactivado'
  success('Estado de Usuario', `Usuario ${user.name} ha sido ${action}`)
}

// Funciones de gestión de módulos
const toggleModule = (moduleId: number) => {
  const module = availableModules.value.find(m => m.id === moduleId)
  if (module && !module.required) {
    module.enabled = !module.enabled
    const action = module.enabled ? 'habilitado' : 'deshabilitado'
    success('Módulo', `Módulo ${module.name} ha sido ${action}`)
  }
}

// Función para actualizar configuración del sistema
const updateSystemConfig = () => {
  success('Configuración', 'Configuración del sistema actualizada')
}

const saveConfiguration = async () => {
  try {
    saving.value = true
    
    // Recopilar toda la configuración
    const configuration = {
      users: systemUsers.value,
      modules: availableModules.value,
      systemConfig: systemConfig.value,
      timestamp: new Date().toISOString()
    }
    
    // Guardar en localStorage
    localStorage.setItem('adminConfiguration', JSON.stringify(configuration))
    
    // TODO: Enviar al backend
    // await sendConfigurationToBackend(configuration)
    
    success('Configuración guardada', 'Los cambios han sido guardados exitosamente')
    
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'Error al guardar la configuración')
  } finally {
    saving.value = false
  }
}

const previewConfiguration = () => {
  success('Vista Previa', 'Mostrando configuración actual del Admin')
}

onMounted(() => {
  // Cargar configuración existente si existe
  const savedConfig = localStorage.getItem('adminConfiguration')
  if (savedConfig) {
    const config = JSON.parse(savedConfig)
    systemUsers.value = config.users || systemUsers.value
    availableModules.value = config.modules || availableModules.value
    systemConfig.value = config.systemConfig || systemConfig.value
  }
})
</script>

<style scoped>
.admin-panel {
  min-height: 100vh;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  padding: 2rem;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.admin-header {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  padding: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.header-info p {
  margin: 0;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.admin-content {
  padding: 2rem;
}

.admin-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #374151;
  background: #f9fafb;
}

.tab-button.active {
  color: #059669;
  border-bottom-color: #059669;
  background: #ecfdf5;
}

.tab-content {
  min-height: 500px;
}

.panel-header {
  margin-bottom: 2rem;
}

.panel-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.panel-header p {
  color: #64748b;
  margin: 0;
}

/* Users Management */
.management-card {
  padding: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.users-table {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr 1fr 1fr;
  background: #f9fafb;
  padding: 1rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-badge.superadmin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.admin {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.vendedor {
  background: #d1fae5;
  color: #065f46;
}

.role-badge.empleado {
  background: #f3e8ff;
  color: #7c3aed;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.col-actions {
  display: flex;
  gap: 0.5rem;
}

/* Modules Grid */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.module-card {
  transition: all 0.2s ease;
  border: 2px solid #e5e7eb;
}

.module-card.enabled {
  border-color: #10b981;
  background: #f0fdf4;
}

.module-card.disabled {
  border-color: #ef4444;
  background: #fef2f2;
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
  background: #dbeafe;
  color: #1e40af;
}

.badge.enabled {
  background: #d1fae5;
  color: #065f46;
}

.badge.disabled {
  background: #fee2e2;
  color: #991b1b;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 1.5rem;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 1.125rem;
  width: 1.125rem;
  left: 0.1875rem;
  bottom: 0.1875rem;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #10b981;
}

input:checked + .toggle-slider:before {
  transform: translateX(1.5rem);
}

/* System Configuration */
.system-config {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.config-card {
  padding: 2rem;
}

.config-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
}

.config-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-item label {
  font-weight: 500;
  color: #374151;
}

.config-item input,
.config-item textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.config-item input[readonly] {
  background: #f9fafb;
  color: #6b7280;
}

.config-item textarea[readonly] {
  background: #f9fafb;
  color: #6b7280;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

/* Reports */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.report-card {
  padding: 2rem;
}

.report-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #059669;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.activity-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  color: #374151;
  font-size: 0.875rem;
}

.activity-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

/* Admin Actions */
.admin-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.save-button {
  background: #059669;
  color: white;
  border: none;
}

.save-button:hover {
  background: #047857;
}

.preview-button {
  border-color: #6b7280;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-panel {
    padding: 1rem;
  }
  
  .admin-container {
    border-radius: 0.5rem;
  }
  
  .admin-header {
    padding: 1.5rem;
  }
  
  .admin-content {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .admin-tabs {
    flex-direction: column;
  }
  
  .tab-button {
    justify-content: flex-start;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .admin-actions {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Dark mode */
.dark .admin-panel {
  background: linear-gradient(135deg, #065f46 0%, #047857 100%);
}

.dark .admin-container {
  background: #1e293b;
  color: #f1f5f9;
}

.dark .admin-header {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
}

.dark .panel-header h2,
.dark .card-header h3,
.dark .config-card h3,
.dark .report-card h3 {
  color: #f1f5f9;
}

.dark .panel-header p {
  color: #94a3b8;
}

.dark .management-card,
.dark .config-card,
.dark .report-card {
  background: #334155;
  border-color: #475569;
}

.dark .users-table {
  border-color: #475569;
}

.dark .table-header {
  background: #0f172a;
  border-color: #475569;
}

.dark .table-row {
  border-color: #475569;
}

.dark .module-card {
  background: #334155;
  border-color: #475569;
}

.dark .admin-actions {
  background: #0f172a;
  border-color: #334155;
}
</style>