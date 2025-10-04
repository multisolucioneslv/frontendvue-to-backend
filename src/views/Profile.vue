<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Perfil de Usuario</h2>
      <Button @click="editMode = !editMode">
        {{ editMode ? 'Cancelar' : 'Editar' }}
      </Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <Card class="p-6 text-center">
          <div class="flex justify-center mb-4">
            <div class="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
              {{ userInitials }}
            </div>
          </div>
          <h3 class="text-xl font-semibold">{{ user?.name || 'Usuario' }}</h3>
          <p class="text-muted-foreground">{{ user?.email || 'usuario@ejemplo.com' }}</p>
          <p class="text-sm text-muted-foreground mt-2">Administrador</p>
          
          <div class="mt-4 space-y-2">
            <Button variant="outline" size="sm" class="w-full">
              <Camera class="h-4 w-4 mr-2" />
              Cambiar foto
            </Button>
          </div>
        </Card>
      </div>

      <!-- Profile Information -->
      <div class="lg:col-span-2">
        <Card class="p-6">
          <h3 class="text-lg font-semibold mb-4">Información Personal</h3>
          
          <form @submit.prevent="saveProfile" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Nombre</Label>
                <Input 
                  v-model="profileForm.name" 
                  :disabled="!editMode"
                  :class="{ 'border-red-500': validationErrors.name }"
                />
                <p v-if="validationErrors.name" class="text-red-500 text-xs">{{ validationErrors.name }}</p>
              </div>
              <div class="space-y-2">
                <Label>Apellido</Label>
                <Input 
                  v-model="profileForm.lastname" 
                  :disabled="!editMode"
                  :class="{ 'border-red-500': validationErrors.lastname }"
                />
                <p v-if="validationErrors.lastname" class="text-red-500 text-xs">{{ validationErrors.lastname }}</p>
              </div>
            </div>

            <div class="space-y-2">
              <Label>Email</Label>
              <Input 
                v-model="profileForm.email" 
                type="email"
                :disabled="!editMode"
                :class="{ 'border-red-500': validationErrors.email }"
              />
              <p v-if="validationErrors.email" class="text-red-500 text-xs">{{ validationErrors.email }}</p>
            </div>

            <div class="space-y-2">
              <Label>Usuario</Label>
              <Input 
                v-model="profileForm.username" 
                :disabled="!editMode"
                :class="{ 'border-red-500': validationErrors.username }"
              />
              <p v-if="validationErrors.username" class="text-red-500 text-xs">{{ validationErrors.username }}</p>
            </div>

            <div v-if="editMode" class="space-y-2">
              <Label>Nueva contraseña (opcional)</Label>
              <Input 
                v-model="profileForm.password" 
                type="password"
                placeholder="Dejar vacío para no cambiar"
              />
            </div>

            <div v-if="editMode" class="flex justify-end gap-2">
              <Button type="button" variant="outline" @click="cancelEdit">
                Cancelar
              </Button>
              <Button type="submit">
                Guardar cambios
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>

    <!-- Activity Section -->
    <Card class="p-6">
      <h3 class="text-lg font-semibold mb-4">Actividad Reciente</h3>
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <User class="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p class="text-sm font-medium">Perfil actualizado</p>
            <p class="text-xs text-muted-foreground">Hace 2 horas</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <Settings class="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium">Configuraciones modificadas</p>
            <p class="text-xs text-muted-foreground">Hace 1 día</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useValidation } from '@/composables/useValidation'
import { useToast } from '@/composables/useToast'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { Camera, User, Settings } from 'lucide-vue-next'

const authStore = useAuthStore()
const { validateForm, hasErrors } = useValidation()
const { success, error } = useToast()

const editMode = ref(false)
const validationErrors = ref<{ [key: string]: string }>({})

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  const name = user.value?.name || 'Usuario'
  const names = name.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const profileForm = ref({
  name: '',
  lastname: '',
  email: '',
  username: '',
  password: ''
})

const validationRules = {
  name: { required: true, minLength: 2, maxLength: 100 },
  lastname: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, email: true, maxLength: 255 },
  username: { required: true, minLength: 3, maxLength: 50 }
}

const loadProfile = () => {
  if (user.value) {
    profileForm.value = {
      name: user.value.name || '',
      lastname: user.value.lastname || '',
      email: user.value.email || '',
      username: user.value.username || '',
      password: ''
    }
  }
}

const saveProfile = async () => {
  const errors = validateForm(profileForm.value, validationRules)
  
  if (hasErrors(errors)) {
    validationErrors.value = errors
    error('Error de validación', 'Por favor corrige los errores en el formulario')
    return
  }
  
  validationErrors.value = {}
  
  try {
    // Aquí harías la llamada a la API para actualizar el perfil
    success('Éxito', 'Perfil actualizado correctamente')
    editMode.value = false
  } catch (err: any) {
    error('Error', 'No se pudo actualizar el perfil')
  }
}

const cancelEdit = () => {
  loadProfile()
  editMode.value = false
  validationErrors.value = {}
}

onMounted(() => {
  loadProfile()
})
</script>
