<template>
  <SettingsPage
    title="Configuración de Branding"
    subtitle="Personaliza el logo, favicon y elementos visuales del sistema"
    :icon="ImageIcon"
    :show-reset="true"
    :show-save="true"
    @save="saveBrandingSettings"
    @reset="resetBrandingSettings"
  >
    <div class="settings-grid">
      <!-- Configuración de Imágenes -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <ImageIcon class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Imágenes del Sistema</h3>
            <p>Sube y configura las imágenes principales</p>
          </div>
        </div>
        
        <div class="card-content">
          <!-- Logo de la Empresa -->
          <div class="setting-group">
            <Label class="setting-label">Logo de la Empresa</Label>
            <div class="image-upload-container">
              <input
                type="file"
                id="logo"
                accept="image/*"
                @change="handleImageUpload($event, 'logo')"
                class="file-input"
              />
              <label for="logo" class="file-label">
                <ImageIcon class="h-5 w-5" />
                Seleccionar Logo
              </label>
              <div v-if="localSettings.branding?.logo" class="image-preview">
                <img :src="localSettings.branding.logo" alt="Logo" />
                <button @click="removeBrandingImage('logo')" class="remove-image-btn">
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Favicon -->
          <div class="setting-group">
            <Label class="setting-label">Favicon</Label>
            <div class="image-upload-container">
              <input
                type="file"
                id="favicon"
                accept="image/png,image/x-icon,image/svg+xml"
                @change="handleImageUpload($event, 'favicon')"
                class="file-input"
              />
              <label for="favicon" class="file-label">
                <ImageIcon class="h-5 w-5" />
                Seleccionar Favicon
              </label>
              <div v-if="localSettings.branding?.favicon" class="image-preview favicon-preview">
                <img :src="localSettings.branding.favicon" alt="Favicon" />
                <button @click="removeBrandingImage('favicon')" class="remove-image-btn">
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Configuración del Login -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <Eye class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Configuración del Login</h3>
            <p>Personaliza la pantalla de inicio de sesión</p>
          </div>
        </div>
        
        <div class="card-content">
          <!-- Fondo del Login -->
          <div class="setting-group">
            <Label class="setting-label">Fondo del Login</Label>
            <div class="background-config-container">
              <!-- Upload de imagen -->
              <div class="background-upload">
                <input
                  type="file"
                  id="loginBackground"
                  accept="image/*"
                  @change="handleImageUpload($event, 'loginBackground')"
                  class="file-input"
                />
                <label for="loginBackground" class="file-label">
                  <ImageIcon class="h-5 w-5" />
                  Seleccionar Imagen
                </label>
                <div v-if="localSettings.branding?.loginBackground" class="image-preview">
                  <img :src="localSettings.branding.loginBackground" alt="Fondo Login" />
                  <button @click="removeBrandingImage('loginBackground')" class="remove-image-btn">
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Opciones de configuración de background -->
              <div v-if="localSettings.branding?.loginBackground" class="background-options">
                <!-- Background Size -->
                <div class="bg-option-group">
                  <Label class="bg-option-label">Tamaño</Label>
                  <select
                    v-model="localSettings.branding.backgroundSize"
                    class="bg-select"
                  >
                    <option value="cover">Cubrir (Cover)</option>
                    <option value="contain">Contener (Contain)</option>
                    <option value="100%">100%</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>

                <!-- Background Position -->
                <div class="bg-option-group">
                  <Label class="bg-option-label">Posición</Label>
                  <div class="position-grid">
                    <button
                      v-for="pos in ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']"
                      :key="pos"
                      @click="localSettings.branding.backgroundPosition = pos"
                      :class="['position-btn', { active: localSettings.branding.backgroundPosition === pos }]"
                      type="button"
                    >
                      {{ getPositionLabel(pos) }}
                    </button>
                  </div>
                </div>

                <!-- Background Repeat -->
                <div class="bg-option-group">
                  <Label class="bg-option-label">Repetición</Label>
                  <div class="repeat-options">
                    <label
                      v-for="repeat in [{value: 'no-repeat', label: 'No Repetir'}, {value: 'repeat', label: 'Repetir'}, {value: 'repeat-x', label: 'Repetir X'}, {value: 'repeat-y', label: 'Repetir Y'}]"
                      :key="repeat.value"
                      :class="['repeat-option', { active: localSettings.branding.backgroundRepeat === repeat.value }]"
                    >
                      <input
                        type="radio"
                        :value="repeat.value"
                        v-model="localSettings.branding.backgroundRepeat"
                        class="repeat-radio"
                      />
                      <span>{{ repeat.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Template de Login -->
          <div class="setting-group">
            <Label class="setting-label">Plantilla de Login</Label>
            <div class="template-grid">
              <div
                v-for="template in loginTemplates"
                :key="template.id"
                class="template-option"
                :class="{ active: localSettings.branding?.loginTemplate === template.id }"
                @click="selectLoginTemplate(template.id)"
              >
                <div class="template-preview">
                  <div class="template-preview-badge">{{ template.name }}</div>
                </div>
                <div class="template-info">
                  <h4>{{ template.name }}</h4>
                  <p>{{ template.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Toggle Mostrar Registro -->
          <div class="setting-group">
            <Label class="setting-label">Área de Registro</Label>
            <div class="toggle-item">
              <div class="toggle-info">
                <h4>Mostrar enlace de registro en login</h4>
                <p>Permite a los usuarios registrarse desde la pantalla de login</p>
              </div>
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  id="showRegister"
                  v-model="localSettings.branding.showRegister"
                  @change="updateBrandingSetting('showRegister', localSettings.branding.showRegister)"
                  class="toggle-input"
                />
                <label for="showRegister" class="toggle-label">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Vista Previa -->
      <Card class="settings-card full-width">
        <div class="card-header">
          <div class="header-icon">
            <Eye class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Vista Previa del Login</h3>
            <p>Ve cómo se verá tu pantalla de login</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="preview-info">
            <p>Esta es una vista previa en tiempo real de cómo se verá tu login. Los cambios se reflejan automáticamente.</p>
          </div>

          <!-- Réplica del componente Login con configuraciones aplicadas -->
          <div class="login-preview-container" :style="previewContainerStyle">
            <div class="login-preview-card" :class="{ 'minimal-card': localSettings.branding?.loginTemplate === 'minimal' }">
              <div class="login-preview-header">
                <div v-if="localSettings.branding?.logo" class="login-preview-logo">
                  <img :src="localSettings.branding.logo" alt="Logo" />
                </div>
                <h1>Bienvenido</h1>
                <p>Inicia sesión en tu cuenta</p>
              </div>

              <div class="login-preview-options">
                <button class="preview-option-btn active">Usuario</button>
                <button class="preview-option-btn">Correo</button>
              </div>

              <div class="login-preview-form">
                <div class="preview-form-group">
                  <label>Usuario</label>
                  <div class="preview-input-wrapper">
                    <i>👤</i>
                    <input type="text" placeholder="Ingresa tu usuario" disabled />
                  </div>
                </div>

                <div class="preview-form-group">
                  <label>Contraseña</label>
                  <div class="preview-input-wrapper">
                    <i>🔒</i>
                    <input type="password" placeholder="Ingresa tu contraseña" disabled />
                  </div>
                </div>

                <div class="preview-form-options">
                  <label class="preview-remember">
                    <input type="checkbox" disabled />
                    <span>Recordarme</span>
                  </label>
                  <a href="#">¿Olvidaste tu contraseña?</a>
                </div>

                <button class="preview-login-btn">Iniciar Sesión</button>
              </div>

              <div v-if="localSettings.branding?.showRegister" class="preview-signup-link">
                ¿No tienes cuenta? <a href="#">Regístrate</a>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </SettingsPage>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { useToast } from '@/composables/useToast'
import SettingsPage from '@/components/ui/SettingsPage.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Label from '@/components/ui/Label.vue'
import { ImageIcon, Eye, X } from 'lucide-vue-next'

const {
  settings,
  loginTemplates,
  loadSettings,
  saveSettings,
  updateSetting,
  updateBrandingImage,
  updateLoginTemplate,
  resetSettings
} = useSettings()

const { success, error } = useToast()

// Estado local
const localSettings = reactive({
  branding: {
    loginBackground: '',
    logo: '',
    favicon: '',
    loginTemplate: 'default',
    showRegister: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll'
  }
})

// Computed para preview del login
const previewContainerStyle = computed(() => {
  const styles: any = {}
  const bg = localSettings.branding?.loginBackground
  const template = localSettings.branding?.loginTemplate

  if (bg) {
    styles.backgroundImage = `url(${bg})`
    styles.backgroundSize = localSettings.branding?.backgroundSize || 'cover'
    styles.backgroundPosition = localSettings.branding?.backgroundPosition || 'center'
    styles.backgroundRepeat = localSettings.branding?.backgroundRepeat || 'no-repeat'
    styles.backgroundAttachment = localSettings.branding?.backgroundAttachment || 'scroll'
  }

  // Aplicar estilos según el template seleccionado
  switch (template) {
    case 'modern':
      if (bg) {
        styles.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bg})`
        styles.backgroundSize = localSettings.branding?.backgroundSize || 'cover'
        styles.backgroundPosition = localSettings.branding?.backgroundPosition || 'center'
        styles.backgroundRepeat = localSettings.branding?.backgroundRepeat || 'no-repeat'
        styles.backgroundAttachment = localSettings.branding?.backgroundAttachment || 'scroll'
      }
      break
    case 'minimal':
      styles.background = '#ffffff'
      break
    case 'gradient':
      if (!bg) {
        styles.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        styles.backgroundSize = '200% 200%'
        styles.animation = 'gradientShift 10s ease infinite'
      }
      break
    default:
      if (!bg) {
        styles.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
  }

  return styles
})

// Métodos
const handleImageUpload = (event: Event, type: 'loginBackground' | 'logo' | 'favicon') => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validar tamaño del archivo (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      error('Error', 'La imagen no debe superar los 2MB')
      return
    }

    // Convertir a base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      if (localSettings.branding) {
        localSettings.branding[type] = imageData
        // Aplicar inmediatamente para vista previa
        updateBrandingImage(type, imageData)
        success('Imagen', `${type === 'loginBackground' ? 'Fondo del login' : type === 'logo' ? 'Logo' : 'Favicon'} actualizado`)
      }
    }
    reader.readAsDataURL(file)
  }
}

const removeBrandingImage = (type: 'loginBackground' | 'logo' | 'favicon') => {
  if (localSettings.branding) {
    localSettings.branding[type] = ''
    updateBrandingImage(type, '')
    success('Imagen', 'Imagen eliminada')
  }
}

const selectLoginTemplate = (templateId: string) => {
  if (localSettings.branding) {
    localSettings.branding.loginTemplate = templateId
    updateLoginTemplate(templateId)
    success('Template', `Template ${templateId} seleccionado`)
  }
}

const updateBrandingSetting = (key: string, value: any) => {
  updateSetting(`branding.${key}`, value)
}

const getPositionLabel = (pos: string) => {
  const labels: Record<string, string> = {
    'top-left': '↖',
    'top': '↑',
    'top-right': '↗',
    'left': '←',
    'center': '●',
    'right': '→',
    'bottom-left': '↙',
    'bottom': '↓',
    'bottom-right': '↘'
  }
  return labels[pos] || pos
}

const saveBrandingSettings = () => {
  saveSettings()
  success('Branding', 'Configuración de branding guardada exitosamente')
}

const resetBrandingSettings = () => {
  resetSettings()
  Object.assign(localSettings, settings.value)
  success('Branding', 'Configuración de branding restablecida')
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

.settings-card.full-width {
  grid-column: 1 / -1;
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

/* Image Upload */
.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-input {
  display: none;
}

.file-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #667eea;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  justify-content: center;
}

.file-label:hover {
  background: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.image-preview {
  position: relative;
  width: 100%;
  height: 120px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favicon-preview {
  height: 64px;
}

.favicon-preview img {
  object-fit: contain;
  padding: 0.5rem;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Background Configuration */
.background-config-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
}

.background-upload {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.background-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.bg-option-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bg-option-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}

.bg-select {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bg-select:hover {
  border-color: #667eea;
}

.bg-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Position Grid */
.position-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.position-btn {
  padding: 0.75rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.position-btn:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.position-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Repeat Options */
.repeat-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.repeat-option {
  padding: 0.75rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.repeat-option:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.repeat-option.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.repeat-radio {
  display: none;
}

/* Template Grid */
.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.template-option {
  display: flex;
  flex-direction: column;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.template-option:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.template-option.active {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.template-preview {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-preview-badge {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.template-info {
  padding: 1rem;
}

.template-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.template-info p {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* Toggle Item */
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

/* Preview */
.preview-info {
  text-align: center;
  padding: 1rem;
  background: #f0f4ff;
  border-radius: 8px;
  border: 1px solid #667eea;
  margin-bottom: 1.5rem;
}

.preview-info p {
  margin: 0;
  color: #374151;
  font-size: 0.875rem;
}

.login-preview-container {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.login-preview-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease-out;
}

.login-preview-card.minimal-card {
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.login-preview-logo {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.login-preview-logo img {
  max-width: 150px;
  max-height: 60px;
  object-fit: contain;
}

.login-preview-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-preview-header h1 {
  color: #333;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-preview-header p {
  color: #666;
  font-size: 0.875rem;
}

.login-preview-options {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 8px;
}

.preview-option-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  cursor: not-allowed;
  transition: all 0.3s ease;
}

.preview-option-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-preview-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-form-group label {
  color: #333;
  font-size: 0.875rem;
  font-weight: 600;
}

.preview-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.preview-input-wrapper i {
  position: absolute;
  left: 12px;
  color: #999;
  font-size: 1rem;
  pointer-events: none;
}

.preview-input-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: #f8fafc;
  cursor: not-allowed;
}

.preview-form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.preview-remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: not-allowed;
  color: #666;
}

.preview-remember input {
  width: 16px;
  height: 16px;
  cursor: not-allowed;
}

.preview-form-options a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  pointer-events: none;
}

.preview-login-btn {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: not-allowed;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.preview-signup-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.875rem;
}

.preview-signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  pointer-events: none;
}

/* Dark mode */
.dark .settings-card {
  background: #1e293b;
}

.dark .setting-label {
  color: #f1f5f9;
}

.dark .template-option {
  background: #1e293b;
  border-color: #334155;
}

.dark .template-option:hover {
  border-color: #667eea;
}

.dark .template-info h4 {
  color: #f1f5f9;
}

.dark .template-info p {
  color: #94a3b8;
}

.dark .image-preview {
  background: #1e293b;
  border-color: #334155;
}

.dark .background-options {
  background: #1e293b;
  border-color: #334155;
}

.dark .bg-option-label {
  color: #f1f5f9;
}

.dark .bg-select {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

.dark .position-btn {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

.dark .position-btn:hover {
  background: #334155;
}

.dark .repeat-option {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

.dark .repeat-option:hover {
  background: #334155;
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

.dark .preview-info {
  background: #1e293b;
  border-color: #667eea;
}

.dark .preview-info p {
  color: #f1f5f9;
}

.dark .login-preview-card {
  background: #1e293b;
}

.dark .login-preview-header h1 {
  color: #f1f5f9;
}

.dark .login-preview-header p {
  color: #94a3b8;
}

.dark .login-preview-options {
  background: #0f172a;
}

.dark .preview-option-btn {
  color: #94a3b8;
}

.dark .preview-option-btn.active {
  background: #334155;
  color: #667eea;
}

.dark .preview-form-group label {
  color: #f1f5f9;
}

.dark .preview-input-wrapper input {
  background: #0f172a;
  border-color: #334155;
  color: #f1f5f9;
}

.dark .preview-remember {
  color: #94a3b8;
}

.dark .preview-signup-link {
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 1024px) {
  .background-config-container {
    grid-template-columns: 1fr;
  }

  .background-options {
    grid-template-columns: 1fr;
  }

  .repeat-options {
    grid-template-columns: 1fr;
  }

  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style>
