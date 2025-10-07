<template>
  <div class="space-y-6">
    <PageHeader title="Productos" subtitle="Gestiona tu catálogo de productos" :icon="Package">
      <template #actions>
        <Button @click="nuevoProducto">
          <Plus class="mr-2 h-4 w-4" /> Nuevo Producto
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

    <!-- Tabla de productos -->
    <DataTable 
      :columns="columns" 
      :data="filteredProductos"
      :sort-by="sortBy"
      :sort-order="sortOrderComputed"
      @sort="handleSortChange"
    >
      <template #header>
        <div></div>
      </template>

      <template #cell-image="{ item }">
        <ProductImage 
          :src="item.image_url" 
          :alt="item.name"
          :product-id="item.id"
          class="w-12 h-12"
        />
      </template>

      <template #cell-name="{ item }">
        <div>
          <div class="font-medium">{{ item.name }}</div>
          <div class="text-sm text-muted-foreground">{{ item.code }}</div>
        </div>
      </template>

      <template #cell-price="{ item }">
        <span class="font-semibold text-green-600 dark:text-green-400">
          ${{ Number(item.price).toFixed(2) }}
        </span>
      </template>

      <template #cell-stock="{ item }">
        <span :class="item.stock <= 5 ? 'text-red-600 font-semibold' : 'text-gray-600'">
          {{ item.stock }}
        </span>
      </template>

      <template #cell-category="{ item }">
        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {{ item.category?.name || 'Sin categoría' }}
        </span>
      </template>

      <template #cell-status="{ item }">
        <span :class="item.status === 'active' ? 'text-green-600' : 'text-red-600'">
          {{ item.status === 'active' ? 'Activo' : 'Inactivo' }}
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" @click="editarProducto(item)" title="Editar">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" @click="verProducto(item)" title="Ver">
            <Eye class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="eliminarProducto(item)" title="Eliminar">
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
import ProductImage from '@/components/ui/ProductImage.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const { success, error: showError } = useToast();
const router = useRouter();

// Estado
const productos = ref([]);
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
  { key: 'image', label: 'Imagen', sortable: false },
  { key: 'name', label: 'Producto', sortable: true },
  { key: 'price', label: 'Precio', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  { key: 'status', label: 'Estado', sortable: true }
]);

// Computed
const sortOrderComputed = computed(() => {
  return sortOrder.value as 'asc' | 'desc';
});

const filteredProductos = computed(() => {
  // Asegurar que siempre tenemos un array iterable
  const productosArray = Array.isArray(productos.value) ? productos.value : [];
  let filtered = [...productosArray];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(producto => 
      producto?.name?.toLowerCase().includes(query) ||
      producto?.code?.toLowerCase().includes(query) ||
      producto?.description?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Métodos
const cargarProductos = async () => {
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
    
    const response = await axios.get('/productos', { params });
    productos.value = response.data.data;
    
    // Actualizar paginación
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to
    };
  } catch (err) {
    console.error('Error al cargar productos:', err);
    showError('Error', 'No se pudieron cargar los productos');
  }
};

const nuevoProducto = () => {
  router.push('/app/productos/create');
};

const editarProducto = (producto: any) => {
  router.push(`/app/productos/${producto.id}/edit`);
};

const verProducto = (producto: any) => {
  router.push(`/app/productos/${producto.id}`);
};

const eliminarProducto = async (producto: any) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.name}"?`)) {
    return;
  }
  
  try {
    await axios.delete(`/productos/${producto.id}`);
    success('Éxito', 'Producto eliminado correctamente');
    cargarProductos();
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    showError('Error', 'No se pudo eliminar el producto');
  }
};

const handleSearch = () => {
  pagination.value.current_page = 1;
  cargarProductos();
};

const handlePerPageChange = () => {
  pagination.value.current_page = 1;
  cargarProductos();
};

const handlePageChange = (page: number) => {
  pagination.value.current_page = page;
  cargarProductos();
};

const handleSortChange = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key;
  sortOrder.value = order;
  cargarProductos();
};

// Lifecycle
onMounted(() => {
  cargarProductos();
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>