<template>
  <div class="space-y-6">
    <PageHeader title="Usuarios" subtitle="Gestiona los usuarios del sistema" :icon="Users">
      <template #actions>
        <Button @click="nuevoUsuario">
          <Plus class="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </template>
    </PageHeader>

    <!-- Controles superiores -->
    <div class="flex items-center justify-between mb-4">
      <!-- Selector de entradas por página (izquierda) -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">Mostrar</span>
        <select 
          v-model="perPage" 
          @change="handlePerPageChange"
          class="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="all">Todos</option>
        </select>
        <span class="text-sm text-muted-foreground">entradas por página</span>
      </div>
      
      <!-- Barra de búsqueda (derecha) -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Buscar..."
          class="pl-10 w-64"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <DataTable 
      :columns="columns" 
      :data="filteredUsers"
      :sort-by="sortBy"
      :sort-order="sortOrderComputed"
      @sort="handleSortChange"
    >
      <template #header>
        <div></div>
      </template>

      <template #cell-name="{ item }">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
                {{ item.name?.charAt(0) || '?' }}
              </span>
            </div>
          </div>
          <div>
            <div class="font-medium">{{ item.name }} {{ item.lastname }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">@{{ item.username }}</div>
          </div>
        </div>
      </template>

      <template #cell-email="{ item }">
        <span class="text-sm">{{ item.email }}</span>
      </template>

      <template #cell-role="{ item }">
        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {{ item.role || 'Usuario' }}
        </span>
      </template>

      <template #cell-status="{ item }">
        <span :class="item.status === 'active' ? 'text-green-600' : 'text-red-600'">
          {{ item.status === 'active' ? 'Activo' : 'Inactivo' }}
        </span>
      </template>

      <template #cell-created_at="{ item }">
        <span class="text-sm">{{ formatearFecha(item.created_at) }}</span>
      </template>

      <template #actions="{ item }">
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" @click="editarUsuario(item)" title="Editar">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" @click="verUsuario(item)" title="Ver">
            <Eye class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="eliminarUsuario(item)" title="Eliminar">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </template>
    </DataTable>

    <!-- Paginación -->
    <Pagination
      v-if="pagination.total > 0"
      :current-page="pagination.current_page"
      :last-page="pagination.last_page"
      :total="pagination.total"
      :from="pagination.from"
      :to="pagination.to"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/config/axios';
import DataTable from '@/components/ui/DataTable.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import PageHeader from '@/components/ui/PageHeader.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const { success, error: showError } = useToast();
const router = useRouter();

// Estado
const users = ref([]);
const searchQuery = ref('');
const perPage = ref('10');
const sortBy = ref('name');
const sortOrder = ref('asc');

// Paginación
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  from: 0,
  to: 0
});

// Columnas de la tabla
const columns = ref([
  { key: 'name', label: 'Usuario', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'status', label: 'Estado', sortable: true },
  { key: 'created_at', label: 'Fecha Registro', sortable: true }
]);

// Computed
const sortOrderComputed = computed(() => {
  return sortOrder.value as 'asc' | 'desc';
});

const filteredUsers = computed(() => {
  // Asegurar que siempre tenemos un array iterable
  const usersArray = Array.isArray(users.value) ? users.value : [];
  let filtered = [...usersArray];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user?.name?.toLowerCase().includes(query) ||
      user?.lastname?.toLowerCase().includes(query) ||
      user?.username?.toLowerCase().includes(query) ||
      user?.email?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Métodos
const cargarUsers = async () => {
  try {
    console.log('🔄 Cargando usuarios...')
    
    const params: any = {
      per_page: perPage.value === 'all' ? 1000 : perPage.value,
      page: pagination.value.current_page,
      sort_by: sortBy.value,
      sort_direction: sortOrder.value
    };
    
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    
    console.log('📋 Parámetros de la petición:', params)
    
    const response = await axios.get('/users', { params });
    console.log('📦 Respuesta completa:', response.data)
    
    // Manejar diferentes estructuras de respuesta
    let usersData = response.data.data
    if (Array.isArray(usersData)) {
      users.value = usersData
    } else if (usersData && usersData.data) {
      users.value = usersData.data
    } else {
      users.value = response.data.data || []
    }
    
    console.log('✅ Usuarios cargados:', users.value.length, 'usuarios')
    console.log('👥 Lista de usuarios:', users.value.map(u => ({ id: u.id, name: u.name, email: u.email })))
    
    // Actualizar paginación
    pagination.value = {
      current_page: response.data.current_page || 1,
      last_page: response.data.last_page || 1,
      total: response.data.total || 0,
      from: response.data.from || 0,
      to: response.data.to || 0
    };
    
    console.log('📄 Paginación actualizada:', pagination.value)
  } catch (err) {
    console.error('❌ Error al cargar usuarios:', err);
    console.error('❌ Detalles del error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    showError('Error', 'No se pudieron cargar los usuarios');
  }
};

const nuevoUsuario = () => {
  router.push('/app/users/create');
};

const editarUsuario = (user: any) => {
  router.push(`/app/users/${user.id}/edit`);
};

const verUsuario = (user: any) => {
  router.push(`/app/users/${user.id}`);
};

const eliminarUsuario = async (user: any) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name} ${user.lastname}"?`)) {
    return;
  }
  
  try {
    await axios.delete(`/users/${user.id}`);
    success('Éxito', 'Usuario eliminado correctamente');
    cargarUsers();
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    showError('Error', 'No se pudo eliminar el usuario');
  }
};

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleSearch = () => {
  pagination.value.current_page = 1;
  cargarUsers();
};

const handlePerPageChange = () => {
  pagination.value.current_page = 1;
  cargarUsers();
};

const handlePageChange = (page: number) => {
  pagination.value.current_page = page;
  cargarUsers();
};

const handleSortChange = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key;
  sortOrder.value = order;
  cargarUsers();
};

// Lifecycle
onMounted(() => {
  cargarUsers();
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>