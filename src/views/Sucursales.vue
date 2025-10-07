<template>
  <div class="space-y-6">
    <PageHeader title="Sucursales" subtitle="Gestiona las sucursales de tu empresa" :icon="Building">
      <template #actions>
        <Button @click="nuevaSucursal">
          <Plus class="mr-2 h-4 w-4" /> Nueva Sucursal
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

    <!-- Tabla de sucursales -->
    <DataTable 
      :columns="columns" 
      :data="filteredSucursales"
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
            <Building class="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.code }}</div>
          </div>
        </div>
      </template>

      <template #cell-address="{ item }">
        <div class="text-sm">
          <div>{{ item.address }}</div>
          <div class="text-gray-500 dark:text-gray-400">{{ item.city }}, {{ item.state }}</div>
        </div>
      </template>

      <template #cell-phone="{ item }">
        <span class="text-sm">{{ item.phone || 'Sin teléfono' }}</span>
      </template>

      <template #cell-email="{ item }">
        <span class="text-sm">{{ item.email || 'Sin email' }}</span>
      </template>

      <template #cell-status="{ item }">
        <span :class="item.status === 'active' ? 'text-green-600' : 'text-red-600'">
          {{ item.status === 'active' ? 'Activa' : 'Inactiva' }}
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" @click="editarSucursal(item)" title="Editar">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" @click="verSucursal(item)" title="Ver">
            <Eye class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="eliminarSucursal(item)" title="Eliminar">
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
import { Plus, Search, Edit, Trash2, Eye, Building } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const { success, error: showError } = useToast();
const router = useRouter();

// Estado
const sucursales = ref([]);
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
  { key: 'name', label: 'Sucursal', sortable: true },
  { key: 'address', label: 'Dirección', sortable: true },
  { key: 'phone', label: 'Teléfono', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Estado', sortable: true }
]);

// Computed
const sortOrderComputed = computed(() => {
  return sortOrder.value as 'asc' | 'desc';
});

const filteredSucursales = computed(() => {
  // Asegurar que siempre tenemos un array iterable
  const sucursalesArray = Array.isArray(sucursales.value) ? sucursales.value : [];
  let filtered = [...sucursalesArray];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(sucursal => 
      sucursal?.name?.toLowerCase().includes(query) ||
      sucursal?.code?.toLowerCase().includes(query) ||
      sucursal?.address?.toLowerCase().includes(query) ||
      sucursal?.city?.toLowerCase().includes(query) ||
      sucursal?.state?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Métodos
const cargarSucursales = async () => {
  try {
    const params: any = {
      per_page: perPage.value === 'all' ? 1000 : perPage.value,
      page: pagination.value.current_page,
      sort_by: sortBy.value,
      sort_direction: sortOrder.value
    };
    
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    
    const response = await axios.get('/sucursales', { params });
    sucursales.value = response.data.data;
    
    // Actualizar paginación
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to
    };
  } catch (err) {
    console.error('Error al cargar sucursales:', err);
    showError('Error', 'No se pudieron cargar las sucursales');
  }
};

const nuevaSucursal = () => {
  router.push('/app/sucursales/create');
};

const editarSucursal = (sucursal: any) => {
  router.push(`/app/sucursales/${sucursal.id}/edit`);
};

const verSucursal = (sucursal: any) => {
  router.push(`/app/sucursales/${sucursal.id}`);
};

const eliminarSucursal = async (sucursal: any) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar la sucursal "${sucursal.name}"?`)) {
    return;
  }
  
  try {
    await axios.delete(`/sucursales/${sucursal.id}`);
    success('Éxito', 'Sucursal eliminada correctamente');
    cargarSucursales();
  } catch (err) {
    console.error('Error al eliminar sucursal:', err);
    showError('Error', 'No se pudo eliminar la sucursal');
  }
};

const handleSearch = () => {
  pagination.value.current_page = 1;
  cargarSucursales();
};

const handlePerPageChange = () => {
  pagination.value.current_page = 1;
  cargarSucursales();
};

const handlePageChange = (page: number) => {
  pagination.value.current_page = page;
  cargarSucursales();
};

const handleSortChange = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key;
  sortOrder.value = order;
  cargarSucursales();
};

// Lifecycle
onMounted(() => {
  cargarSucursales();
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>