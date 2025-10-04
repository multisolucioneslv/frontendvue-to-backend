<template>
  <SettingsPage
    title="Configuración de Vistas"
    subtitle="Activa o desactiva funcionalidades específicas del sistema"
    :icon="Eye"
    :show-reset="true"
    :show-save="true"
    @save="saveViewSettings"
    @reset="resetViewSettings"
  >
    <div class="settings-content">
      <!-- Información -->
      <div class="info-card">
        <div class="info-header">
          <Eye class="h-6 w-6" />
          <h3>Gestión de Vistas</h3>
        </div>
        <div class="info-content">
          <p>Desde aquí puedes controlar qué secciones del sistema están disponibles para los usuarios. Las vistas deshabilitadas no aparecerán en el menú de navegación.</p>
        </div>
      </div>

      <!-- Tabla de Vistas -->
      <Card class="views-card">
        <div class="card-header">
          <div class="header-icon">
            <Eye class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Configuración de Vistas</h3>
            <p>Activa o desactiva funcionalidades específicas del sistema</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="views-table-container">
            <table class="views-table">
              <thead>
                <tr>
                  <th>Vista</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(enabled, viewName) in localSettings.views" 
                  :key="viewName"
                  class="view-row"
                >
                  <td class="view-name-cell">
                    <div class="view-name-content">
                      <div class="view-icon">
                        <component :is="getViewIcon(viewName)" class="h-5 w-5" />
                      </div>
                      <span class="view-name-text">{{ getViewDisplayName(viewName) }}</span>
                    </div>
                  </td>
                  <td class="view-description-cell">
                    {{ getViewDescription(viewName) }}
                  </td>
                  <td class="view-status-cell">
                    <span 
                      class="status-badge"
                      :class="{ active: enabled, inactive: !enabled }"
                    >
                      {{ enabled ? 'Activa' : 'Inactiva' }}
                    </span>
                  </td>
                  <td class="view-actions-cell">
                    <div class="toggle-switch">
                      <input 
                        type="checkbox" 
                        :id="`table-${viewName}`"
                        v-model="localSettings.views[viewName]"
                        @change="updateViewSetting(viewName)"
                        class="toggle-input"
                      />
                      <label :for="`table-${viewName}`" class="toggle-label">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <!-- Acciones Rápidas -->
      <Card class="actions-card">
        <div class="card-header">
          <div class="header-icon">
            <Settings class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Acciones Rápidas</h3>
            <p>Configuraciones predefinidas para diferentes tipos de usuarios</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="quick-actions">
            <Button 
              @click="enableAllViews" 
              variant="outline"
              class="action-btn"
            >
              <CheckCircle class="h-4 w-4 mr-2" />
              Activar Todas
            </Button>
            <Button 
              @click="disableAllViews" 
              variant="outline"
              class="action-btn"
            >
              <XCircle class="h-4 w-4 mr-2" />
              Desactivar Todas
            </Button>
            <Button 
              @click="enableBasicViews" 
              variant="outline"
              class="action-btn"
            >
              <User class="h-4 w-4 mr-2" />
              Solo Básicas
            </Button>
            <Button 
              @click="enableAdminViews" 
              variant="outline"
              class="action-btn"
            >
              <Shield class="h-4 w-4 mr-2" />
              Solo Admin
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </SettingsPage>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { useToast } from '@/composables/useToast'
import SettingsPage from '@/components/ui/SettingsPage.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { Eye, Settings, CheckCircle, XCircle, User, Shield, BarChart3, Package, Users, UserCheck, Building, Folder, Circle } from 'lucide-vue-next'

const {
  settings,
  loadSettings,
  saveSettings,
  updateSetting,
  resetSettings
} = useSettings()

const { success, error } = useToast()

// Estado local
const localSettings = reactive({
  views: {
    dashboard: true,
    productos: true,
    customers: true,
    users: true,
    sucursales: true,
    categories: true,
    profile: true,
    settings: true
  }
})

// Métodos para manejar vistas
const getViewIcon = (viewName: string) => {
  const iconMap: Record<string, any> = {
    dashboard: BarChart3,
    productos: Package,
    customers: Users,
    users: UserCheck,
    sucursales: Building,
    categories: Folder,
    profile: User,
    settings: Settings
  }
  return iconMap[viewName] || Circle
}

const getViewDisplayName = (viewName: string) => {
  const nameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    productos: 'Productos',
    customers: 'Clientes',
    users: 'Usuarios',
    sucursales: 'Sucursales',
    categories: 'Categorías',
    profile: 'Perfil',
    settings: 'Configuraciones'
  }
  return nameMap[viewName] || viewName
}

const getViewDescription = (viewName: string) => {
  const descriptionMap: Record<string, string> = {
    dashboard: 'Panel principal con estadísticas y métricas del sistema',
    productos: 'Gestión completa de productos e inventario',
    customers: 'Administración de clientes y sus datos',
    users: 'Gestión de usuarios del sistema y permisos',
    sucursales: 'Administración de sucursales y ubicaciones',
    categories: 'Gestión de categorías de productos',
    profile: 'Información personal del usuario logueado',
    settings: 'Configuraciones del sistema y personalización'
  }
  return descriptionMap[viewName] || 'Funcionalidad del sistema'
}

const updateViewSetting = (viewName: string) => {
  updateSetting('views', localSettings.views)
}

// Acciones rápidas
const enableAllViews = () => {
  Object.keys(localSettings.views).forEach(key => {
    localSettings.views[key] = true
  })
  updateSetting('views', localSettings.views)
  success('Vistas', 'Todas las vistas han sido activadas')
}

const disableAllViews = () => {
  Object.keys(localSettings.views).forEach(key => {
    localSettings.views[key] = false
  })
  updateSetting('views', localSettings.views)
  success('Vistas', 'Todas las vistas han sido desactivadas')
}

const enableBasicViews = () => {
  // Solo vistas básicas para usuarios regulares
  localSettings.views.dashboard = true
  localSettings.views.productos = true
  localSettings.views.customers = true
  localSettings.views.categories = true
  localSettings.views.profile = true
  localSettings.views.users = false
  localSettings.views.sucursales = false
  localSettings.views.settings = false
  updateSetting('views', localSettings.views)
  success('Vistas', 'Configuración básica aplicada')
}

const enableAdminViews = () => {
  // Todas las vistas para administradores
  Object.keys(localSettings.views).forEach(key => {
    localSettings.views[key] = true
  })
  updateSetting('views', localSettings.views)
  success('Vistas', 'Configuración de administrador aplicada')
}

const saveViewSettings = () => {
  saveSettings()
  success('Vistas', 'Configuración de vistas guardada exitosamente')
}

const resetViewSettings = () => {
  resetSettings()
  Object.assign(localSettings, settings.value)
  success('Vistas', 'Configuración de vistas restablecida')
}

onMounted(() => {
  loadSettings()
  Object.assign(localSettings, settings.value)
})
</script>

<style scoped>
.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  border: 1px solid #c7d2fe;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #3730a3;
  margin: 0;
}

.info-content p {
  color: #4338ca;
  margin: 0;
  line-height: 1.6;
}

.views-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.actions-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-icon {
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.header-text p {
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0.25rem 0 0 0;
}

.card-content {
  padding: 1.5rem;
}

/* Tabla de Vistas */
.views-table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
}

.views-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.views-table thead {
  background: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 10;
}

.views-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.views-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
  white-space: nowrap;
}

.view-row:hover {
  background: #f8fafc;
  transition: background-color 0.2s ease;
}

.view-name-cell {
  min-width: 200px;
}

.view-name-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #f8fafc;
  border-radius: 8px;
  color: #667eea;
  flex-shrink: 0;
}

.view-name-text {
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}

.view-description-cell {
  min-width: 300px;
  color: #64748b;
  font-size: 0.875rem;
  white-space: normal;
}

.view-status-cell {
  min-width: 100px;
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.active {
  background: #10b981;
  color: white;
}

.status-badge.inactive {
  background: #ef4444;
  color: white;
}

.view-actions-cell {
  min-width: 80px;
  text-align: center;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  display: block;
  width: 3rem;
  height: 1.5rem;
  background: #d1d5db;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.toggle-label:hover {
  background: #9ca3af;
}

.toggle-slider {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-label {
  background: #667eea;
}

.toggle-input:checked + .toggle-label .toggle-slider {
  transform: translateX(1.5rem);
}

.toggle-input:focus + .toggle-label {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

/* Acciones Rápidas */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Dark mode */
.dark .info-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-color: #475569;
}

.dark .info-header h3 {
  color: #60a5fa;
}

.dark .info-content p {
  color: #93c5fd;
}

.dark .views-card,
.dark .actions-card {
  background: #1e293b;
}

.dark .views-table-container {
  border-color: #334155;
}

.dark .views-table {
  background: #1e293b;
}

.dark .views-table thead {
  background: #334155;
}

.dark .views-table th {
  color: #f1f5f9;
  border-bottom-color: #475569;
}

.dark .views-table td {
  border-bottom-color: #475569;
}

.dark .view-row:hover {
  background: #334155;
}

.dark .view-icon {
  background: #334155;
  color: #60a5fa;
}

.dark .view-name-text {
  color: #f1f5f9;
}

.dark .view-description-cell {
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .views-table-container {
    font-size: 0.75rem;
  }
  
  .views-table th,
  .views-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .view-name-content {
    gap: 0.5rem;
  }
  
  .view-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
