<template>
  <div class="space-y-6">
    <PageHeader title="Categorías" subtitle="Gestiona las categorías de productos" :icon="Tag">
      <template #actions>
        <Button @click="nuevaCategoria">
          <Plus class="mr-2 h-4 w-4" /> Nueva Categoría
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

    <!-- Tabla de categorías -->
    <DataTable 
      :columns="columns" 
      :data="filteredCategories"
      :sort-by="sortBy"
      :sort-order="sortOrderComputed"
      @sort="handleSortChange"
    >
      <template #header>
        <div></div>
      </template>

      <template #cell-name="{ item }">
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 rounded" :style="{ backgroundColor: item.color || '#3b82f6' }"></div>
          <span class="font-medium">{{ item.name }}</span>
        </div>
      </template>

      <template #cell-description="{ item }">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ item.description || 'Sin descripción' }}
        </span>
      </template>

      <template #cell-products_count="{ item }">
        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {{ item.products_count || 0 }} productos
        </span>
      </template>

      <template #cell-status="{ item }">
        <span :class="item.status === 'active' ? 'text-green-600' : 'text-red-600'">
          {{ item.status === 'active' ? 'Activa' : 'Inactiva' }}
        </span>
      </template>

      <template #cell-created_at="{ item }">
        <span class="text-sm">{{ formatearFecha(item.created_at) }}</span>
      </template>

      <template #actions="{ item }">
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" @click="editarCategoria(item)" title="Editar">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" @click="verCategoria(item)" title="Ver">
            <Eye class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="eliminarCategoria(item)" title="Eliminar">
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
import { Plus, Search, Edit, Trash2, Eye, Tag } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const { success, error: showError } = useToast();
const router = useRouter();

// Estado
const categories = ref([]);
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
  { key: 'name', label: 'Categoría', sortable: true },
  { key: 'description', label: 'Descripción', sortable: true },
  { key: 'products_count', label: 'Productos', sortable: true },
  { key: 'status', label: 'Estado', sortable: true },
  { key: 'created_at', label: 'Fecha Creación', sortable: true }
]);

// Computed
const sortOrderComputed = computed(() => {
  return sortOrder.value as 'asc' | 'desc';
});

const filteredCategories = computed(() => {
  // Asegurar que siempre tenemos un array iterable
  const categoriesArray = Array.isArray(categories.value) ? categories.value : [];
  let filtered = [...categoriesArray];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(category => 
      category?.name?.toLowerCase().includes(query) ||
      category?.description?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Métodos
const cargarCategories = async () => {
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
    
    const response = await axios.get('/categories', { params });
    categories.value = response.data.data;
    
    // Actualizar paginación
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to
    };
  } catch (err) {
    console.error('Error al cargar categorías:', err);
    showError('Error', 'No se pudieron cargar las categorías');
  }
};

const nuevaCategoria = () => {
  router.push('/app/categories/create');
};

const editarCategoria = (category: any) => {
  router.push(`/app/categories/${category.id}/edit`);
};

const verCategoria = (category: any) => {
  router.push(`/app/categories/${category.id}`);
};

const eliminarCategoria = async (category: any) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
    return;
  }
  
  try {
    await axios.delete(`/categories/${category.id}`);
    success('Éxito', 'Categoría eliminada correctamente');
    cargarCategories();
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
    showError('Error', 'No se pudo eliminar la categoría');
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
  cargarCategories();
};

const handlePerPageChange = () => {
  pagination.value.current_page = 1;
  cargarCategories();
};

const handlePageChange = (page: number) => {
  pagination.value.current_page = page;
  cargarCategories();
};

const handleSortChange = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key;
  sortOrder.value = order;
  cargarCategories();
};

// Lifecycle
onMounted(() => {
  cargarCategories();
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>