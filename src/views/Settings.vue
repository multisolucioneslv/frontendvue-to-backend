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

      <!-- Segunda fila: Bloque completo de 12 columnas para branding -->
      <div class="settings-row-full">
        <Card class="settings-card-full">
          <div class="card-header">
            <div class="header-icon">
              <ImageIcon class="h-6 w-6" />
            </div>
            <div class="header-text">
              <h3>Configuración de Apariencia y Branding</h3>
              <p>Personaliza el login, logo, favicon y otros elementos visuales</p>
            </div>
          </div>

          <div class="card-content">
            <!-- Grid de configuraciones de branding -->
            <div class="branding-grid">
              <!-- Fondo del Login -->
              <div class="branding-item branding-item-full">
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

                    <!-- Background Attachment -->
                    <div class="bg-option-group">
                      <Label class="bg-option-label">Adjunto</Label>
                      <div class="toggle-switch">
                        <input
                          type="checkbox"
                          id="backgroundAttachment"
                          :checked="localSettings.branding.backgroundAttachment === 'fixed'"
                          @change="localSettings.branding.backgroundAttachment = $event.target.checked ? 'fixed' : 'scroll'"
                          class="toggle-input"
                        />
                        <label for="backgroundAttachment" class="toggle-label">
                          <span class="toggle-slider"></span>
                        </label>
                        <span class="toggle-text">{{ localSettings.branding.backgroundAttachment === 'fixed' ? 'Fijo' : 'Scroll' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Logo de la Empresa -->
              <div class="branding-item">
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
              <div class="branding-item">
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

              <!-- Template de Login -->
              <div class="branding-item branding-item-full">
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
              <div class="branding-item">
                <Label class="setting-label">Área de Registro</Label>
                <div class="toggle-item-compact">
                  <div class="toggle-info-compact">
                    <h4>Mostrar enlace de registro en login</h4>
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

            <!-- Botones de acción -->
            <div class="save-section-full">
              <div class="action-buttons">
                <Button @click="showLoginPreview = true" variant="outline" class="preview-button">
                  <Eye class="h-4 w-4 mr-2" />
                  Vista Previa
                </Button>
                <Button @click="saveBrandingConfiguration" class="save-button">
                  <Save class="h-4 w-4 mr-2" />
                  Guardar Configuración de Apariencia
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Tercera fila: Bloque completo de 12 columnas para tabla de vistas -->
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

    <!-- Modal de Vista Previa del Login -->
    <Dialog :open="showLoginPreview" @update:open="showLoginPreview = $event" title="Vista Previa del Login" size="large">
      <div class="login-preview-modal">
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

        <div class="modal-actions">
          <Button variant="outline" @click="showLoginPreview = false">
            Cerrar Vista Previa
          </Button>
          <Button @click="saveBrandingConfiguration(); showLoginPreview = false">
            <Save class="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
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
  Circle,
  ImageIcon,
  X
} from 'lucide-vue-next'

const {
  settings,
  availableFonts,
  availableColors,
  loginTemplates,
  loadSettings,
  saveSettings,
  saveFontSettings,
  saveColorSettings,
  saveViewSettings,
  saveExperienceSettings,
  saveBrandingSettings,
  addCustomFont: addFont,
  updateSetting,
  updatePredefinedColor,
  getColorById,
  toggleView,
  applyViewChanges,
  applyAllViewSettings,
  resetSettings,
  applySettings,
  applyDefaultsIfFirstTime,
  updateBrandingImage,
  updateLoginTemplate,
  toggleShowRegister
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
  notifications: true,
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

// Estado para preview del login
const showLoginPreview = ref(false)

// Computed para preview del login (similar al containerStyle del Login.vue)
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

// Función helper para labels de posición
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

// Funciones de branding
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

const saveBrandingConfiguration = () => {
  saveBrandingSettings()
  success('Branding', 'Configuración de apariencia guardada permanentemente')
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

/* Estilos para branding */
.branding-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.branding-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.branding-item-full {
  grid-column: span 3;
}

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

@media (max-width: 1024px) {
  .branding-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .branding-item-full {
    grid-column: span 2;
  }

  .template-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .branding-grid {
    grid-template-columns: 1fr;
  }

  .branding-item-full {
    grid-column: span 1;
  }
}

/* Dark mode para branding */
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

/* Estilos para configuración de background */
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

/* Grid de posiciones (como teclado numérico) */
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

/* Opciones de repeat */
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

/* Texto para toggle */
.toggle-text {
  margin-left: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
}

.preview-button {
  min-width: 150px;
}

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
}

/* Dark mode */
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

.dark .toggle-text {
  color: #f1f5f9;
}

/* Estilos para modal de vista previa del login */
.login-preview-modal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-info {
  text-align: center;
  padding: 1rem;
  background: #f0f4ff;
  border-radius: 8px;
  border: 1px solid #667eea;
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

/* Dark mode para preview */
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
</style>
