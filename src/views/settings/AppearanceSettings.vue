<template>
  <SettingsPage
    title="Configuración de Apariencia"
    subtitle="Personaliza los temas y colores del sistema con PrimeVue"
    :icon="Palette"
    :show-reset="true"
    :show-save="true"
    @save="saveAppearanceSettings"
    @reset="resetAppearanceSettings"
  >
    <div class="settings-grid">
      <!-- Configuración de Temas PrimeVue -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <Palette class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Temas PrimeVue</h3>
            <p>Selecciona un tema predefinido</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="setting-group">
            <Label class="setting-label">Tema Actual</Label>
            <Select
              v-model="selectedTheme"
              :options="availableThemes"
              option-label="name"
              option-value="value"
              placeholder="Selecciona un tema"
              class="theme-selector"
              @change="applyTheme"
            />
            <p class="theme-description">{{ currentThemeDescription }}</p>
          </div>

          <div class="setting-group">
            <Label class="setting-label">Modo de Color</Label>
            <div class="mode-options">
              <div 
                v-for="mode in colorModes" 
                :key="mode.value"
                class="mode-option"
                :class="{ active: selectedColorMode === mode.value }"
                @click="selectColorMode(mode.value)"
              >
                <div class="mode-icon">
                  <component :is="mode.icon" class="h-5 w-5" />
                </div>
                <span class="mode-name">{{ mode.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Personalización Avanzada -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <Settings class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Personalización Avanzada</h3>
            <p>Configura colores y estilos personalizados</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="setting-group">
            <Label class="setting-label">Color Primario</Label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="customColors.primary"
                @change="updateCustomColors"
                class="color-input"
              />
              <InputMask
                v-model="customColors.primary"
                mask="aaaaaa"
                placeholder="#000000"
                class="color-text-input"
                @change="updateCustomColors"
              />
            </div>
          </div>

          <div class="setting-group">
            <Label class="setting-label">Color Secundario</Label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="customColors.secondary"
                @change="updateCustomColors"
                class="color-input"
              />
              <InputMask
                v-model="customColors.secondary"
                mask="aaaaaa"
                placeholder="#000000"
                class="color-text-input"
                @change="updateCustomColors"
              />
            </div>
          </div>

          <div class="setting-group">
            <Label class="setting-label">Color de Acento</Label>
            <div class="color-input-group">
              <input
                type="color"
                v-model="customColors.accent"
                @change="updateCustomColors"
                class="color-input"
              />
              <InputMask
                v-model="customColors.accent"
                mask="aaaaaa"
                placeholder="#000000"
                class="color-text-input"
                @change="updateCustomColors"
              />
            </div>
          </div>
        </div>
      </Card>

      <!-- Vista Previa -->
      <Card class="settings-card preview-card">
        <div class="card-header">
          <div class="header-icon">
            <Eye class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Vista Previa</h3>
            <p>Ve cómo se verán los cambios</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="preview-container">
            <!-- Componentes PrimeVue de ejemplo -->
            <div class="preview-section">
              <h4>Componentes PrimeVue</h4>
              <div class="preview-components">
                <Select
                  :options="previewOptions"
                  placeholder="Selector de ejemplo"
                  class="preview-select"
                />
                <InputMask
                  mask="(999) 999-9999"
                  placeholder="(999) 999-9999"
                  class="preview-input"
                />
                <Button label="Botón de ejemplo" class="preview-button" />
              </div>
            </div>

            <!-- Vista previa del layout -->
            <div class="preview-section">
              <h4>Layout Preview</h4>
              <div class="layout-preview">
                <div class="preview-sidebar" :style="{ backgroundColor: previewColors.primary }">
                  <div class="preview-menu">
                    <div class="preview-menu-item">Dashboard</div>
                    <div class="preview-menu-item">Productos</div>
                    <div class="preview-menu-item">Clientes</div>
                  </div>
                </div>
                <div class="preview-main">
                  <div class="preview-navbar" :style="{ backgroundColor: previewColors.secondary }">
                    <span>Navbar</span>
                  </div>
                  <div class="preview-content">
                    <div class="preview-card">
                      <h4>Contenido Principal</h4>
                      <p>Vista previa del tema aplicado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Información del Tema -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <Info class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Información del Tema</h3>
            <p>Detalles sobre la configuración actual</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="theme-info">
            <div class="info-item">
              <span class="info-label">Tema:</span>
              <span class="info-value">{{ currentThemeName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Modo:</span>
              <span class="info-value">{{ selectedColorMode }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Versión PrimeVue:</span>
              <span class="info-value">4.4.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">Última actualización:</span>
              <span class="info-value">{{ lastUpdate }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </SettingsPage>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { useToast } from '@/composables/useToast'
import SettingsPage from '@/components/ui/SettingsPage.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Label from '@/components/ui/Label.vue'
import { Palette, Eye, Settings, Info, Sun, Moon, Monitor } from 'lucide-vue-next'

const {
  settings,
  loadSettings,
  saveSettings,
  updateSetting,
  applySettings,
  resetSettings
} = useSettings()

const { success, error } = useToast()

// Estado para temas PrimeVue
const selectedTheme = ref('default')
const selectedColorMode = ref('light')

// Temas disponibles de PrimeVue
const availableThemes = [
  { name: 'Tema Predeterminado', value: 'default', description: 'Tema por defecto de PrimeVue' },
  { name: 'Tema Azul', value: 'blue', description: 'Tema con colores azules' },
  { name: 'Tema Verde', value: 'green', description: 'Tema con colores verdes' },
  { name: 'Tema Púrpura', value: 'purple', description: 'Tema con colores púrpura' },
  { name: 'Tema Rojo', value: 'red', description: 'Tema con colores rojos' },
  { name: 'Tema Naranja', value: 'orange', description: 'Tema con colores naranjas' }
]

// Modos de color
const colorModes = [
  { name: 'Claro', value: 'light', icon: Sun },
  { name: 'Oscuro', value: 'dark', icon: Moon },
  { name: 'Automático', value: 'auto', icon: Monitor }
]

// Colores personalizados
const customColors = reactive({
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#8b5cf6'
})

// Opciones para vista previa
const previewOptions = [
  { label: 'Opción 1', value: '1' },
  { label: 'Opción 2', value: '2' },
  { label: 'Opción 3', value: '3' }
]

// Computed properties
const currentThemeName = computed(() => {
  const theme = availableThemes.find(t => t.value === selectedTheme.value)
  return theme ? theme.name : 'Tema Desconocido'
})

const currentThemeDescription = computed(() => {
  const theme = availableThemes.find(t => t.value === selectedTheme.value)
  return theme ? theme.description : ''
})

const previewColors = computed(() => ({
  primary: customColors.primary,
  secondary: customColors.secondary,
  accent: customColors.accent
}))

const lastUpdate = computed(() => {
  return new Date().toLocaleDateString('es-ES')
})

// Métodos
const applyTheme = () => {
  // Aplicar tema seleccionado
  const root = document.documentElement
  
  // Limpiar clases de tema anteriores
  root.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-red', 'theme-orange')
  
  if (selectedTheme.value !== 'default') {
    root.classList.add(`theme-${selectedTheme.value}`)
  }
  
  // Aplicar modo de color
  applyColorMode()
  
  success('Tema', `Tema ${currentThemeName.value} aplicado exitosamente`)
}

const selectColorMode = (mode: string) => {
  selectedColorMode.value = mode
  applyColorMode()
  success('Modo', `Modo ${mode} aplicado`)
}

const applyColorMode = () => {
  const root = document.documentElement
  
  // Remover clases de modo anteriores
  root.classList.remove('light', 'dark')
  
  if (selectedColorMode.value === 'auto') {
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.add(prefersDark ? 'dark' : 'light')
  } else {
    root.classList.add(selectedColorMode.value)
  }
}

const updateCustomColors = () => {
  // Aplicar colores personalizados como variables CSS
  const root = document.documentElement
  root.style.setProperty('--primary-color', customColors.primary)
  root.style.setProperty('--secondary-color', customColors.secondary)
  root.style.setProperty('--accent-color', customColors.accent)
  
  // Actualizar configuración
  updateSetting('customPrimaryColor', customColors.primary)
  updateSetting('customSecondaryColor', customColors.secondary)
  updateSetting('customAccentColor', customColors.accent)
}

const saveAppearanceSettings = () => {
  // Guardar configuración actual
  updateSetting('selectedTheme', selectedTheme.value)
  updateSetting('selectedColorMode', selectedColorMode.value)
  updateSetting('customColors', { ...customColors })
  
  saveSettings()
  success('Apariencia', 'Configuración de apariencia guardada exitosamente')
}

const resetAppearanceSettings = () => {
  // Restablecer a valores por defecto
  selectedTheme.value = 'default'
  selectedColorMode.value = 'light'
  customColors.primary = '#3b82f6'
  customColors.secondary = '#64748b'
  customColors.accent = '#8b5cf6'
  
  // Aplicar configuración por defecto
  applyTheme()
  updateCustomColors()
  
  success('Apariencia', 'Configuración de apariencia restablecida')
}

onMounted(() => {
  loadSettings()
  
  // Cargar configuración guardada
  selectedTheme.value = settings.value.selectedTheme || 'default'
  selectedColorMode.value = settings.value.selectedColorMode || 'light'
  
  if (settings.value.customColors) {
    customColors.primary = settings.value.customColors.primary || '#3b82f6'
    customColors.secondary = settings.value.customColors.secondary || '#64748b'
    customColors.accent = settings.value.customColors.accent || '#8b5cf6'
  }
  
  // Aplicar configuración al cargar
  applyTheme()
  updateCustomColors()
})
</script>

<style scoped>
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.settings-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.preview-card {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-color, #3b82f6) 0%, var(--secondary-color, #64748b) 100%);
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

.setting-group {
  margin-bottom: 1.5rem;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.theme-description {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
  font-style: italic;
}

/* Theme Selector */
.theme-selector {
  width: 100%;
  margin-bottom: 0.5rem;
}

/* Mode Options */
.mode-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.mode-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.mode-option:hover {
  border-color: var(--primary-color, #3b82f6);
  transform: translateY(-2px);
}

.mode-option.active {
  border-color: var(--primary-color, #3b82f6);
  background: rgba(59, 130, 246, 0.05);
}

.mode-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.mode-option.active .mode-icon {
  background: var(--primary-color, #3b82f6);
  color: white;
}

.mode-name {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

/* Color Input Groups */
.color-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-input {
  width: 3rem;
  height: 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
}

.color-text-input {
  flex: 1;
}

/* Preview Container */
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-section {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.preview-section h4 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.preview-components {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-select,
.preview-input {
  width: 100%;
}

.preview-button {
  align-self: flex-start;
}

/* Layout Preview */
.layout-preview {
  display: flex;
  gap: 1rem;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.preview-sidebar {
  width: 120px;
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-menu-item {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 0.75rem;
  text-align: center;
}

.preview-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.preview-navbar {
  height: 40px;
  padding: 0.5rem 1rem;
  color: white;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.preview-content {
  flex: 1;
  padding: 1rem;
  background: #f8fafc;
}

.preview-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.preview-card p {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
}

/* Theme Info */
.theme-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.info-value {
  color: #64748b;
  font-size: 0.875rem;
  font-family: monospace;
}

/* Dark mode */
.dark .settings-card {
  background: #1e293b;
}

.dark .setting-label {
  color: #f1f5f9;
}

.dark .theme-description {
  color: #94a3b8;
}

.dark .mode-option {
  background: #1e293b;
  border-color: #334155;
}

.dark .mode-icon {
  background: #334155;
  color: #94a3b8;
}

.dark .preview-section {
  border-color: #334155;
}

.dark .preview-section h4 {
  color: #f1f5f9;
}

.dark .preview-content {
  background: #334155;
}

.dark .preview-card {
  background: #1e293b;
}

.dark .preview-card h4 {
  color: #f1f5f9;
}

.dark .preview-card p {
  color: #94a3b8;
}

.dark .info-item {
  border-color: #334155;
}

.dark .info-label {
  color: #f1f5f9;
}

.dark .info-value {
  color: #94a3b8;
}

/* Theme Classes */
.theme-blue {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
}

.theme-green {
  --primary-color: #10b981;
  --secondary-color: #047857;
}

.theme-purple {
  --primary-color: #8b5cf6;
  --secondary-color: #7c3aed;
}

.theme-red {
  --primary-color: #ef4444;
  --secondary-color: #dc2626;
}

.theme-orange {
  --primary-color: #f97316;
  --secondary-color: #ea580c;
}
</style>
