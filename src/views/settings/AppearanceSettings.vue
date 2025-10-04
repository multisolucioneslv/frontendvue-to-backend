<template>
  <SettingsPage
    title="Configuración de Apariencia"
    subtitle="Personaliza los colores y temas del sistema"
    :icon="Palette"
    :show-reset="true"
    :show-save="true"
    @save="saveAppearanceSettings"
    @reset="resetAppearanceSettings"
  >
    <div class="settings-grid">
      <!-- Configuración de Colores -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <Palette class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Configuración de Colores</h3>
            <p>Personaliza la paleta de colores</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="setting-group">
            <Label class="setting-label">Esquema de Colores</Label>
            <div class="color-grid">
              <div 
                v-for="color in availableColors" 
                :key="color.id"
                class="color-option"
                :class="{ active: isColorActive(color) }"
                @click="selectColor(color)"
              >
                <div class="color-preview">
                  <div class="color-primary" :style="{ backgroundColor: color.primary }"></div>
                  <div class="color-secondary" :style="{ backgroundColor: color.secondary }"></div>
                </div>
                <span class="color-name">{{ color.name }}</span>
                <button 
                  v-if="color.editable"
                  @click.stop="openColorEditModal(color)"
                  class="edit-color-btn"
                  title="Editar colores"
                >
                  <Settings class="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- Colores Personalizados -->
          <div class="setting-group">
            <Label class="setting-label">Colores Personalizados</Label>
            <div class="custom-colors">
              <div class="custom-color-inputs">
                <div class="color-input-group">
                  <Label>Color Primario</Label>
                  <div class="color-input-wrapper">
                    <input
                      type="color"
                      v-model="customPrimaryColor"
                      @change="updateCustomPrimaryColor"
                      class="color-input"
                    />
                    <span class="color-value">{{ customPrimaryColor }}</span>
                  </div>
                </div>
                <div class="color-input-group">
                  <Label>Color Secundario</Label>
                  <div class="color-input-wrapper">
                    <input
                      type="color"
                      v-model="customSecondaryColor"
                      @change="updateCustomSecondaryColor"
                      class="color-input"
                    />
                    <span class="color-value">{{ customSecondaryColor }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Vista Previa -->
      <Card class="settings-card">
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
            <div class="preview-sidebar" :style="{ backgroundColor: localSettings.primaryColor }">
              <div class="preview-sidebar-content">
                <div class="preview-menu-item">Dashboard</div>
                <div class="preview-menu-item">Productos</div>
                <div class="preview-menu-item">Clientes</div>
              </div>
            </div>
            <div class="preview-main">
              <div class="preview-navbar" :style="{ backgroundColor: localSettings.secondaryColor }">
                <div class="preview-navbar-content">Navbar</div>
              </div>
              <div class="preview-content">
                <div class="preview-card">
                  <h4>Contenido Principal</h4>
                  <p>Este es un ejemplo de cómo se verá el contenido con los colores seleccionados.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

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
  </SettingsPage>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { useToast } from '@/composables/useToast'
import SettingsPage from '@/components/ui/SettingsPage.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Label from '@/components/ui/Label.vue'
import Dialog from '@/components/ui/Dialog.vue'
import { Palette, Eye, Settings } from 'lucide-vue-next'

const {
  settings,
  availableColors,
  loadSettings,
  saveSettings,
  updateSetting,
  updatePredefinedColor,
  applySettings,
  resetSettings
} = useSettings()

const { success, error } = useToast()

// Estado local
const localSettings = reactive({
  primaryColor: '#667eea',
  secondaryColor: '#764ba2'
})

// Estado para colores personalizados
const customPrimaryColor = ref('#667eea')
const customSecondaryColor = ref('#764ba2')

// Estado para editar colores preconfigurados
const editingColorId = ref('')
const editingPrimaryColor = ref('')
const editingSecondaryColor = ref('')
const showColorEditModal = ref(false)

// Métodos
const selectColor = (color: any) => {
  localSettings.primaryColor = color.primary
  localSettings.secondaryColor = color.secondary
  
  // Aplicar colores inmediatamente
  settings.value.primaryColor = color.primary
  settings.value.secondaryColor = color.secondary
  applySettings()
  
  success('Colores', `Esquema cambiado a ${color.name}`)
}

const isColorActive = (color: any) => {
  return localSettings.primaryColor === color.primary && 
         localSettings.secondaryColor === color.secondary
}

const openColorEditModal = (color: any) => {
  if (color.editable) {
    editingColorId.value = color.id
    editingPrimaryColor.value = color.primary
    editingSecondaryColor.value = color.secondary
    showColorEditModal.value = true
  }
}

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

const cancelColorEdit = () => {
  showColorEditModal.value = false
  editingColorId.value = ''
  editingPrimaryColor.value = ''
  editingSecondaryColor.value = ''
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

const saveAppearanceSettings = () => {
  updateSetting('primaryColor', localSettings.primaryColor)
  updateSetting('secondaryColor', localSettings.secondaryColor)
  saveSettings()
  success('Apariencia', 'Configuración de apariencia guardada exitosamente')
}

const resetAppearanceSettings = () => {
  resetSettings()
  Object.assign(localSettings, settings.value)
  customPrimaryColor.value = localSettings.primaryColor
  customSecondaryColor.value = localSettings.secondaryColor
  success('Apariencia', 'Configuración de apariencia restablecida')
}

onMounted(() => {
  loadSettings()
  Object.assign(localSettings, settings.value)
  customPrimaryColor.value = localSettings.primaryColor
  customSecondaryColor.value = localSettings.secondaryColor
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
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

/* Color Grid */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  background: white;
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

.edit-color-btn {
  padding: 0.25rem;
  background: #f8fafc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-color-btn:hover {
  background: #667eea;
  color: white;
}

/* Custom Colors */
.custom-colors {
  margin-top: 1rem;
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

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-input {
  width: 3rem;
  height: 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
}

.color-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #667eea;
  font-family: monospace;
}

/* Preview */
.preview-container {
  display: flex;
  gap: 1rem;
  height: 200px;
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

.preview-sidebar-content {
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
}

.preview-navbar-content {
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

/* Modal */
.color-edit-modal {
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

.color-preview-text {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.color-preview-section {
  margin-top: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Dark mode */
.dark .settings-card {
  background: #1e293b;
}

.dark .setting-label {
  color: #f1f5f9;
}

.dark .color-option {
  background: #1e293b;
  border-color: #334155;
}

.dark .color-option:hover {
  border-color: #667eea;
}

.dark .color-option.active {
  background: #1e293b;
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

.dark .color-preview-text {
  color: #94a3b8;
}
</style>
