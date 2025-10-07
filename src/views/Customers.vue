<template>
  <div class="space-y-6">
    <PageHeader title="Clientes" subtitle="Gestiona tu base de clientes" :icon="Users">
      <template #actions>
        <Button @click="nuevoCliente">
          <Plus class="mr-2 h-4 w-4" /> Nuevo Cliente
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

    <!-- Tabla de clientes -->
    <DataTable 
      :columns="columns" 
      :data="filteredCustomers"
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
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.company || 'Sin empresa' }}</div>
          </div>
        </div>
      </template>

      <template #cell-email="{ item }">
        <span class="text-sm">{{ item.email || 'Sin email' }}</span>
      </template>

      <template #cell-phone="{ item }">
        <span class="text-sm">{{ item.phone_number || 'Sin teléfono' }}</span>
      </template>

      <template #cell-created_at="{ item }">
        <span class="text-sm">{{ formatearFecha(item.created_at) }}</span>
      </template>

      <template #actions="{ item }">
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" @click="editarCliente(item)" title="Editar">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" @click="verCliente(item)" title="Ver">
            <Eye class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="eliminarCliente(item)" title="Eliminar">
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
const customers = ref([]);
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
  { key: 'name', label: 'Cliente', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Teléfono', sortable: true },
  { key: 'created_at', label: 'Fecha Registro', sortable: true }
]);

// Computed
const sortOrderComputed = computed(() => {
  return sortOrder.value as 'asc' | 'desc';
});

const filteredCustomers = computed(() => {
  // Asegurar que siempre tenemos un array iterable
  const customersArray = Array.isArray(customers.value) ? customers.value : [];
  let filtered = [...customersArray];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(customer => 
      customer?.name?.toLowerCase().includes(query) ||
      customer?.lastname?.toLowerCase().includes(query) ||
      customer?.email?.toLowerCase().includes(query) ||
      customer?.company?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Métodos
const cargarCustomers = async () => {
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
    
    const response = await axios.get('/customers', { params });
    customers.value = response.data.data;
    
    // Actualizar paginación
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to
    };
  } catch (err) {
    console.error('Error al cargar clientes:', err);
    showError('Error', 'No se pudieron cargar los clientes');
  }
};

const nuevoCliente = () => {
  router.push('/app/customers/create');
};

const editarCliente = (customer: any) => {
  router.push(`/app/customers/${customer.id}/edit`);
};

const verCliente = (customer: any) => {
  router.push(`/app/customers/${customer.id}`);
};

const eliminarCliente = async (customer: any) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar al cliente "${customer.name} ${customer.lastname}"?`)) {
    return;
  }
  
  try {
    await axios.delete(`/customers/${customer.id}`);
    success('Éxito', 'Cliente eliminado correctamente');
    cargarCustomers();
  } catch (err) {
    console.error('Error al eliminar cliente:', err);
    showError('Error', 'No se pudo eliminar el cliente');
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
  cargarCustomers();
};

const handlePerPageChange = () => {
  pagination.value.current_page = 1;
  cargarCustomers();
};

const handlePageChange = (page: number) => {
  pagination.value.current_page = page;
  cargarCustomers();
};

const handleSortChange = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key;
  sortOrder.value = order;
  cargarCustomers();
};

// Lifecycle
onMounted(() => {
  cargarCustomers();
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>