<!--
 * ============================================================================
 * LOGIN COMPONENT - SISTEMA MULTI-SERVICIO
 * ============================================================================
 * 
 * ⚠️  IMPORTANTE: SETUP INICIAL TEMPORALMENTE DESHABILITADO
 * 
 * Este componente ha sido modificado para deshabilitar temporalmente el sistema
 * de configuración inicial. Los cambios están marcados con comentarios
 * que indican cómo revertir las modificaciones.
 * 
 * 🔧 CAMBIOS REALIZADOS:
 * 1. Sección de "Configuración Inicial Requerida" comentada completamente
 * 2. Import de useInitialSetup comentado
 * 3. Función isSetupCompleted comentada
 * 4. Función goToSetup comentada
 * 5. onMounted que verificaba setup comentado
 * 6. Estilos de configuración inicial comentados
 * 7. Export statements removidos (no compatibles con <script setup>)
 * 8. CORREGIDO: Parámetros de login para que coincidan con el store
 * 
 * 📝 PARA REHABILITAR EL SETUP INICIAL:
 * 1. Buscar comentarios "TEMPORALMENTE DESHABILITADO"
 * 2. Descomentar las secciones marcadas
 * 3. Restaurar la lógica condicional v-if="isSetupCompleted"
 * 4. Importar useInitialSetup de nuevo
 * 5. Restaurar export statements si es necesario
 * 
 * 📋 ARCHIVOS RELACIONADOS QUE TAMBIÉN FUERON MODIFICADOS:
 * - frontendvue/src/router/index.ts (middleware y rutas de setup)
 * - Ver archivo: SETUP_DISABLED_GUIDE.md para documentación completa
 * 
 * ============================================================================
 -->

<template>
  <div class="login-container" :style="containerStyle">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="logo-section">
          <img :src="logoUrl" alt="Logo" class="logo" />
          <h1 class="app-title">{{ appName }}</h1>
        </div>
      </div>

      <!-- TEMPORALMENTE DESHABILITADO: Configuración Inicial -->
      <!-- Para revertir: descomentar esta sección completa y restaurar la lógica v-if="!isSetupCompleted" -->
      <!-- <div v-if="!isSetupCompleted" class="setup-section">
        <div class="setup-message">
          <div class="setup-icon">
            <Settings class="h-8 w-8 text-blue-600" />
          </div>
          <div class="setup-text">
            <h3>Configuración Inicial Requerida</h3>
            <p>Antes de usar el sistema, necesitas configurar el tipo de sistema que deseas implementar.</p>
          </div>
        </div>
        
        <button @click="goToSetup" class="setup-btn">
          <Settings class="h-5 w-5 mr-2" />
          Configurar Sistema
        </button>
        
        <div class="setup-note">
          <p>Una vez configurado, podrás iniciar sesión normalmente.</p>
        </div>
      </div> -->

      <!-- Formulario de Login (siempre visible temporalmente) -->
      <!-- MODIFICADO: Removido v-if="isSetupCompleted" -->
      <!-- Para revertir: cambiar <div> por <div v-if="isSetupCompleted"> -->
      <div>
        <div class="login-options">
          <button
            :class="['option-btn', { active: loginType === 'username' }]"
            @click="loginType = 'username'"
          >
            <User class="h-4 w-4 mr-2" />
            Usuario
          </button>
          <button
            :class="['option-btn', { active: loginType === 'email' }]"
            @click="loginType = 'email'"
          >
            <Mail class="h-4 w-4 mr-2" />
            Email
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label :for="loginType" class="form-label">
              {{ loginType === 'username' ? 'Usuario' : 'Email' }}
            </label>
            <div class="input-wrapper">
              <component
                :is="loginType === 'username' ? User : Mail"
                class="input-icon"
              />
              <input
                :id="loginType"
                v-model="credentials.identifier"
                :type="loginType === 'email' ? 'email' : 'text'"
                :placeholder="loginType === 'username' ? 'Ingresa tu usuario' : 'Ingresa tu email'"
                class="form-input"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="input-wrapper">
              <Lock class="input-icon" />
              <input
                id="password"
                v-model="credentials.password"
                type="password"
                placeholder="Ingresa tu contraseña"
                class="form-input"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">
            <AlertCircle class="h-4 w-4 mr-2" />
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="login-btn"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
            <LogIn v-else class="h-4 w-4 mr-2" />
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <!-- Enlace de registro (si está habilitado) -->
        <div v-if="showRegister" class="register-section">
          <p class="register-text">
            ¿No tienes una cuenta?
            <a href="#" class="register-link" @click.prevent="showRegisterModal = true">
              Regístrate aquí
            </a>
          </p>
        </div>

        <!-- Enlaces adicionales -->
        <div class="additional-links">
          <a href="#" class="link">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>

    <!-- Modal de registro -->
    <div v-if="showRegisterModal" class="modal-overlay" @click="showRegisterModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Registro de Usuario</h3>
          <button @click="showRegisterModal = false" class="modal-close">
            <X class="h-4 w-4" />
          </button>
        </div>
        <div class="modal-body">
          <p>El registro de nuevos usuarios debe ser realizado por un administrador del sistema.</p>
          <p>Contacta al administrador para obtener acceso.</p>
        </div>
        <div class="modal-footer">
          <button @click="showRegisterModal = false" class="btn-secondary">
            Entendido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
 * ============================================================================
 * LOGIN COMPONENT SCRIPT - SETUP INICIAL DESHABILITADO
 * ============================================================================
 * 
 * IMPORTANTE: Este script ha sido modificado para deshabilitar temporalmente
 * el sistema de configuración inicial. Buscar comentarios "TEMPORALMENTE DESHABILITADO"
 * para identificar las modificaciones.
 * 
 * NOTA: En <script setup> no se pueden usar export statements.
 * Todas las variables y funciones declaradas están automáticamente disponibles.
 * 
 * CORREGIDO: Los parámetros de login ahora coinciden con lo que espera el store.
 * 
 * ============================================================================
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettings } from '@/composables/useSettings'
// TEMPORALMENTE DESHABILITADO: useInitialSetup
// Para revertir: descomentar la siguiente línea
// import { useInitialSetup } from '@/composables/useInitialSetup'
import { 
  User, 
  Mail, 
  Lock, 
  LogIn, 
  Loader2, 
  AlertCircle, 
  Settings,
  X
} from 'lucide-vue-next'
// CORREGIDO: Logo configurado para usar archivo en public

const router = useRouter()
const authStore = useAuthStore()
const { settings } = useSettings()

// TEMPORALMENTE DESHABILITADO: useInitialSetup
// Para revertir: descomentar las siguientes líneas
// const { isInitialSetupCompleted, checkSetupStatus } = useInitialSetup()

const isLoading = ref(false)
const errorMessage = ref('')
const showRegisterModal = ref(false)
const loginType = ref<'username' | 'email'>('username')

const credentials = ref({
  identifier: '',
  password: ''
});

// TEMPORALMENTE DESHABILITADO: Verificar estado del setup inicial
// Para revertir: descomentar esta función completa
// const isSetupCompleted = computed(() => {
//   console.log('🔍 Login - Verificando estado del setup:', isInitialSetupCompleted.value)
//   // Por ahora usar el composable, pero después se cambiará a API directa
//   return isInitialSetupCompleted.value;
// });

// TEMPORALMENTE DESHABILITADO: Función para ir a configuración
// Para revertir: descomentar esta función completa
// const goToSetup = () => {
//   console.log('🚀 Navegando a configuración inicial...')
//   window.location.href = '/initial-setup'
// };

// CORREGIDO: handleLogin ahora pasa los parámetros correctos al store
const handleLogin = async () => {
  if (!credentials.value.identifier || !credentials.value.password) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    console.log('🔐 Intentando iniciar sesión...')
    console.log('📋 Datos del formulario:', {
      identifier: credentials.value.identifier,
      password: credentials.value.password,
      type: loginType.value
    })
    
    // CORREGIDO: Ahora paso un objeto con la estructura que espera el store
    const result = await authStore.login({
      identifier: credentials.value.identifier,
      password: credentials.value.password,
      type: loginType.value
    })

    if (result.success) {
      console.log('✅ Login exitoso, redirigiendo...')
      
      // Verificar si viene de configuración inicial
      const redirectTo = router.currentRoute.value.query.redirect as string
      const targetRoute = redirectTo || '/app/dashboard'
      
      console.log('🎯 Redirigiendo a:', targetRoute)
      await router.push(targetRoute)
    } else {
      console.log('❌ Login falló:', result.message)
      errorMessage.value = result.message || 'Credenciales incorrectas'
    }
  } catch (error) {
    console.error('❌ Error durante login:', error)
    errorMessage.value = 'Error al iniciar sesión. Intenta nuevamente.'
  } finally {
    isLoading.value = false
  }
}

// Configuración de la aplicación
const appName = computed(() => settings.value.branding?.companyName || 'Mi Sistema')
const logoUrl = computed(() => {
  // Primero intentar usar el logo de la empresa configurado
  if (settings.value.branding?.logo) {
    return settings.value.branding.logo
  }
  // Si no hay logo de empresa, usar el logo de Vue como fallback
  return '/logo.png'
})
const showRegister = computed(() => settings.value.branding?.showRegister === true) // Solo mostrar si es explícitamente true

// Estilo del contenedor basado en la configuración
const containerStyle = computed(() => {
  const primaryColor = settings.value.primaryColor || '#667eea'
  const secondaryColor = settings.value.secondaryColor || '#764ba2'
  
  return {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
  }
})

// TEMPORALMENTE DESHABILITADO: Verificar setup al montar
// Para revertir: descomentar estas líneas y comentar las líneas de abajo
// onMounted(async () => {
//   console.log('🚀 Login montado, verificando setup...')
//   await checkSetupStatus()
//   console.log('✅ Verificación de setup completada')
// })

// MODIFICADO: onMounted simplificado sin verificación de setup
onMounted(() => {
  console.log('🚀 Login montado (setup deshabilitado temporalmente)')
})

// TEMPORALMENTE DESHABILITADO: Export statements
// En <script setup> no se pueden usar export statements.
// Todas las variables y funciones están automáticamente disponibles.
// Para revertir: si es necesario exportar, cambiar a <script> normal
// export {
//   showRegister,
//   containerStyle,
//   isSetupCompleted,
//   goToSetup
// };
</script>

<style scoped>
/*
 * ============================================================================
 * LOGIN COMPONENT STYLES - SETUP INICIAL DESHABILITADO
 * ============================================================================
 * 
 * IMPORTANTE: Los estilos de configuración inicial han sido comentados.
 * Buscar comentarios "TEMPORALMENTE DESHABILITADO" para identificar los estilos
 * que fueron modificados.
 * 
 * ============================================================================
 */

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--background, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 100%;
  max-width: 200px;
  height: auto;
  max-height: 80px;
  border-radius: 12px;
  object-fit: contain;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* TEMPORALMENTE DESHABILITADO: Estilos para configuración inicial */
/* Para revertir: descomentar todos los estilos desde aquí hasta el comentario de fin */

/* .setup-section {
  text-align: center;
  padding: 2rem 0;
}

.setup-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.setup-icon {
  background: #dbeafe;
  border-radius: 50%;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.setup-text h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.setup-text p {
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.setup-btn {
  background: var(--primary-color, #667eea);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto 1rem auto;
  min-width: 200px;
}

.setup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.setup-note {
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
  border-left: 4px solid var(--primary-color, #667eea);
}

.setup-note p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
} */

/* Fin de estilos temporalmente deshabilitados */

.login-options {
  display: flex;
  background: #f3f4f6;
  border-radius: 0.75rem;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
}

.option-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.option-btn.active {
  background: white;
  color: #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  width: 1rem;
  height: 1rem;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color, #667eea);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-btn {
  background: var(--primary-color, #667eea);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
  min-height: 48px;
  visibility: visible;
  opacity: 1;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.register-section {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  visibility: visible;
  opacity: 1;
  display: block;
}

.register-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.register-link {
  color: var(--primary-color, #667eea);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.register-link:hover {
  color: var(--secondary-color, #764ba2);
  text-decoration: underline;
}

.additional-links {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  visibility: visible;
  opacity: 1;
}

.link {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.link:hover {
  color: var(--primary-color, #667eea);
}

/* Modal */
.modal-overlay {
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1rem 1.5rem;
}

.modal-body p {
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.modal-body p:last-child {
  margin-bottom: 0;
}

.modal-footer {
  padding: 0 1.5rem 1.5rem 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Responsive */
@media (max-width: 640px) {
  .login-container {
    padding: 0.5rem;
  }
  
  .login-card {
    padding: 1.5rem;
  }
  
  .app-title {
    font-size: 1.25rem;
  }
  
  .logo {
    width: 100%;
    max-width: 150px;
    max-height: 60px;
  }
}
</style>