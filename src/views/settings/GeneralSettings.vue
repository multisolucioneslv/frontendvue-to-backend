<template>
  <SettingsPage
    title="Configuración General"
    subtitle="Personaliza la experiencia básica del sistema"
    :icon="Settings"
    :show-reset="true"
    :show-save="true"
    @save="saveGeneralSettings"
    @reset="resetGeneralSettings"
  >
    <div class="settings-grid">
      <!-- Configuración de Fuentes -->
      <Card class="settings-card font-config-container">
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

          <!-- Vista Previa -->
          <div class="setting-group">
            <Label class="setting-label">Vista Previa</Label>
            <div class="font-preview-text" :style="{ 
              fontFamily: localSettings.fontFamily, 
              fontSize: `${localSettings.fontSize}px` 
            }">
              Este es un texto de ejemplo para ver cómo se verá la fuente seleccionada con el tamaño configurado.
            </div>
          </div>
        </div>
      </Card>

      <!-- Configuración de Experiencia -->
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
            <div class="experience-toggles">
              <div class="toggle-item">
                <div class="toggle-info">
                  <h4>Animaciones</h4>
                  <p>Habilita las transiciones y efectos visuales</p>
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

              <div class="toggle-item">
                <div class="toggle-info">
                  <h4>Sonidos</h4>
                  <p>Reproduce sonidos para las acciones del sistema</p>
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

              <div class="toggle-item">
                <div class="toggle-info">
                  <h4>Notificaciones</h4>
                  <p>Muestra notificaciones del sistema</p>
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
import Label from '@/components/ui/Label.vue'
import { Type, Settings } from 'lucide-vue-next'

const {
  settings,
  availableFonts,
  loadSettings,
  saveSettings,
  updateSetting,
  applySettings,
  resetSettings
} = useSettings()

const { success, error } = useToast()

// Estado local
const localSettings = reactive({
  fontFamily: 'Inter',
  fontSize: 16,
  animations: true,
  sounds: false,
  notifications: true
})

// Métodos
const updateFontFamily = () => {
  settings.value.fontFamily = localSettings.fontFamily
  applySettings()
}

const updateFontSize = () => {
  settings.value.fontSize = localSettings.fontSize
  applySettings()
}

const saveGeneralSettings = () => {
  updateSetting('fontFamily', localSettings.fontFamily)
  updateSetting('fontSize', localSettings.fontSize)
  updateSetting('animations', localSettings.animations)
  updateSetting('sounds', localSettings.sounds)
  updateSetting('notifications', localSettings.notifications)
  saveSettings()
  success('Configuración General', 'Configuraciones guardadas exitosamente')
}

const resetGeneralSettings = () => {
  resetSettings()
  Object.assign(localSettings, settings.value)
  success('Configuración General', 'Configuraciones restablecidas')
}

onMounted(() => {
  loadSettings()
  Object.assign(localSettings, settings.value)
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
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

/* Font Selector */
.font-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.font-select {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
}

.font-preview {
  width: 2.5rem;
  height: 2.5rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Font Size Control */
.font-size-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.size-display {
  min-width: 4rem;
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
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.size-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}

/* Experience Toggles */
.experience-toggles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.toggle-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #374151;
}

.toggle-info p {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
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

/* Font Config Container - Mantiene tamaño fijo */
.font-config-container {
  /* Fuerza el tamaño de fuente a 16px para este contenedor específico */
  font-size: 16px !important;
}

.font-config-container * {
  /* Asegura que todos los elementos dentro mantengan el tamaño base */
  font-size: inherit !important;
}

.font-config-container .setting-label {
  font-size: 0.875rem !important;
}

.font-config-container .header-text h3 {
  font-size: 1.25rem !important;
}

.font-config-container .header-text p {
  font-size: 0.875rem !important;
}

.font-config-container .toggle-info h4 {
  font-size: 0.875rem !important;
}

.font-config-container .toggle-info p {
  font-size: 0.75rem !important;
}

.font-config-container .size-display {
  font-size: 0.875rem !important;
}

.font-config-container .font-select {
  font-size: 0.875rem !important;
}

.font-config-container .font-preview {
  font-size: 1.25rem !important;
}

/* Vista Previa de Fuente - Mantiene tamaño fijo del contenedor */
.font-config-container .font-preview-text {
  padding: 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  line-height: 1.5;
  color: #374151;
  min-height: 3rem;
  display: flex;
  align-items: center;
  /* El texto dentro SÍ cambia de tamaño para mostrar la vista previa */
  /* pero el contenedor mantiene su tamaño fijo */
}

/* Dark mode */
.dark .settings-card {
  background: #1e293b;
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

.dark .font-config-container .font-preview-text {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

.dark .toggle-item {
  background: #334155;
}

.dark .toggle-info h4 {
  color: #f1f5f9;
}

.dark .toggle-info p {
  color: #94a3b8;
}
</style>
