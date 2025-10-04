<template>
  <Dialog :open="isOpen" @update:open="updateOpen" title="Configuraciones">
    <div class="space-y-6">
      <!-- Theme Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Apariencia</h3>
        
        <div class="space-y-3">
          <Label>Tema</Label>
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                :value="false"
                v-model="settings.theme"
                @change="updateTheme"
                class="h-4 w-4"
              />
              <Sun class="h-4 w-4" />
              <span>Claro</span>
            </label>
            
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                :value="true"
                v-model="settings.theme"
                @change="updateTheme"
                class="h-4 w-4"
              />
              <Moon class="h-4 w-4" />
              <span>Oscuro</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Language Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Idioma</h3>
        
        <div class="space-y-2">
          <Label>Idioma de la interfaz</Label>
          <select
            v-model="settings.language"
            @change="updateLanguage"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Notificaciones</h3>
        
        <div class="space-y-3">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="settings.notifications.email"
              @change="updateNotifications"
              class="h-4 w-4"
            />
            <span>Notificaciones por email</span>
          </label>
          
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="settings.notifications.push"
              @change="updateNotifications"
              class="h-4 w-4"
            />
            <span>Notificaciones push</span>
          </label>
          
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="settings.notifications.sound"
              @change="updateNotifications"
              class="h-4 w-4"
            />
            <span>Sonido de notificaciones</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" @click="resetSettings">
          Restablecer
        </Button>
        <Button @click="saveSettings">
          Guardar
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from './Dialog.vue'
import Button from './Button.vue'
import Label from './Label.vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'

interface Settings {
  theme: boolean
  language: string
  notifications: {
    email: boolean
    push: boolean
    sound: boolean
  }
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const { success } = useToast()
const { isDark, setTheme } = useTheme()

const settings = ref<Settings>({
  theme: false,
  language: 'es',
  notifications: {
    email: true,
    push: true,
    sound: false
  }
})

const updateOpen = (value: boolean) => {
  emit('update:isOpen', value)
}

const loadSettings = () => {
  const saved = localStorage.getItem('userSettings')
  if (saved) {
    settings.value = { ...settings.value, ...JSON.parse(saved) }
  } else {
    // Cargar tema actual desde el composable
    settings.value.theme = isDark.value
  }
}

const updateTheme = () => {
  setTheme(settings.value.theme)
}

const updateLanguage = () => {
  // Aquí puedes implementar el cambio de idioma
  console.log('Language changed to:', settings.value.language)
}

const updateNotifications = () => {
  // Aquí puedes implementar la configuración de notificaciones
  console.log('Notifications updated:', settings.value.notifications)
}

const saveSettings = () => {
  localStorage.setItem('userSettings', JSON.stringify(settings.value))
  success('Configuraciones', 'Configuraciones guardadas correctamente')
  updateOpen(false)
}

const resetSettings = () => {
  settings.value = {
    theme: false,
    language: 'es',
    notifications: {
      email: true,
      push: true,
      sound: false
    }
  }
  localStorage.removeItem('userSettings')
  updateTheme()
  success('Configuraciones', 'Configuraciones restablecidas')
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadSettings()
  }
})
</script>
