<template>
  <div class="settings-container">
    <!-- Header -->
    <div class="settings-header">
      <div class="header-content">
        <h1 class="settings-title">Configuraciones</h1>
        <p class="settings-subtitle">Personaliza tu experiencia de usuario</p>
      </div>
      <div class="header-actions">
        <Button variant="outline" @click="resetAllSettings">
          <RotateCcw class="h-4 w-4 mr-2" />
          Restablecer
        </Button>
        <Button @click="saveAllSettings">
          <Save class="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>

    <!-- Settings Grid - Sistema de 12 columnas -->
    <div class="settings-container-grid">
      <!-- Primera fila: 3 bloques de 4 columnas cada uno -->
      <div class="settings-row">
        <!-- Configuración de Fuentes -->
        <div class="settings-col-4">
          <Card class="settings-card">
            <div class="card-header">
              <div class="header-icon">
                <Type class="h-6 w-6" />
              </div>
              <div class="header-text">
                <h3>Configuración de Fuentes</h3>
                <p>Personaliza la tipografía</p>
              </div>
            </div>
            
            <div class="card-content">
              <!-- Selección de Fuente -->
              <div class="setting-group">
                <Label class="setting-label">Familia de Fuente</Label>
                <div class="font-selector">
                  <select 
                    v-model="localSettings.fontFamily" 
                    @change="updateFontFamily"
                    class="font-select"
                  >
                    <option 
                      v-for="font in availableFonts" 
                      :key="font.value" 
                      :value="font.value"
                      :style="{ fontFamily: font.value }"
                    >
                      {{ font.name }}
                    </option>
                  </select>
                  <div class="font-preview" :style="{ fontFamily: localSettings.fontFamily }">
                    Aa
                  </div>
                </div>
              </div>

              <!-- Tamaño de Fuente -->
              <div class="setting-group">
                <Label class="setting-label">Tamaño</Label>
                <div class="font-size-control">
                  <div class="size-display">{{ localSettings.fontSize }}px</div>
                  <input 
                    type="range" 
                    v-model="localSettings.fontSize"
                    @input="updateFontSize"
                    min="12" 
                    max="24" 
                    step="1"
                    class="size-slider"
                  />
                </div>
              </div>
              
              <!-- Botón de guardar -->
              <div class="save-section">
                <Button @click="saveFontConfiguration" class="save-button">
                  <Save class="h-4 w-4 mr-2" />
                  Guardar Fuentes
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <!-- Configuración de Colores -->
        <div class="settings-col-4">
          <Card class="settings-card">
            <div class="card-header">
              <div class="header-icon">
                <Palette class="h-6 w-6" />
              </div>
              <div class="header-text">
                <h3>Configuración de Colores</h3>
                <p>Personaliza la paleta</p>
              </div>
            </div>
            
            <div class="card-content">
              <div class="setting-group">
                <Label class="setting-label">Esquema de Colores</Label>
                <div class="color-grid-compact">
                  <div 
                    v-for="color in availableColors" 
                    :key="color.id"
                    class="color-option-compact"
                    :class="{ active: isColorActive(color) }"
                    @click="selectColor(color)"
                  >
                    <div class="color-preview-compact">
                      <div class="color-primary" :style="{ backgroundColor: color.primary }"></div>
                      <div class="color-secondary" :style="{ backgroundColor: color.secondary }"></div>
                    </div>
                    <span class="color-name-compact">{{ color.name }}</span>
                    <button 
                      v-if="color.editable"
                      @click.stop="openColorEditModal(color)"
                      class="edit-color-btn-compact"
                      title="Editar colores"
                    >
                      <Settings class="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Botón de guardar -->
              <div class="save-section">
                <Button @click="saveColorConfiguration" class="save-button">
                  <Save class="h-4 w-4 mr-2" />
                  Guardar Colores
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <!-- Configuración de Experiencia -->
        <div class="settings-col-4">
          <Card class="settings-card">
            <div class="card-header">
              <div class="header-icon">
                <Settings class="h-6 w-6" />
              </div>
              <div class="header-text">
                <h3>Configuración de Experiencia</h3>
                <p>Personaliza la experiencia</p>
              </div>
            </div>
            
            <div class="card-content">
              <div class="setting-group">
                <div class="experience-toggles-compact">
                  <div class="toggle-item-compact">
                    <div class="toggle-info-compact">
                      <h4>Animaciones</h4>
                    </div>
                    <div class="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="animations"
                        v-model="localSettings.animations"
                        @change="updateSetting('animations', localSettings.animations)"
                        class="toggle-input"
                      />
                      <label for="animations" class="toggle-label">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div class="toggle-item-compact">
                    <div class="toggle-info-compact">
                      <h4>Sonidos</h4>
                    </div>
                    <div class="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="sounds"
                        v-model="localSettings.sounds"
                        @change="updateSetting('sounds', localSettings.sounds)"
                        class="toggle-input"
                      />
                      <label for="sounds" class="toggle-label">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div class="toggle-item-compact">
                    <div class="toggle-info-compact">
                      <h4>Notificaciones</h4>
                    </div>
                    <div class="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="notifications"
                        v-model="localSettings.notifications"
                        @change="updateSetting('notifications', localSettings.notifications)"
                        class="toggle-input"
                      />
                      <label for="notifications" class="toggle-label">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Botón de guardar -->
              <div class="save-section">
                <Button @click="saveExperienceConfiguration" class="save-button">
                  <Save class="h-4 w-4 mr-2" />
                  Guardar Experiencia
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Segunda fila: Bloque completo de 12 columnas para tabla de vistas -->
      <div class="settings-row-full">
        <Card class="settings-card-full">
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
            <!-- Debug temporal -->
            <div v-if="Object.keys(localSettings.views).length === 0" class="debug-info">
              <p>⚠️ No hay vistas configuradas</p>
            </div>
            
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
            
            <!-- Botón de guardar específico para vistas -->
            <div class="save-section-full">
              <Button @click="saveViewConfiguration" class="save-button">
                <Save class="h-4 w-4 mr-2" />
                Guardar Configuración de Vistas
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Modal para Fuente Personalizada -->
    <Dialog :open="showCustomFontModal" @update:open="showCustomFontModal = $event" title="Agregar Fuente Personalizada">
      <div class="custom-font-modal">
        <div class="modal-content">
          <div class="input-group">
            <Label>Nombre de la Fuente</Label>
            <Input v-model="customFontName" placeholder="Ej: Mi Fuente Personalizada" />
          </div>
          
          <div class="input-group">
            <Label>URL de Google Fonts</Label>
            <Input v-model="customFontUrl" placeholder="https://fonts.googleapis.com/css2?family=..." />
          </div>
          
          <div class="font-preview-section" v-if="customFontName">
            <Label>Vista Previa</Label>
            <div class="font-preview-text" :style="{ fontFamily: customFontName }">
              Texto de ejemplo con {{ customFontName }}
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <Button variant="outline" @click="showCustomFontModal = false">
            Cancelar
          </Button>
          <Button @click="addCustomFont" :disabled="!customFontName || !customFontUrl">
            Agregar Fuente
          </Button>
        </div>
      </div>
    </Dialog>

    <!-- Modal para Editar Color -->
    <Dialog :open="showColorEditModal" @update:open="showColorEditModal = $event" title="Editar Color Preconfigurado">
      <div class="color-edit-modal">
        <div class="modal-content">
          <div class="input-group">
            <Label>Color Primario (Sidebar)</Label>
            <input 
              type="color" 
              v-model="editingPrimaryColor"
              class="color-input"
            />
            <div class="color-preview-text">
              Color actual: {{ editingPrimaryColor }}
            </div>
          </div>
          
          <div class="input-group">
            <Label>Color Secundario (Navbar)</Label>
            <input 
              type="color" 
              v-model="editingSecondaryColor"
              class="color-input"
            />
            <div class="color-preview-text">
              Color actual: {{ editingSecondaryColor }}
            </div>
          </div>
          
          <div class="color-preview-section">
            <Label>Vista Previa</Label>
            <div class="preview-container">
              <div class="preview-sidebar" :style="{ backgroundColor: editingPrimaryColor }">
                Sidebar
              </div>
              <div class="preview-navbar" :style="{ backgroundColor: editingSecondaryColor }">
                Navbar
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <Button variant="outline" @click="cancelColorEdit">
            Cancelar
          </Button>
          <Button @click="saveEditedColor">
            Guardar Cambios
          </Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { useToast } from '@/composables/useToast'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Dialog from '@/components/ui/Dialog.vue'
import { 
  Type, 
  Palette, 
  Eye, 
  Settings, 
  Plus, 
  Save, 
  RotateCcw,
  BarChart3,
  Package,
  Users,
  UserCheck,
  Building,
  Folder,
  User,
  Circle
} from 'lucide-vue-next'

const { 
  settings, 
  availableFonts, 
  availableColors, 
  loadSettings, 
  saveSettings,
  saveFontSettings,
  saveColorSettings,
  saveViewSettings,
  saveExperienceSettings,
  addCustomFont: addFont,
  updateSetting,
  updatePredefinedColor,
  getColorById,
  toggleView,
  applyViewChanges,
  applyAllViewSettings,
  resetSettings,
  applySettings,
  applyDefaultsIfFirstTime
} = useSettings()

const { success, error } = useToast()

// Estado local para evitar cambios inmediatos
const localSettings = reactive({
  fontFamily: 'Inter',
  fontSize: 16,
  primaryColor: '#ffffff',
  secondaryColor: '#f8fafc',
  views: {
    dashboard: true,
    productos: true,
    customers: true,
    users: true,
    sucursales: true,
    categories: true,
    profile: true,
    settings: true
  },
  theme: 'light',
  animations: true,
  sounds: false,
  notifications: true
})

// Estado del modal
const showCustomFontModal = ref(false)
const customFontName = ref('')
const customFontUrl = ref('')
const customPrimaryColor = ref('#ffffff')
const customSecondaryColor = ref('#f8fafc')

// Estado para editar colores preconfigurados
const editingColorId = ref('')
const editingPrimaryColor = ref('')
const editingSecondaryColor = ref('')
const showColorEditModal = ref(false)

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
    dashboard: 'Panel principal con estadísticas y métricas',
    productos: 'Gestión de productos e inventario',
    customers: 'Administración de clientes',
    users: 'Gestión de usuarios del sistema',
    sucursales: 'Administración de sucursales',
    categories: 'Gestión de categorías de productos',
    profile: 'Información personal del usuario',
    settings: 'Configuraciones del sistema'
  }
  return descriptionMap[viewName] || 'Funcionalidad del sistema'
}

const updateViewSetting = (viewName: string) => {
  updateSetting('views', localSettings.views)
}

// Métodos
const updateFontFamily = () => {
  // Actualizar directamente en settings y aplicar inmediatamente
  settings.value.fontFamily = localSettings.fontFamily
  applySettings()
  console.log('Fuente actualizada:', localSettings.fontFamily)
}

const updateFontSize = () => {
  // Actualizar directamente en settings y aplicar inmediatamente
  settings.value.fontSize = localSettings.fontSize
  applySettings()
  console.log('Tamaño actualizado:', localSettings.fontSize)
}

const saveFontConfiguration = () => {
  updateSetting('fontFamily', localSettings.fontFamily)
  updateSetting('fontSize', localSettings.fontSize)
  saveFontSettings()
  success('Fuentes', `Configuración de fuentes guardada permanentemente`)
}

const selectColor = (color: any) => {
  localSettings.primaryColor = color.primary
  localSettings.secondaryColor = color.secondary
  
  // Aplicar colores inmediatamente
  settings.value.primaryColor = color.primary
  settings.value.secondaryColor = color.secondary
  applySettings()
  
  success('Colores', `Esquema cambiado a ${color.name}`)
}

// Función para abrir modal de edición de color
const openColorEditModal = (color: any) => {
  if (color.editable) {
    editingColorId.value = color.id
    editingPrimaryColor.value = color.primary
    editingSecondaryColor.value = color.secondary
    showColorEditModal.value = true
  }
}

// Función para guardar color editado
const saveEditedColor = () => {
  if (editingColorId.value) {
    updatePredefinedColor(editingColorId.value, editingPrimaryColor.value, editingSecondaryColor.value)
    success('Colores', `Color ${editingColorId.value} actualizado exitosamente`)
    showColorEditModal.value = false
    editingColorId.value = ''
    editingPrimaryColor.value = ''
    editingSecondaryColor.value = ''
  }
}

// Función para cancelar edición
const cancelColorEdit = () => {
  showColorEditModal.value = false
  editingColorId.value = ''
  editingPrimaryColor.value = ''
  editingSecondaryColor.value = ''
}

const isColorActive = (color: any) => {
  return localSettings.primaryColor === color.primary && 
         localSettings.secondaryColor === color.secondary
}

const updateCustomPrimaryColor = () => {
  localSettings.primaryColor = customPrimaryColor.value
  
  // Aplicar color inmediatamente
  settings.value.primaryColor = customPrimaryColor.value
  applySettings()
}

const updateCustomSecondaryColor = () => {
  localSettings.secondaryColor = customSecondaryColor.value
  
  // Aplicar color inmediatamente
  settings.value.secondaryColor = customSecondaryColor.value
  applySettings()
}

const saveColorConfiguration = () => {
  updateSetting('primaryColor', localSettings.primaryColor)
  updateSetting('secondaryColor', localSettings.secondaryColor)
  saveColorSettings()
  success('Colores', `Configuración de colores guardada permanentemente`)
}

const saveViewConfiguration = () => {
  saveViewSettings()
  success('Vistas', `Configuración de vistas guardada permanentemente`)
}

const saveExperienceConfiguration = () => {
  updateSetting('animations', localSettings.animations)
  updateSetting('sounds', localSettings.sounds)
  updateSetting('notifications', localSettings.notifications)
  saveExperienceSettings()
  success('Experiencia', `Configuración de experiencia guardada permanentemente`)
}

const addCustomFont = () => {
  try {
    addFont(customFontName.value, customFontUrl.value)
    success('Fuente', `Fuente ${customFontName.value} agregada exitosamente`)
    showCustomFontModal.value = false
    customFontName.value = ''
    customFontUrl.value = ''
  } catch (err) {
    error('Error', 'No se pudo agregar la fuente personalizada')
  }
}

const saveAllSettings = () => {
  saveSettings()
  success('Configuraciones', 'Todas las configuraciones han sido guardadas')
}

const resetAllSettings = () => {
  resetSettings()
  // Actualizar estado local
  Object.assign(localSettings, settings.value)
  success('Configuraciones', 'Configuraciones restablecidas a valores por defecto')
}

onMounted(() => {
  // Aplicar valores por defecto si es la primera vez
  applyDefaultsIfFirstTime()
  
  // Cargar configuraciones
  loadSettings()
  
  // Sincronizar estado local con configuraciones cargadas
  Object.assign(localSettings, settings.value)
  customPrimaryColor.value = localSettings.primaryColor
  customSecondaryColor.value = localSettings.secondaryColor
  
  // Debug temporal
  console.log('localSettings.views:', localSettings.views)
  console.log('Object.keys(localSettings.views):', Object.keys(localSettings.views))
  console.log('localSettings.views length:', Object.keys(localSettings.views).length)
})
</script>

<style scoped>
.settings-container {
  width: 100%;
  margin: 0;
  padding: 0;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
  width: 100%;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-content p {
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Settings Grid - Sistema de 12 columnas */
.settings-container-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
}

.settings-row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.settings-col-4 {
  grid-column: span 4;
}

.settings-row-full {
  display: grid;
  grid-template-columns: 1fr;
}

.settings-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.settings-card-full {
  width: 100%;
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
  flex: 1;
  display: flex;
  flex-direction: column;
}

.setting-group {
  margin-bottom: 1rem;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

/* Font Selector Compacto */
.font-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.font-select {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
}

.font-preview {
  width: 2rem;
  height: 2rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
}

/* Font Size Control Compacto */
.font-size-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.size-display {
  min-width: 3rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: #667eea;
}

.size-slider {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
}

.size-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.size-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}

/* Color Grid Compacto */
.color-grid-compact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.color-option-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.color-option-compact:hover {
  border-color: #667eea;
  transform: translateY(-1px);
}

.color-option-compact.active {
  border-color: #667eea;
  box-shadow: 0 0 0 1px #667eea;
}

.color-preview-compact {
  display: flex;
  width: 100%;
  height: 1.5rem;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.color-primary,
.color-secondary {
  flex: 1;
}

.color-name-compact {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.25rem;
}

.edit-color-btn-compact {
  padding: 0.25rem;
  background: #f8fafc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-color-btn-compact:hover {
  background: #667eea;
  color: white;
}

/* Experience Toggles Compacto */
.experience-toggles-compact {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toggle-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
}

.toggle-info-compact h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

/* Save Section Compacto */
.save-section {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.save-section-full {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.save-button {
  width: 100%;
  justify-content: center;
}

/* Tabla de Vistas */
.views-table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  min-height: 400px; /* Altura mínima para ocupar espacio */
  background: white;
}

.views-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-height: 300px; /* Altura mínima de la tabla */
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
  white-space: normal; /* Permitir salto de línea en descripciones */
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

/* Debug info */
.debug-info {
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.debug-info p {
  margin: 0;
  color: #92400e;
  font-weight: 600;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .settings-container-grid {
    padding: 0.75rem;
  }
  
  .settings-row {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .settings-col-4 {
    grid-column: span 6;
  }
}

@media (max-width: 768px) {
  .settings-container-grid {
    padding: 0.5rem;
  }
  
  .settings-header {
    padding: 0.5rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .settings-row {
    grid-template-columns: 1fr;
  }
  
  .settings-col-4 {
    grid-column: span 1;
  }
  
  .color-grid-compact {
    grid-template-columns: 1fr;
  }
  
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
}

/* Configuración de Colores */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-option:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.color-option.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.color-preview {
  display: flex;
  gap: 2px;
  border-radius: 8px;
  overflow: hidden;
}

.color-primary,
.color-secondary {
  width: 20px;
  height: 20px;
}

.color-name {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.custom-colors {
  margin-top: 2rem;
}

.custom-color-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.color-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-input {
  width: 100%;
  height: 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
}

/* Configuración de Vistas */
.views-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.view-toggle {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.view-toggle:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.toggle-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.toggle-info p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
}

.toggle-input {
  display: none;
}

.toggle-label {
  display: block;
  width: 3rem;
  height: 1.5rem;
  background: #e2e8f0;
  border-radius: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-input:checked + .toggle-label {
  background: #667eea;
}

.toggle-input:checked + .toggle-label .toggle-slider {
  transform: translateX(1.5rem);
}

/* Configuración de Experiencia */
.experience-toggles {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
}

.toggle-item:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.toggle-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.toggle-item p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Modal */
.custom-font-modal {
  padding: 1rem;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.font-preview-section {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.font-preview-text {
  font-size: 1.25rem;
  margin-top: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Save sections */
.save-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  display: flex;
  justify-content: center;
}

.save-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Dark mode support */
.dark .settings-card {
  background: #1e293b;
}

.dark .save-section {
  border-top-color: #334155;
}

.dark .card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dark .settings-title {
  color: #f1f5f9;
}

.dark .settings-subtitle {
  color: #94a3b8;
}

.dark .setting-label {
  color: #f1f5f9;
}

.dark .font-select {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

.dark .font-preview {
  background: #334155;
  border-color: #475569;
}

.dark .font-size-preview {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

.dark .color-option {
  border-color: #334155;
}

.dark .color-option:hover {
  border-color: #667eea;
}

.dark .color-option.active {
  background: #1e293b;
}

.dark .view-toggle {
  border-color: #334155;
}

.dark .view-toggle:hover {
  border-color: #667eea;
  background: #1e293b;
}

.dark .toggle-info h4 {
  color: #f1f5f9;
}

.dark .toggle-info p {
  color: #94a3b8;
}

.dark .toggle-item {
  border-color: #334155;
}

.dark .toggle-item:hover {
  border-color: #667eea;
  background: #1e293b;
}

.dark .toggle-item h4 {
  color: #f1f5f9;
}

.dark .toggle-item p {
  color: #94a3b8;
}

.dark .font-preview-section {
  background: #334155;
  border-color: #475569;
}

.dark .font-preview-text {
  color: #f1f5f9;
}

/* Estilos para edición de colores */
.color-actions {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-color-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-color-btn:hover {
  background: #5a67d8;
  transform: scale(1.1);
}

.non-editable-label {
  font-size: 0.65rem;
  color: #64748b;
  font-style: italic;
}

/* Modal de edición de colores */
.color-edit-modal {
  padding: 1rem;
}

.color-preview-text {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.color-preview-section {
  margin-top: 1.5rem;
}

.preview-container {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.preview-sidebar,
.preview-navbar {
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.preview-sidebar {
  background: var(--preview-primary, #667eea);
}

.preview-navbar {
  background: var(--preview-secondary, #764ba2);
}

/* Dark mode para nuevos elementos */
.dark .non-editable-label {
  color: #94a3b8;
}

.dark .color-preview-text {
  color: #94a3b8;
}
</style>
