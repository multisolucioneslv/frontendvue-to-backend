<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      @click="toggleMenu"
      class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground"
    >
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
        {{ userInitials }}
      </div>
      <div v-if="!collapsed" class="text-left">
        <p class="font-medium">{{ userName }}</p>
        <p class="text-xs text-muted-foreground">{{ userRole }}</p>
      </div>
      <ChevronDown 
        v-if="!collapsed"
        :class="['h-4 w-4 transition-transform', isOpen && 'rotate-180']"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transform ease-out duration-200 transition"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border bg-background shadow-lg"
      >
        <!-- Header -->
        <div class="border-b p-4">
          <p class="text-sm font-medium text-muted-foreground">¡Bienvenido {{ userName.split(' ')[0] }}!</p>
          <div class="mt-2 flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {{ userInitials }}
            </div>
            <div>
              <p class="font-medium">{{ userName }}</p>
              <p class="text-xs text-muted-foreground">{{ userRole }}</p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="p-2">
          <button
            @click="navigateToProfile"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <User class="h-4 w-4" />
            Perfil
          </button>

          <button
            @click="toggleSettings"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Settings class="h-4 w-4" />
            Configuraciones
            <span class="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">Nuevo</span>
          </button>

          <div class="my-2 h-px bg-border" />

          <!-- Theme Toggle -->
          <button
            @click="handleToggleTheme"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <component :is="themeIcon" class="h-4 w-4" />
            {{ themeText }}
          </button>

          <div class="my-2 h-px bg-border" />

          <button
            @click="handleLogout"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut class="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </Transition>

    <!-- Settings Modal -->
    <SettingsModal 
      :is-open="showSettings" 
      @update:is-open="showSettings = $event" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'
import SettingsModal from './SettingsModal.vue'
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Sun, 
  Moon 
} from 'lucide-vue-next'

interface Props {
  collapsed?: boolean
}

withDefaults(defineProps<Props>(), {
  collapsed: false
})

const emit = defineEmits<{
  logout: []
}>()

const router = useRouter()
const authStore = useAuthStore()
const { success } = useToast()
const { isDark, toggleTheme } = useTheme()

const isOpen = ref(false)
const showSettings = ref(false)

// Computed properties
const userName = computed(() => {
  const user = authStore.user
  if (!user) return 'Usuario'

  const firstName = user.name || ''
  const lastName = user.lastname || ''

  return `${firstName} ${lastName}`.trim() || 'Usuario'
})

const userRole = computed(() => {
  const user = authStore.user
  if (!user) return 'Usuario'

  // Si tiene roles como array (Laravel común)
  if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles[0] // Mostrar el primer rol
  }

  // Fallback al campo role si existe
  return user.role || 'Usuario'
})

const userInitials = computed(() => {
  const name = userName.value
  const names = name.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const themeIcon = computed(() => {
  return isDark.value ? Sun : Moon
})

const themeText = computed(() => {
  return isDark.value ? 'Tema claro' : 'Tema oscuro'
})

// Methods
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const navigateToProfile = () => {
  closeMenu()
  router.push('/app/profile')
}

const toggleSettings = () => {
  closeMenu()
  router.push('/app/settings')
}

const handleToggleTheme = () => {
  toggleTheme()
  success('Tema', `Cambiado a tema ${themeText.value.toLowerCase()}`)
}

const handleLogout = () => {
  closeMenu()
  emit('logout')
}

// Close menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.relative')) {
      closeMenu()
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
