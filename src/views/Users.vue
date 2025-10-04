<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Usuarios</h2>
      <Button @click="showModal = true">
        <Plus class="mr-2 h-4 w-4" /> Nuevo Usuario
      </Button>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Buscar por nombre, usuario o correo..."
          class="pl-10"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span class="ml-2 text-gray-600">Cargando usuarios...</span>
    </div>

    <DataTable :columns="columns" :data="users" v-if="!loading">
      <template #header>
        <div></div>
      </template>

      <template #cell-name="{ item }">
        {{ item.name }} {{ item.lastname }}
      </template>

      <template #cell-phone="{ item }">
        {{ item.phone?.phone || '-' }}
      </template>

      <template #cell-sex="{ item }">
        {{ item.sex?.name || '-' }}
      </template>

      <template #cell-status="{ item }">
        <span :class="[
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]">
          {{ item.status === 'active' ? 'Activo' : 'Inactivo' }}
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="editUser(item)">
            <Pencil class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="deleteUser(item.id)">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </template>
    </DataTable>

    <Pagination
      v-if="pagination.total > 0"
      :current-page="pagination.current_page"
      :last-page="pagination.last_page"
      :total="pagination.total"
      :from="pagination.from"
      :to="pagination.to"
      @change="handlePageChange"
    />

    <Dialog :open="showModal" @update:open="showModal = $event" :title="editingUser ? 'Editar Usuario' : 'Nuevo Usuario'">
      <form @submit.prevent="saveUser" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Nombre</Label>
            <Input 
              v-model="form.name" 
              :class="{ 'border-red-500': validationErrors.name }"
              required 
            />
            <p v-if="validationErrors.name" class="text-red-500 text-xs">{{ validationErrors.name }}</p>
          </div>
          <div class="space-y-2">
            <Label>Apellido</Label>
            <Input 
              v-model="form.lastname" 
              :class="{ 'border-red-500': validationErrors.lastname }"
              required 
            />
            <p v-if="validationErrors.lastname" class="text-red-500 text-xs">{{ validationErrors.lastname }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Usuario</Label>
            <Input 
              v-model="form.username" 
              :class="{ 'border-red-500': validationErrors.username }"
              required 
            />
            <p v-if="validationErrors.username" class="text-red-500 text-xs">{{ validationErrors.username }}</p>
          </div>
          <div class="space-y-2">
            <Label>Email</Label>
            <Input 
              v-model="form.email" 
              type="email" 
              :class="{ 'border-red-500': validationErrors.email }"
              required 
            />
            <p v-if="validationErrors.email" class="text-red-500 text-xs">{{ validationErrors.email }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <Label>Contraseña {{ editingUser ? '(dejar vacío para no cambiar)' : '' }}</Label>
          <Input
            v-model="form.password"
            type="password"
            :class="{ 'border-red-500': validationErrors.password }"
            :required="!editingUser"
            :placeholder="editingUser ? 'Dejar vacío para no cambiar' : ''"
          />
          <p v-if="validationErrors.password" class="text-red-500 text-xs">{{ validationErrors.password }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Sexo</Label>
            <select
              v-model="form.sex_id"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Seleccionar...</option>
              <option v-for="sex in sexOptions" :key="sex.id" :value="sex.id">
                {{ sex.name }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label>Estado</Label>
            <select
              v-model="form.status"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Teléfono ID</Label>
            <Input v-model="form.phone_id" type="number" />
          </div>
          <div class="space-y-2">
            <Label>Telegram ID</Label>
            <Input v-model="form.telegram_id" type="number" />
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="closeModal">
            Cancelar
          </Button>
          <Button type="submit">{{ editingUser ? 'Actualizar' : 'Crear' }}</Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api';
import DataTable from '@/components/ui/DataTable.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import { useValidation } from '@/composables/useValidation';

interface User {
  id?: number;
  username: string;
  name: string;
  lastname: string;
  email: string;
  password?: string;
  status: string;
  phone_id?: number;
  telegram_id?: number;
  sex_id?: number;
  phone?: any;
  sex?: any;
}

const { success, error } = useToast();
const { validateForm, hasErrors } = useValidation();
const users = ref<User[]>([]);
const sexOptions = ref<any[]>([]);
const showModal = ref(false);
const editingUser = ref<User | null>(null);
const searchQuery = ref('');
const loading = ref(false);
const validationErrors = ref<{ [key: string]: string }>({});
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
  from: 0,
  to: 0
});

const columns = [
  { key: 'username', label: 'Usuario' },
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'sex', label: 'Sexo' },
  { key: 'status', label: 'Estado' },
];

const form = ref<User>({
  username: '',
  name: '',
  lastname: '',
  email: '',
  password: '',
  status: 'active',
  phone_id: undefined,
  telegram_id: undefined,
  sex_id: undefined
});

const validationRules = {
  username: { required: true, minLength: 3, maxLength: 50 },
  name: { required: true, minLength: 2, maxLength: 100 },
  lastname: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, email: true, maxLength: 255 },
  password: { required: true, minLength: 6 }
};

const loadUsers = async (page = 1, search = '') => {
  loading.value = true;
  try {
    let url = `${API_ENDPOINTS.USERS}?page=${page}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    
    const response = await axios.get(url);

    if (response.data.pagination) {
      users.value = response.data.data.data || response.data.data;
      pagination.value = {
        current_page: response.data.pagination.current_page,
        last_page: response.data.pagination.last_page,
        total: response.data.pagination.total,
        per_page: response.data.pagination.per_page,
        from: response.data.pagination.from || 0,
        to: response.data.pagination.to || 0
      };
    } else {
      users.value = response.data.data || response.data;
    }
  } catch (err: any) {
    console.error('Error loading users:', err);
    error('Error', 'No se pudieron cargar los usuarios. Intenta nuevamente.');
  } finally {
    loading.value = false;
  }
};

// Debounce para la búsqueda
let searchTimeout: number;

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1; // Reset a la primera página
    loadUsers(1, searchQuery.value);
  }, 500); // Esperar 500ms después del último cambio
};

// Watcher para limpiar el timeout al desmontar el componente
watch(() => searchQuery.value, () => {
  if (searchQuery.value === '') {
    loadUsers(1, '');
  }
});

const handlePageChange = (page: number) => {
  loadUsers(page, searchQuery.value);
};

const loadSexOptions = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.SEXS);
    sexOptions.value = response.data.data || response.data;
  } catch (error) {
    console.error('Error loading sex options:', error);
  }
};

const editUser = (user: User) => {
  editingUser.value = user;
  form.value = {
    ...user,
    password: '' // No mostrar la contraseña
  };
  showModal.value = true;
};

const saveUser = async () => {
  // Validar formulario
  const rules = { ...validationRules };
  
  // Si estamos editando, la contraseña no es requerida
  if (editingUser.value) {
    delete rules.password;
  }
  
  const errors = validateForm(form.value, rules);
  
  if (hasErrors(errors)) {
    validationErrors.value = errors;
    error('Error de validación', 'Por favor corrige los errores en el formulario');
    return;
  }
  
  validationErrors.value = {};

  try {
    const userData = { ...form.value };

    // Si estamos editando y la contraseña está vacía, no la enviamos
    if (editingUser.value && !userData.password) {
      delete userData.password;
    }

    if (editingUser.value?.id) {
      await axios.put(`${API_ENDPOINTS.USERS}/${editingUser.value.id}`, userData);
      success('Éxito', 'Usuario actualizado correctamente');
    } else {
      await axios.post(API_ENDPOINTS.USERS, userData);
      success('Éxito', 'Usuario creado correctamente');
    }
    closeModal();
    loadUsers(pagination.value.current_page, searchQuery.value);
  } catch (err: any) {
    console.error('Error saving user:', err);
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al guardar el usuario';
    error('Error', errorMessage);
  }
};

const deleteUser = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    try {
      await axios.delete(`${API_ENDPOINTS.USERS}/${id}`);
      success('Éxito', 'Usuario eliminado correctamente');
      loadUsers(pagination.value.current_page, searchQuery.value);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al eliminar el usuario';
      error('Error', errorMessage);
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  editingUser.value = null;
  validationErrors.value = {};
  form.value = {
    username: '',
    name: '',
    lastname: '',
    email: '',
    password: '',
    status: 'active',
    phone_id: undefined,
    telegram_id: undefined,
    sex_id: undefined
  };
};

onMounted(() => {
  loadUsers();
  loadSexOptions();
});
</script>
