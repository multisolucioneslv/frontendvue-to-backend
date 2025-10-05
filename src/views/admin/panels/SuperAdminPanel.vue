<template>
  <div class="superadmin-panel">
    <div class="admin-container">
      <!-- Header -->
      <div class="admin-header">
        <div class="header-content">
          <div class="header-info">
            <h1>Panel de SuperAdministración</h1>
            <p>Gestión completa del sistema - Solo SuperAdmin</p>
          </div>
          <div class="header-actions">
            <Button @click="previewConfiguration" variant="secondary">
              <Eye class="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
            <Button @click="saveConfiguration" :loading="saving">
              <Save class="h-4 w-4 mr-2" />
              Guardar Configuración
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
            <span v-if="getDisabledCount(tab.id) > 0" class="disabled-count">
              {{ getDisabledCount(tab.id) }}
            </span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Configuración de Vistas -->
          <div v-if="activeTab === 'views'" class="tab-panel">
            <div class="panel-header">
              <h2>Configuración de Vistas del Sistema</h2>
              <p>Define qué vistas estarán disponibles en el sistema</p>
            </div>

            <div class="views-config">
              <div class="views-grid">
                <Card 
                  v-for="view in availableViews" 
                  :key="view.id"
                  :class="['view-card', { 'enabled': view.enabled, 'disabled': !view.enabled }]"
                >
                  <div class="view-content">
                    <div class="view-icon" :style="{ backgroundColor: view.color }">
                      <component :is="getIcon(view.icon)" class="h-6 w-6 text-white" />
                    </div>
                    <div class="view-info">
                      <h3 class="view-name">{{ view.name }}</h3>
                      <p class="view-description">{{ view.description }}</p>
                      <div class="view-badges">
                        <span v-if="view.required" class="badge required">Requerido</span>
                        <span v-if="view.enabled" class="badge enabled">Activo</span>
                        <span v-else class="badge disabled">Inactivo</span>
                      </div>
                    </div>
                    <div class="view-controls">
                      <label class="toggle-switch">
                        <input 
                          type="checkbox" 
                          :checked="view.enabled"
                          :disabled="view.required"
                          @change="toggleView(view.id)"
                        />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <!-- Configuración de Roles y Permisos -->
          <div v-if="activeTab === 'roles'" class="tab-panel">
            <div class="panel-header">
              <h2>Gestión de Roles y Permisos</h2>
              <p>Administra los roles del sistema y sus permisos</p>
            </div>

            <!-- Formulario de Roles -->
            <div class="roles-config">
              <div class="section-header">
                <h3>Roles del Sistema</h3>
                <Button @click="addRole" class="add-role-btn">
                  <Plus class="h-4 w-4 mr-2" />
                  Agregar Rol
                </Button>
              </div>

              <div class="roles-list">
                <Card 
                  v-for="(role, index) in systemRoles" 
                  :key="role.id"
                  class="role-card"
                >
                  <div class="role-header">
                    <div class="role-info">
                      <input 
                        v-model="role.name" 
                        class="role-name-input"
                        placeholder="Nombre del rol"
                        @input="updateRole(index)"
                        :disabled="role.is_system"
                      />
                      <input 
                        v-model="role.description" 
                        class="role-desc-input"
                        placeholder="Descripción del rol"
                        @input="updateRole(index)"
                        :disabled="role.is_system"
                      />
                      <div v-if="role.is_system" class="system-role-badge">
                        <Shield class="h-4 w-4 mr-1" />
                        Rol del Sistema
                      </div>
                    </div>
                    <div class="role-actions">
                      <label class="toggle-switch">
                        <input 
                          type="checkbox" 
                          v-model="role.enabled"
                          @change="updateRole(index)"
                          :disabled="role.is_system"
                        />
                        <span class="toggle-slider"></span>
                      </label>
                      <Button 
                        v-if="!role.is_system"
                        @click="removeRole(index)" 
                        variant="danger" 
                        size="sm"
                        class="remove-btn"
                      >
                        <X class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <!-- Permisos del Rol -->
                  <div class="permissions-section">
                    <h4>Permisos</h4>
                    <div class="permissions-grid">
                      <div 
                        v-for="permission in availablePermissions" 
                        :key="permission.id"
                        class="permission-item"
                      >
                        <label class="permission-checkbox">
                          <input 
                            type="checkbox" 
                            :value="permission.id"
                            v-model="role.permissions"
                            @change="updateRole(index)"
                            :disabled="role.is_system && permission.name.includes('superadmin')"
                          />
                          <span class="checkmark"></span>
                          <div class="permission-info">
                            <span class="permission-name">{{ permission.name }}</span>
                          </div>
                        </label>
                      </div>
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
              <p>Configuraciones avanzadas del sistema</p>
            </div>

            <div class="system-config">
              <Card class="config-card">
                <h3>Configuración General</h3>
                <div class="config-items">
                  <div class="config-item">
                    <label>Nombre del Sistema</label>
                    <input v-model="systemConfig.name" type="text" placeholder="Nombre del sistema">
                  </div>
                  <div class="config-item">
                    <label>Descripción</label>
                    <textarea v-model="systemConfig.description" placeholder="Descripción del sistema"></textarea>
                  </div>
                  <div class="config-item">
                    <label>Versión</label>
                    <input v-model="systemConfig.version" type="text" placeholder="Versión del sistema">
                  </div>
                </div>
              </Card>

              <Card class="config-card">
                <h3>Configuración de Seguridad</h3>
                <div class="config-items">
                  <div class="config-item">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="systemConfig.security.requireEmailVerification">
                      Requerir verificación de email
                    </label>
                  </div>
                  <div class="config-item">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="systemConfig.security.enableTwoFactor">
                      Habilitar autenticación de dos factores
                    </label>
                  </div>
                  <div class="config-item">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="systemConfig.security.sessionTimeout">
                      Timeout de sesión automático
                    </label>
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
          Guardar Configuración
        </Button>
        <Button 
          @click="previewConfiguration"
          class="preview-button"
        >
          <Eye class="h-4 w-4 mr-2" />
          Vista Previa
        </Button>
        <Button 
          @click="completeSetup"
          class="complete-button"
        >
          <CheckCircle class="h-4 w-4 mr-2" />
          Completar Configuración
        </Button>
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
  Save,
  Eye,
  CheckCircle,
  LayoutDashboard,
  Shield,
  Plus,
  X,
  Users,
  Package,
  Building2,
  FolderOpen,
  User
} from 'lucide-vue-next'

const router = useRouter()
const { success, error: showError } = useToast()

// Estado
const activeTab = ref('views')
const saving = ref(false)

// Datos del sistema seleccionado
const selectedSystem = ref(null)

// Tabs disponibles
const tabs = ref([
  { id: 'views', name: 'Vistas', icon: 'LayoutDashboard' },
  { id: 'roles', name: 'Roles y Permisos', icon: 'Shield' },
  { id: 'system', name: 'Sistema', icon: 'Settings' }
])

// Vistas disponibles
const availableViews = ref([
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
    name: 'Usuarios',
    description: 'Gestión de usuarios del sistema',
    icon: 'Users',
    color: '#10b981',
    enabled: true,
    required: false
  },
  {
    id: 3,
    name: 'Productos',
    description: 'Catálogo de productos',
    icon: 'Package',
    color: '#f59e0b',
    enabled: true,
    required: false
  },
  {
    id: 4,
    name: 'Clientes',
    description: 'Gestión de clientes',
    icon: 'Users',
    color: '#8b5cf6',
    enabled: true,
    required: false
  },
  {
    id: 5,
    name: 'Sucursales',
    description: 'Gestión de sucursales',
    icon: 'Building2',
    color: '#ef4444',
    enabled: true,
    required: false
  },
  {
    id: 6,
    name: 'Categorías',
    description: 'Gestión de categorías',
    icon: 'FolderOpen',
    color: '#06b6d4',
    enabled: true,
    required: false
  },
  {
    id: 7,
    name: 'Perfil',
    description: 'Gestión del perfil de usuario',
    icon: 'User',
    color: '#84cc16',
    enabled: true,
    required: true
  },
  {
    id: 8,
    name: 'Configuraciones',
    description: 'Configuraciones del usuario',
    icon: 'Settings',
    color: '#64748b',
    enabled: true,
    required: true
  }
])

// Permisos disponibles del sistema
const availablePermissions = ref([
  { id: 1, name: 'ver-dashboard' },
  { id: 2, name: 'ver-usuarios' },
  { id: 3, name: 'crear-usuarios' },
  { id: 4, name: 'editar-usuarios' },
  { id: 5, name: 'eliminar-usuarios' },
  { id: 6, name: 'ver-productos' },
  { id: 7, name: 'crear-productos' },
  { id: 8, name: 'editar-productos' },
  { id: 9, name: 'eliminar-productos' },
  { id: 10, name: 'ver-clientes' },
  { id: 11, name: 'crear-clientes' },
  { id: 12, name: 'editar-clientes' },
  { id: 13, name: 'eliminar-clientes' },
  { id: 14, name: 'ver-sucursales' },
  { id: 15, name: 'crear-sucursales' },
  { id: 16, name: 'editar-sucursales' },
  { id: 17, name: 'eliminar-sucursales' },
  { id: 18, name: 'ver-categorias' },
  { id: 19, name: 'crear-categorias' },
  { id: 20, name: 'editar-categorias' },
  { id: 21, name: 'eliminar-categorias' },
  { id: 22, name: 'configurar-sistema' },
  { id: 23, name: 'ver-reportes' },
  { id: 24, name: 'gestionar-roles' },
  { id: 25, name: 'acceso-superadmin-panel' },
  { id: 26, name: 'acceso-admin-panel' }
])

// Roles del sistema
const systemRoles = ref([
  {
    id: 1,
    name: 'SuperAdmin',
    description: 'Acceso completo al sistema',
    enabled: true,
    is_system: true,
    permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
  },
  {
    id: 2,
    name: 'Admin',
    description: 'Administrador con acceso limitado',
    enabled: true,
    is_system: false,
    permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 26]
  },
  {
    id: 3,
    name: 'Vendedor',
    description: 'Acceso a ventas y clientes',
    enabled: true,
    is_system: false,
    permissions: [1, 6, 7, 8, 10, 11, 12, 18, 19, 20]
  },
  {
    id: 4,
    name: 'Empleado',
    description: 'Acceso básico de consulta',
    enabled: true,
    is_system: false,
    permissions: [1, 6, 10, 14, 18]
  }
])

// Configuración del sistema
const systemConfig = ref({
  name: 'Sistema de Gestión',
  description: 'Sistema de gestión empresarial',
  version: '1.0.0',
  security: {
    requireEmailVerification: false,
    enableTwoFactor: false,
    sessionTimeout: true
  }
})

// Métodos
const getIcon = (iconName: string) => {
  const iconMap = {
    LayoutDashboard,
    Users,
    Package,
    Building2,
    FolderOpen,
    User,
    Settings,
    Shield
  }
  return iconMap[iconName] || LayoutDashboard
}

// Función para obtener el número de elementos deshabilitados por pestaña
const getDisabledCount = (tabId: string) => {
  switch (tabId) {
    case 'views':
      return availableViews.value.filter(v => !v.enabled && !v.required).length
    case 'roles':
      return systemRoles.value.filter(r => !r.enabled && !r.is_system).length
    default:
      return 0
  }
}

const toggleView = (viewId: number) => {
  const view = availableViews.value.find(v => v.id === viewId)
  if (view && !view.required) {
    view.enabled = !view.enabled
    if (!view.enabled) {
      success('Vista deshabilitada', `La vista "${view.name}" ha sido deshabilitada`)
    } else {
      success('Vista habilitada', `La vista "${view.name}" ha sido habilitada`)
    }
  }
}

// Funciones para manejar roles
const addRole = () => {
  const newRole = {
    id: Date.now(),
    name: 'Nuevo Rol',
    description: 'Descripción del nuevo rol',
    enabled: true,
    is_system: false,
    permissions: []
  }
  systemRoles.value.push(newRole)
  success('Rol agregado', 'Se ha agregado un nuevo rol al sistema')
}

const removeRole = (index: number) => {
  if (systemRoles.value.length > 1) {
    const role = systemRoles.value[index]
    systemRoles.value.splice(index, 1)
    success('Rol eliminado', `Se ha eliminado el rol "${role.name}"`)
  } else {
    showError('Error', 'Debe mantener al menos un rol en el sistema')
  }
}

const updateRole = (index: number) => {
  const role = systemRoles.value[index]
  success('Rol actualizado', `Se ha actualizado el rol "${role.name}"`)
}

const saveConfiguration = async () => {
  try {
    saving.value = true
    
    // Recopilar toda la configuración
    const configuration = {
      views: availableViews.value,
      roles: systemRoles.value,
      permissions: availablePermissions.value,
      systemConfig: systemConfig.value,
      systemType: selectedSystem.value,
      timestamp: new Date().toISOString()
    }
    
    // Guardar en localStorage
    localStorage.setItem('superAdminConfiguration', JSON.stringify(configuration))
    
    // TODO: Enviar al backend para crear roles y permisos
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
  success('Vista Previa', 'Mostrando configuración actual del SuperAdmin')
}

const completeSetup = async () => {
  try {
    saving.value = true
    
    // Guardar configuración final
    await saveConfiguration()
    
    success('Configuración completada', 'El sistema ha sido configurado exitosamente')
    
    // Redirigir al dashboard
    setTimeout(() => {
      router.push('/app/dashboard')
    }, 2000)
    
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'Error al completar la configuración')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  // Cargar configuración existente si existe
  const savedConfig = localStorage.getItem('superAdminConfiguration')
  if (savedConfig) {
    const config = JSON.parse(savedConfig)
    availableViews.value = config.views || availableViews.value
    systemRoles.value = config.roles || systemRoles.value
    systemConfig.value = config.systemConfig || systemConfig.value
  }
})
</script>

<style scoped>
.superadmin-panel {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
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
  color: #1e40af;
  border-bottom-color: #1e40af;
  background: #eff6ff;
}

.disabled-count {
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.1);
  }
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

/* Views Grid */
.views-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.view-card {
  transition: all 0.2s ease;
  border: 2px solid #e5e7eb;
}

.view-card.enabled {
  border-color: #10b981;
  background: #f0fdf4;
}

.view-card.disabled {
  border-color: #ef4444;
  background: #fef2f2;
}

.view-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.view-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.view-info {
  flex: 1;
}

.view-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.view-description {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.view-badges {
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

/* Roles Configuration */
.roles-config {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.roles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.role-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.role-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.role-name-input,
.role-desc-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.role-name-input {
  font-weight: 600;
}

.system-role-badge {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
}

.role-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.remove-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: #dc2626;
}

.permissions-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.permission-item {
  display: flex;
  align-items: center;
}

.permission-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.permission-checkbox input[type="checkbox"] {
  margin-right: 0.75rem;
}

.permission-info {
  flex: 1;
}

.permission-name {
  font-size: 0.875rem;
  color: #374151;
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

.config-item textarea {
  min-height: 100px;
  resize: vertical;
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
  background: #3b82f6;
  color: white;
  border: none;
}

.save-button:hover {
  background: #2563eb;
}

.preview-button {
  border-color: #6b7280;
  color: #6b7280;
}

.complete-button {
  border-color: #10b981;
  color: #10b981;
}

.complete-button:hover {
  background: #10b981;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .superadmin-panel {
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
  
  .views-grid {
    grid-template-columns: 1fr;
  }
  
  .role-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .role-actions {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .permissions-grid {
    grid-template-columns: 1fr;
  }
  
  .admin-actions {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Dark mode */
.dark .superadmin-panel {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

.dark .admin-container {
  background: #1e293b;
  color: #f1f5f9;
}

.dark .admin-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.dark .panel-header h2,
.dark .view-name,
.dark .section-header h3,
.dark .config-card h3 {
  color: #f1f5f9;
}

.dark .panel-header p,
.dark .view-description {
  color: #94a3b8;
}

.dark .view-card {
  background: #334155;
  border-color: #475569;
}

.dark .role-card {
  background: #334155;
  border-color: #475569;
}

.dark .config-card {
  background: #334155;
  border-color: #475569;
}

.dark .admin-actions {
  background: #0f172a;
  border-color: #334155;
}
</style>
