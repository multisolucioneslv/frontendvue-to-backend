<template>
  <div class="login-container" :style="containerStyle">
    <div class="login-card" :class="{ 'minimal-card': loginTemplate === 'minimal' }">
      <div class="login-header">
        <div v-if="logo" class="login-logo">
          <img :src="logo" alt="Logo" />
        </div>
        <h1>Bienvenido</h1>
        <p>Inicia sesión en tu cuenta</p>
      </div>

      <div class="login-options">
        <button
          :class="['option-btn', { active: loginType === 'username' }]"
          @click="loginType = 'username'"
        >
          Usuario
        </button>
        <button
          :class="['option-btn', { active: loginType === 'email' }]"
          @click="loginType = 'email'"
        >
          Correo
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label :for="loginType">
            {{ loginType === 'username' ? 'Usuario' : 'Correo Electrónico' }}
          </label>
          <div class="input-wrapper">
            <i :class="loginType === 'username' ? 'icon-user' : 'icon-email'"></i>
            <input
              :id="loginType"
              v-model="credentials.identifier"
              :type="loginType === 'email' ? 'email' : 'text'"
              :placeholder="loginType === 'username' ? 'Ingresa tu usuario' : 'Ingresa tu correo'"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <i class="icon-lock"></i>
            <input
              id="password"
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingresa tu contraseña"
              required
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'icon-eye-off' : 'icon-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Recordarme</span>
          </label>
          <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div v-if="showRegister" class="signup-link">
        ¿No tienes cuenta? <a href="#">Regístrate</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useSettings } from '@/composables/useSettings';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const { settings, loadSettings } = useSettings();

    const loginType = ref<'username' | 'email'>('username');
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');

    const credentials = ref({
      identifier: '',
      password: ''
    });

    const handleLogin = async () => {
      if (!credentials.value.identifier || !credentials.value.password) {
        errorMessage.value = 'Por favor completa todos los campos';
        return;
      }

      isLoading.value = true;
      errorMessage.value = '';

      const result = await authStore.login({
        identifier: credentials.value.identifier,
        password: credentials.value.password,
        type: loginType.value
      });

      isLoading.value = false;

      if (result.success) {
        router.push('/app/dashboard');
      } else {
        errorMessage.value = result.message || 'Error al iniciar sesión';
      }
    };

    // Computed properties para configuraciones de branding
    const loginBackground = computed(() => {
      return settings.value?.branding?.loginBackground || '';
    });
    const logo = computed(() => {
      return settings.value?.branding?.logo || '';
    });
    const loginTemplate = computed(() => {
      return settings.value?.branding?.loginTemplate || 'default';
    });
    const showRegister = computed(() => {
      return settings.value?.branding?.showRegister ?? true;
    });

    // Estilos dinámicos basados en configuración
    const containerStyle = computed(() => {
      const styles: any = {};
      const backgroundSize = settings.value?.branding?.backgroundSize || 'cover';
      const backgroundPosition = settings.value?.branding?.backgroundPosition || 'center';
      const backgroundRepeat = settings.value?.branding?.backgroundRepeat || 'no-repeat';
      const backgroundAttachment = settings.value?.branding?.backgroundAttachment || 'scroll';

      if (loginBackground.value) {
        styles.backgroundImage = `url(${loginBackground.value})`;
        styles.backgroundSize = backgroundSize;
        styles.backgroundPosition = backgroundPosition;
        styles.backgroundRepeat = backgroundRepeat;
        styles.backgroundAttachment = backgroundAttachment;
      }

      // Aplicar estilos según el template seleccionado
      switch (loginTemplate.value) {
        case 'modern':
          if (loginBackground.value) {
            styles.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${loginBackground.value})`;
            styles.backgroundSize = backgroundSize;
            styles.backgroundPosition = backgroundPosition;
            styles.backgroundRepeat = backgroundRepeat;
            styles.backgroundAttachment = backgroundAttachment;
          }
          break;
        case 'minimal':
          styles.background = '#ffffff';
          break;
        case 'gradient':
          if (!loginBackground.value) {
            styles.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
            styles.backgroundSize = '200% 200%';
            styles.animation = 'gradientShift 10s ease infinite';
          }
          break;
        default:
          if (!loginBackground.value) {
            styles.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          }
      }

      return styles;
    });

    onMounted(() => {
      loadSettings();
    });

    return {
      loginType,
      showPassword,
      rememberMe,
      credentials,
      handleLogin,
      isLoading,
      errorMessage,
      loginBackground,
      logo,
      loginTemplate,
      showRegister,
      containerStyle
    };
  }
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-logo {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.login-logo img {
  max-width: 200px;
  max-height: 80px;
  object-fit: contain;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.minimal-card {
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.login-header h1 {
  color: #333;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.login-options {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  background: #f5f5f5;
  padding: 6px;
  border-radius: 12px;
}

.option-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-wrapper i {
  position: absolute;
  left: 16px;
  color: #999;
  font-size: 18px;
  pointer-events: none;
}

.input-wrapper i::before {
  font-style: normal;
}

.icon-user::before { content: "👤"; }
.icon-email::before { content: "📧"; }
.icon-lock::before { content: "🔒"; }
.icon-eye::before { content: "👁️"; }
.icon-eye-off::before { content: "👁️‍🗨️"; }

.input-wrapper input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
}

.input-wrapper input[type="password"],
.input-wrapper input[type="text"]#password {
  padding-right: 50px;
}

.input-wrapper input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #999;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  line-height: 1;
  height: 32px;
  width: 32px;
}

.toggle-password:hover {
  color: #667eea;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.remember-me input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #764ba2;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #fcc;
  margin-top: 10px;
}

.login-btn {
  margin-top: 10px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: #764ba2;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 24px;
  }

  .login-header h1 {
    font-size: 28px;
  }
}
</style>
