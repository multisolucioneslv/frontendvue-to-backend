<template>
  <SettingsPage
    title="Información de la Empresa"
    subtitle="Configura todos los datos de tu empresa y elementos visuales"
    :icon="Building2"
    :show-reset="true"
    @reset="showResetConfirmation"
  >
    <!-- Banner de cambios pendientes -->
    <div v-if="hasUnsavedChanges" class="unsaved-changes-banner">
      <div class="banner-content">
        <div class="banner-icon">
          <AlertCircle class="h-5 w-5" />
        </div>
        <div class="banner-text">
          <h4>Cambios pendientes de guardar</h4>
          <p>Los cambios se han aplicado temporalmente. Guarda para conservarlos permanentemente.</p>
        </div>
        <div class="banner-actions">
          <Button @click="saveCompanyInfo" size="sm" class="save-btn">
            <Save class="h-4 w-4 mr-2" />
            Guardar Ahora
          </Button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para restablecer -->
    <div v-if="showResetModal" class="reset-modal-overlay" @click="closeResetModal">
      <div class="reset-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon">
            <AlertTriangle class="h-8 w-8" />
          </div>
          <div class="modal-title">
            <h3>¿Restablecer toda la configuración?</h3>
            <p>Esta acción eliminará todos los cambios personalizados</p>
          </div>
        </div>
        
        <div class="modal-content">
          <div class="warning-section">
            <h4>Se perderán los siguientes cambios:</h4>
            <div class="changes-list">
              <div class="change-item">
                <Trash2 class="h-4 w-4" />
                <span>Logo de la empresa</span>
              </div>
              <div class="change-item">
                <Trash2 class="h-4 w-4" />
                <span>Favicon personalizado</span>
              </div>
              <div class="change-item">
                <Trash2 class="h-4 w-4" />
                <span>Información de la empresa</span>
              </div>
              <div class="change-item">
                <Trash2 class="h-4 w-4" />
                <span>Datos de contacto</span>
              </div>
              <div class="change-item">
                <Trash2 class="h-4 w-4" />
                <span>Ubicación y horarios</span>
              </div>
              <div class="change-item">
                <Trash2 class="h-4 w-4" />
                <span>Configuraciones de branding</span>
              </div>
            </div>
          </div>
          
          <div class="default-values">
            <h4>Se restaurarán los valores por defecto:</h4>
            <div class="defaults-list">
              <div class="default-item">
                <span>• Nombre: Vacío</span>
              </div>
              <div class="default-item">
                <span>• Sin logo ni favicon</span>
              </div>
              <div class="default-item">
                <span>• Sin información de contacto</span>
              </div>
              <div class="default-item">
                <span>• Sin ubicación ni horarios</span>
              </div>
              <div class="default-item">
                <span>• Sin imagen de fondo en login</span>
              </div>
              <div class="default-item">
                <span>• Fuente: Inter, Tamaño: 14px</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <Button variant="outline" @click="closeResetModal" class="cancel-btn">
            Cancelar
          </Button>
          <Button @click="confirmReset" class="confirm-btn">
            <Trash2 class="h-4 w-4 mr-2" />
            Sí, Restablecer Todo
          </Button>
        </div>
      </div>
    </div>

    <div class="settings-grid">
      <!-- Identidad Visual -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <ImageIcon class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Identidad Visual</h3>
            <p>Logo, favicon y elementos gráficos</p>
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
            <p class="input-help">Logo que aparecerá en el sidebar y sistema</p>
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
            <p class="input-help">Icono que aparece en la pestaña del navegador</p>
          </div>
        </div>
      </Card>

      <!-- Información Básica -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <Building2 class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Información Básica</h3>
            <p>Datos principales de la empresa</p>
          </div>
        </div>
        
        <div class="card-content">
          <!-- Nombre de la Empresa -->
          <div class="setting-group">
            <Label class="setting-label">Nombre de la Empresa/Sistema</Label>
            <Input 
              v-model="localSettings.branding.companyName"
              placeholder="Ej: Mi Empresa S.A."
              class="company-input"
            />
            <p class="input-help">Este nombre aparecerá en el sidebar y en el sistema</p>
          </div>

          <!-- Slogan -->
          <div class="setting-group">
            <Label class="setting-label">Slogan</Label>
            <Input 
              v-model="localSettings.branding.companySlogan"
              placeholder="Ej: Soluciones que transforman"
              class="company-input"
            />
            <p class="input-help">Frase corta que representa a tu empresa</p>
          </div>

          <!-- Descripción -->
          <div class="setting-group">
            <Label class="setting-label">Descripción de la Empresa</Label>
            <textarea 
              v-model="localSettings.branding.companyDescription"
              placeholder="Describe brevemente qué hace tu empresa..."
              class="company-textarea"
              rows="4"
            ></textarea>
            <p class="input-help">Descripción detallada de los servicios o productos</p>
          </div>

          <!-- Sitio Web -->
          <div class="setting-group">
            <Label class="setting-label">Sitio Web</Label>
            <Input 
              v-model="localSettings.branding.companyWebsite"
              placeholder="https://www.miempresa.com"
              class="company-input"
            />
            <p class="input-help">URL del sitio web oficial</p>
          </div>
        </div>
      </Card>

      <!-- Información de Contacto -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <Mail class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Información de Contacto</h3>
            <p>Datos para que los clientes te contacten</p>
          </div>
        </div>
        
        <div class="card-content">
          <!-- Email -->
          <div class="setting-group">
            <Label class="setting-label">Email de Contacto</Label>
            <Input 
              v-model="localSettings.branding.companyEmail"
              placeholder="contacto@miempresa.com"
              type="email"
              class="company-input"
            />
            <p class="input-help">Email principal para consultas</p>
          </div>

          <!-- Teléfono -->
          <div class="setting-group">
            <Label class="setting-label">Teléfono Principal</Label>
            <Input 
              v-model="localSettings.branding.companyPhone"
              placeholder="+1 (555) 123-4567"
              class="company-input"
            />
            <p class="input-help">Número de teléfono principal</p>
          </div>

          <!-- Teléfono Secundario -->
          <div class="setting-group">
            <Label class="setting-label">Teléfono Secundario</Label>
            <Input 
              v-model="localSettings.branding.companyPhone2"
              placeholder="+1 (555) 987-6543"
              class="company-input"
            />
            <p class="input-help">Número de teléfono alternativo (opcional)</p>
          </div>

          <!-- WhatsApp -->
          <div class="setting-group">
            <Label class="setting-label">WhatsApp</Label>
            <Input 
              v-model="localSettings.branding.companyWhatsApp"
              placeholder="+1 (555) 123-4567"
              class="company-input"
            />
            <p class="input-help">Número de WhatsApp para contacto directo</p>
          </div>
        </div>
      </Card>

      <!-- Ubicación y Horarios -->
      <Card class="settings-card">
        <div class="card-header">
          <div class="header-icon">
            <MapPin class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Ubicación y Horarios</h3>
            <p>Dirección física y horarios de atención</p>
          </div>
        </div>
        
        <div class="card-content">
          <!-- Dirección -->
          <div class="setting-group">
            <Label class="setting-label">Dirección Completa</Label>
            <textarea 
              v-model="localSettings.branding.companyAddress"
              placeholder="Calle Principal 123, Ciudad, Estado, País"
              class="company-textarea"
              rows="3"
            ></textarea>
            <p class="input-help">Dirección física completa de la empresa</p>
          </div>

          <!-- Coordenadas GPS -->
          <div class="setting-group">
            <Label class="setting-label">Coordenadas GPS (opcional)</Label>
            <div class="coordinates-container">
              <Input 
                v-model="localSettings.branding.companyLatitude"
                placeholder="Latitud: 40.7128"
                class="coordinate-input"
              />
              <Input 
                v-model="localSettings.branding.companyLongitude"
                placeholder="Longitud: -74.0060"
                class="coordinate-input"
              />
            </div>
            <p class="input-help">Para mostrar ubicación exacta en mapas</p>
          </div>

          <!-- Horarios de Atención -->
          <div class="setting-group">
            <Label class="setting-label">Horarios de Atención</Label>
            <div class="schedule-container">
              <div class="schedule-item">
                <Label class="schedule-label">Lunes a Viernes</Label>
                <div class="schedule-inputs">
                  <Input 
                    v-model="localSettings.branding.companySchedule.weekdays.start"
                    placeholder="09:00"
                    type="time"
                    class="time-input"
                  />
                  <span class="schedule-separator">a</span>
                  <Input 
                    v-model="localSettings.branding.companySchedule.weekdays.end"
                    placeholder="18:00"
                    type="time"
                    class="time-input"
                  />
                </div>
              </div>
              <div class="schedule-item">
                <Label class="schedule-label">Sábados</Label>
                <div class="schedule-inputs">
                  <Input 
                    v-model="localSettings.branding.companySchedule.saturday.start"
                    placeholder="09:00"
                    type="time"
                    class="time-input"
                  />
                  <span class="schedule-separator">a</span>
                  <Input 
                    v-model="localSettings.branding.companySchedule.saturday.end"
                    placeholder="14:00"
                    type="time"
                    class="time-input"
                  />
                </div>
              </div>
              <div class="schedule-item">
                <Label class="schedule-label">Domingos</Label>
                <div class="schedule-inputs">
                  <Input 
                    v-model="localSettings.branding.companySchedule.sunday.start"
                    placeholder="Cerrado"
                    class="time-input"
                    disabled
                  />
                  <span class="schedule-separator">a</span>
                  <Input 
                    v-model="localSettings.branding.companySchedule.sunday.end"
                    placeholder="Cerrado"
                    class="time-input"
                    disabled
                  />
                </div>
              </div>
            </div>
            <p class="input-help">Horarios de atención al cliente</p>
          </div>
        </div>
      </Card>

      <!-- Mapa de Ubicación -->
      <Card class="settings-card full-width">
        <div class="card-header">
          <div class="header-icon">
            <Map class="h-6 w-6" />
          </div>
          <div class="header-text">
            <h3>Mapa de Ubicación</h3>
            <p>Visualiza la ubicación de tu empresa</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="map-container">
            <div class="map-placeholder">
              <MapPin class="h-12 w-12 text-gray-400" />
              <h4>Mapa de Ubicación</h4>
              <p>Ingresa las coordenadas GPS para mostrar la ubicación exacta</p>
              <div v-if="localSettings.branding.companyLatitude && localSettings.branding.companyLongitude" class="map-coordinates">
                <p><strong>Coordenadas:</strong> {{ localSettings.branding.companyLatitude }}, {{ localSettings.branding.companyLongitude }}</p>
                <Button @click="openMapInNewTab" variant="outline" class="map-button">
                  <ExternalLink class="h-4 w-4 mr-2" />
                  Ver en Google Maps
                </Button>
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
            <h3>Vista Previa</h3>
            <p>Así se verá la información en el sistema</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="preview-container">
            <!-- Preview del Sidebar -->
            <div class="preview-sidebar">
              <div class="preview-header">
                <div class="preview-logo">
                  <img v-if="localSettings.branding?.logo" :src="localSettings.branding.logo" alt="Logo" class="preview-logo-img" />
                  <Building2 v-else class="h-6 w-6" />
                </div>
                <div class="preview-company-info">
                  <h3 class="preview-company-name">{{ localSettings.branding.companyName || 'Sistema' }}</h3>
                  <p v-if="localSettings.branding.companySlogan" class="preview-company-slogan">
                    {{ localSettings.branding.companySlogan }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Preview de Información Completa -->
            <div class="preview-info">
              <div class="preview-section">
                <h4>Información de la Empresa</h4>
                <div class="preview-details">
                  <div v-if="localSettings.branding.companyDescription" class="preview-item">
                    <strong>Descripción:</strong>
                    <p>{{ localSettings.branding.companyDescription }}</p>
                  </div>
                  
                  <div v-if="localSettings.branding.companyWebsite" class="preview-item">
                    <strong>Sitio Web:</strong>
                    <p>{{ localSettings.branding.companyWebsite }}</p>
                  </div>
                  
                  <div v-if="localSettings.branding.companyEmail" class="preview-item">
                    <strong>Email:</strong>
                    <p>{{ localSettings.branding.companyEmail }}</p>
                  </div>
                  
                  <div v-if="localSettings.branding.companyPhone" class="preview-item">
                    <strong>Teléfono:</strong>
                    <p>{{ localSettings.branding.companyPhone }}</p>
                  </div>
                  
                  <div v-if="localSettings.branding.companyAddress" class="preview-item">
                    <strong>Dirección:</strong>
                    <p>{{ localSettings.branding.companyAddress }}</p>
                  </div>

                  <div v-if="localSettings.branding.companySchedule" class="preview-item">
                    <strong>Horarios:</strong>
                    <div class="schedule-preview">
                      <p><strong>Lunes a Viernes:</strong> {{ localSettings.branding.companySchedule.weekdays?.start || '09:00' }} - {{ localSettings.branding.companySchedule.weekdays?.end || '18:00' }}</p>
                      <p><strong>Sábados:</strong> {{ localSettings.branding.companySchedule.saturday?.start || '09:00' }} - {{ localSettings.branding.companySchedule.saturday?.end || '14:00' }}</p>
                      <p><strong>Domingos:</strong> Cerrado</p>
                    </div>
                  </div>
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
import { ref, reactive, watch } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { useToast } from '@/composables/useToast'
import SettingsPage from '@/components/ui/SettingsPage.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Button from '@/components/ui/Button.vue'
import { 
  Building2, 
  Mail, 
  MapPin, 
  Map, 
  ImageIcon, 
  X, 
  ExternalLink,
  Eye,
  AlertCircle,
  Save,
  AlertTriangle,
  Trash2
} from 'lucide-vue-next'

const { settings, updateSetting, saveSettings } = useSettings()
const { success, error: showError, info } = useToast()

// Variable para controlar el banner de cambios pendientes
const hasUnsavedChanges = ref(false)

// Variable para controlar el modal de confirmación
const showResetModal = ref(false)

// Estado local para los cambios
const localSettings = reactive({
  branding: {
    companyName: settings.value.branding?.companyName || '',
    companySlogan: settings.value.branding?.companySlogan || '',
    companyDescription: settings.value.branding?.companyDescription || '',
    companyWebsite: settings.value.branding?.companyWebsite || '',
    companyEmail: settings.value.branding?.companyEmail || '',
    companyPhone: settings.value.branding?.companyPhone || '',
    companyPhone2: settings.value.branding?.companyPhone2 || '',
    companyWhatsApp: settings.value.branding?.companyWhatsApp || '',
    companyAddress: settings.value.branding?.companyAddress || '',
    companyLatitude: settings.value.branding?.companyLatitude || '',
    companyLongitude: settings.value.branding?.companyLongitude || '',
    companySchedule: settings.value.branding?.companySchedule || {
      weekdays: { start: '09:00', end: '18:00' },
      saturday: { start: '09:00', end: '14:00' },
      sunday: { start: 'Cerrado', end: 'Cerrado' }
    },
    logo: settings.value.branding?.logo || '',
    favicon: settings.value.branding?.favicon || ''
  }
})

// Función para manejar la subida de imágenes
const handleImageUpload = (event: Event, type: 'logo' | 'favicon') => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (type === 'logo') {
        localSettings.branding.logo = result
        // Aplicar logo inmediatamente al sidebar
        applyLogoToSidebar(result)
        // Mostrar alerta para guardar cambios
        showSaveAlert()
      } else if (type === 'favicon') {
        localSettings.branding.favicon = result
        // Aplicar favicon inmediatamente
        applyFaviconToPage(result)
        // Mostrar alerta para guardar cambios
        showSaveAlert()
      }
    }
    reader.readAsDataURL(file)
  }
}

// Función para aplicar logo al sidebar en tiempo real
const applyLogoToSidebar = (logoUrl: string) => {
  // Buscar el elemento del logo en el sidebar
  const sidebarLogo = document.querySelector('.company-logo') as HTMLImageElement
  const sidebarPlaceholder = document.querySelector('.logo-placeholder')
  
  if (sidebarLogo) {
    sidebarLogo.src = logoUrl
    sidebarLogo.style.display = 'block'
    if (sidebarPlaceholder) {
      sidebarPlaceholder.style.display = 'none'
    }
  } else {
    // Si no existe el elemento img, crear uno temporal
    const logoContainer = document.querySelector('.logo-container')
    if (logoContainer) {
      const tempImg = document.createElement('img')
      tempImg.src = logoUrl
      tempImg.alt = 'Logo de la empresa'
      tempImg.className = 'company-logo'
      tempImg.style.height = '2rem'
      tempImg.style.maxWidth = '6rem'
      tempImg.style.objectFit = 'contain'
      tempImg.style.borderRadius = '0.375rem'
      tempImg.style.transition = 'all 0.3s ease'
      
      logoContainer.innerHTML = ''
      logoContainer.appendChild(tempImg)
      
      if (sidebarPlaceholder) {
        sidebarPlaceholder.style.display = 'none'
      }
    }
  }
}

// Función para aplicar favicon a la página en tiempo real
const applyFaviconToPage = (faviconUrl: string) => {
  // Buscar el favicon existente
  let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
  
  if (!favicon) {
    // Crear nuevo favicon si no existe
    favicon = document.createElement('link')
    favicon.rel = 'icon'
    document.head.appendChild(favicon)
  }
  
  favicon.href = faviconUrl
}

// Función para mostrar alerta de guardado
const showSaveAlert = () => {
  hasUnsavedChanges.value = true
  info('Cambios temporales', 'Los cambios se han aplicado temporalmente. Recuerda guardar para conservarlos permanentemente.')
}

// Función para remover imágenes
const removeBrandingImage = (type: 'logo' | 'favicon') => {
  if (type === 'logo') {
    localSettings.branding.logo = ''
    // Restaurar placeholder en el sidebar
    restoreLogoPlaceholder()
    // Mostrar alerta para guardar cambios
    showSaveAlert()
  } else if (type === 'favicon') {
    localSettings.branding.favicon = ''
    // Restaurar favicon por defecto
    restoreDefaultFavicon()
    // Mostrar alerta para guardar cambios
    showSaveAlert()
  }
}

// Función para restaurar placeholder del logo
const restoreLogoPlaceholder = () => {
  const sidebarLogo = document.querySelector('.company-logo') as HTMLImageElement
  const sidebarPlaceholder = document.querySelector('.logo-placeholder')
  
  if (sidebarLogo) {
    sidebarLogo.style.display = 'none'
  }
  if (sidebarPlaceholder) {
    sidebarPlaceholder.style.display = 'flex'
  }
}

// Función para restaurar favicon por defecto
const restoreDefaultFavicon = () => {
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
  if (favicon) {
    favicon.href = '/favicon.ico' // Favicon por defecto
  }
}

// Función para abrir mapa en nueva pestaña
const openMapInNewTab = () => {
  const lat = localSettings.branding.companyLatitude
  const lng = localSettings.branding.companyLongitude
  if (lat && lng) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`
    window.open(url, '_blank')
  }
}

// Función para guardar cambios
const saveCompanyInfo = async () => {
  try {
    // Actualizar cada campo individualmente
    updateSetting('branding.companyName', localSettings.branding.companyName)
    updateSetting('branding.companySlogan', localSettings.branding.companySlogan)
    updateSetting('branding.companyDescription', localSettings.branding.companyDescription)
    updateSetting('branding.companyWebsite', localSettings.branding.companyWebsite)
    updateSetting('branding.companyEmail', localSettings.branding.companyEmail)
    updateSetting('branding.companyPhone', localSettings.branding.companyPhone)
    updateSetting('branding.companyPhone2', localSettings.branding.companyPhone2)
    updateSetting('branding.companyWhatsApp', localSettings.branding.companyWhatsApp)
    updateSetting('branding.companyAddress', localSettings.branding.companyAddress)
    updateSetting('branding.companyLatitude', localSettings.branding.companyLatitude)
    updateSetting('branding.companyLongitude', localSettings.branding.companyLongitude)
    updateSetting('branding.companySchedule', localSettings.branding.companySchedule)
    updateSetting('branding.logo', localSettings.branding.logo)
    updateSetting('branding.favicon', localSettings.branding.favicon)
    
    // Guardar todas las configuraciones
    saveSettings()
    
    // Ocultar banner de cambios pendientes
    hasUnsavedChanges.value = false
    
    success('Información guardada', 'Los datos de la empresa se han actualizado correctamente')
  } catch (error) {
    console.error('Error al guardar información de la empresa:', error)
    showError('Error', 'No se pudieron guardar los cambios')
  }
}

// Función para mostrar modal de confirmación
const showResetConfirmation = () => {
  showResetModal.value = true
}

// Función para cerrar modal
const closeResetModal = () => {
  showResetModal.value = false
}

// Función para confirmar restablecimiento
const confirmReset = () => {
  // Restablecer a valores por defecto
  localSettings.branding.companyName = ''
  localSettings.branding.companySlogan = ''
  localSettings.branding.companyDescription = ''
  localSettings.branding.companyWebsite = ''
  localSettings.branding.companyEmail = ''
  localSettings.branding.companyPhone = ''
  localSettings.branding.companyPhone2 = ''
  localSettings.branding.companyWhatsApp = ''
  localSettings.branding.companyAddress = ''
  localSettings.branding.companyLatitude = ''
  localSettings.branding.companyLongitude = ''
  localSettings.branding.companySchedule = {
    weekdays: { start: '', end: '' },
    saturday: { start: '', end: '' },
    sunday: { start: '', end: '' }
  }
  localSettings.branding.logo = ''
  localSettings.branding.favicon = ''
  
  // Aplicar cambios inmediatamente
  applyLogoToSidebar('')
  restoreLogoPlaceholder()
  restoreDefaultFavicon()
  
  // Ocultar banner de cambios pendientes
  hasUnsavedChanges.value = false
  
  // Cerrar modal
  showResetModal.value = false
  
  // Mostrar notificación de éxito
  success('Configuración restablecida', 'Todos los valores han sido restaurados a los valores por defecto')
}
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
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.company-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.company-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.company-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;
}

.company-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-help {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
  line-height: 1.4;
}

/* Image Upload Styles */
.image-upload-container {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #64748b;
}

.file-label:hover {
  background: #f1f5f9;
  border-color: #667eea;
  color: #667eea;
}

.image-preview {
  margin-top: 1rem;
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.favicon-preview img {
  max-width: 32px;
  max-height: 32px;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Coordinates Container */
.coordinates-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.coordinate-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.coordinate-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Schedule Container */
.schedule-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.schedule-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.schedule-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.schedule-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.time-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.schedule-separator {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Map Container */
.map-container {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.map-placeholder h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.map-placeholder p {
  color: #64748b;
  margin: 0;
}

.map-coordinates {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.map-coordinates p {
  margin: 0 0 1rem 0;
  color: #374151;
}

.map-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Vista Previa */
.preview-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.preview-sidebar {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}

.preview-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.preview-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #667eea;
  color: white;
  border-radius: 8px;
  overflow: hidden;
}

.preview-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-company-info h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.preview-company-slogan {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
  font-style: italic;
}

.preview-info {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

.preview-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-item {
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.preview-item strong {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preview-item p {
  font-size: 0.875rem;
  color: #374151;
  margin: 0;
  line-height: 1.4;
}

.schedule-preview p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #374151;
}

.schedule-preview p strong {
  display: inline;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
}

/* Dark mode */
.dark .settings-card {
  background: #1e293b;
}

.dark .setting-label {
  color: #f1f5f9;
}

.dark .company-input,
.dark .company-textarea,
.dark .coordinate-input,
.dark .time-input {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

.dark .company-input:focus,
.dark .company-textarea:focus,
.dark .coordinate-input:focus,
.dark .time-input:focus {
  border-color: #667eea;
}

.dark .input-help {
  color: #94a3b8;
}

.dark .file-label {
  background: #334155;
  border-color: #475569;
  color: #94a3b8;
}

.dark .file-label:hover {
  background: #475569;
  border-color: #667eea;
  color: #667eea;
}

.dark .image-preview img {
  border-color: #334155;
}

.dark .map-container {
  background: #334155;
  border-color: #475569;
}

.dark .map-placeholder h4 {
  color: #f1f5f9;
}

.dark .map-placeholder p {
  color: #94a3b8;
}

.dark .map-coordinates {
  background: #1e293b;
  border-color: #334155;
}

.dark .map-coordinates p {
  color: #f1f5f9;
}

.dark .preview-sidebar,
.dark .preview-info {
  background: #334155;
  border-color: #475569;
}

.dark .preview-company-info h3 {
  color: #f1f5f9;
}

.dark .preview-company-slogan {
  color: #94a3b8;
}

.dark .preview-section h4 {
  color: #f1f5f9;
}

.dark .preview-item {
  background: #1e293b;
  border-color: #334155;
}

.dark .preview-item strong {
  color: #60a5fa;
}

.dark .preview-item p {
  color: #f1f5f9;
}

.dark .schedule-preview p {
  color: #f1f5f9;
}

.dark .schedule-preview p strong {
  color: #f1f5f9;
}

/* Banner de cambios pendientes */
.unsaved-changes-banner {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  margin-bottom: 2rem;
  padding: 1rem;
  animation: slideDown 0.3s ease-out;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.banner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #f59e0b;
  color: white;
  border-radius: 50%;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.banner-text h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 0.25rem 0;
}

.banner-text p {
  font-size: 0.875rem;
  color: #a16207;
  margin: 0;
  line-height: 1.4;
}

.banner-actions {
  flex-shrink: 0;
}

.save-btn {
  background: #f59e0b;
  color: white;
  border: none;
  transition: all 0.2s ease;
}

.save-btn:hover {
  background: #d97706;
  transform: translateY(-1px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode para el banner */
.dark .unsaved-changes-banner {
  background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
  border-color: #f59e0b;
}

.dark .banner-icon {
  background: #f59e0b;
}

.dark .banner-text h4 {
  color: #fbbf24;
}

.dark .banner-text p {
  color: #fcd34d;
}

.dark .save-btn {
  background: #f59e0b;
}

.dark .save-btn:hover {
  background: #d97706;
}

/* Modal de confirmación */
.reset-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.reset-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: #fef3c7;
  color: #f59e0b;
  border-radius: 50%;
  flex-shrink: 0;
}

.modal-title h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.modal-title p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.modal-content {
  padding: 1.5rem;
}

.warning-section {
  margin-bottom: 1.5rem;
}

.warning-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 1rem 0;
}

.changes-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.change-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.change-item svg {
  color: #dc2626;
  flex-shrink: 0;
}

.change-item span {
  font-size: 0.875rem;
  color: #991b1b;
  font-weight: 500;
}

.default-values h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #059669;
  margin: 0 0 1rem 0;
}

.defaults-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.default-item {
  padding: 0.5rem;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
}

.default-item span {
  font-size: 0.875rem;
  color: #047857;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 2px solid #e2e8f0;
  justify-content: flex-end;
}

.cancel-btn {
  background: #f8fafc;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.cancel-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.confirm-btn {
  background: #dc2626;
  color: white;
  border: none;
}

.confirm-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode para el modal */
.dark .reset-modal {
  background: #1e293b;
}

.dark .modal-header {
  border-bottom-color: #334155;
}

.dark .modal-icon {
  background: #451a03;
  color: #f59e0b;
}

.dark .modal-title h3 {
  color: #f1f5f9;
}

.dark .modal-title p {
  color: #94a3b8;
}

.dark .warning-section h4 {
  color: #fca5a5;
}

.dark .change-item {
  background: #451a03;
  border-color: #7c2d12;
}

.dark .change-item svg {
  color: #fca5a5;
}

.dark .change-item span {
  color: #fed7d7;
}

.dark .default-values h4 {
  color: #6ee7b7;
}

.dark .default-item {
  background: #064e3b;
  border-color: #065f46;
}

.dark .default-item span {
  color: #a7f3d0;
}

.dark .modal-actions {
  border-top-color: #334155;
}

.dark .cancel-btn {
  background: #334155;
  color: #94a3b8;
  border-color: #475569;
}

.dark .cancel-btn:hover {
  background: #475569;
  border-color: #64748b;
}

.dark .confirm-btn {
  background: #dc2626;
}

.dark .confirm-btn:hover {
  background: #b91c1c;
}

/* Responsive */
@media (max-width: 1024px) {
  .preview-container {
    grid-template-columns: 1fr;
  }
  
  .coordinates-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .schedule-inputs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .schedule-separator {
    display: none;
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .banner-text {
    order: 2;
  }
  
  .banner-actions {
    order: 3;
  }
  
  .reset-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions button {
    width: 100%;
  }
}
</style>