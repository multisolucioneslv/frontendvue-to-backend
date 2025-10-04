<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Categorías</h2>
      <Button @click="showModal = true">
        <Plus class="mr-2 h-4 w-4" /> Nueva Categoría
      </Button>
    </div>

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

      <template #cell-active="{ item }">
        <span :class="[
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]">
          {{ item.active ? 'Activa' : 'Inactiva' }}
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="editCategory(item)">
            <Pencil class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="deleteCategory(item.id)">
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

    <Dialog :open="showModal" @update:open="showModal = $event" title="Categoría">
      <form @submit.prevent="saveCategory" class="space-y-4">
        <div class="space-y-2">
          <Label>Nombre</Label>
          <Input v-model="form.name" required />
        </div>

        <div class="space-y-2">
          <Label>Descripción</Label>
          <textarea
            v-model="form.description"
            rows="4"
            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            v-model="form.active"
            id="active"
            class="h-4 w-4 rounded border-gray-300"
          />
          <Label for="active">Categoría Activa</Label>
        </div>

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="closeModal">
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api';
import DataTable from '@/components/ui/DataTable.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next';

interface Category {
  id?: number;
  name: string;
  description: string;
  active: boolean;
}

const categories = ref<Category[]>([]);
const showModal = ref(false);
const editingCategory = ref<Category | null>(null);
const searchQuery = ref('');

// Variables para ordenamiento y paginación
const sortBy = ref('name');
const sortOrder = ref('asc');
const perPage = ref('10');
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
  from: 0,
  to: 0
});

const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'description', label: 'Descripción', sortable: true },
  { key: 'active', label: 'Estado', sortable: true },
];

const form = ref<Category>({
  name: '',
  description: '',
  active: true
});

const loadCategories = async (page = 1) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      sort_by: sortBy.value,
      sort_order: sortOrder.value,
      per_page: perPage.value
    });
    
    const response = await axios.get(`${API_ENDPOINTS.CATEGORIES}?${params}`);

    if (response.data.pagination) {
      categories.value = response.data.data.data || response.data.data;
      pagination.value = {
        current_page: response.data.pagination.current_page,
        last_page: response.data.pagination.last_page,
        total: response.data.pagination.total,
        per_page: response.data.pagination.per_page,
        from: response.data.pagination.from || 0,
        to: response.data.pagination.to || 0
      };
    } else {
      categories.value = response.data.data || response.data;
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value;
  }

  const query = searchQuery.value.toLowerCase();
  return categories.value.filter(category => {
    const name = category.name.toLowerCase();
    const description = category.description?.toLowerCase() || '';

    return name.includes(query) || description.includes(query);
  });
});

const sortOrderComputed = computed(() => sortOrder.value as 'asc' | 'desc');

const handleSortChange = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key;
  sortOrder.value = order;
  loadCategories(1);
};

const handlePerPageChange = () => {
  loadCategories(1);
};

const handleSearch = () => {
  // La búsqueda se realiza automáticamente mediante el computed
};

const handlePageChange = (page: number) => {
  loadCategories(page);
};

const editCategory = (category: Category) => {
  editingCategory.value = category;
  form.value = { ...category };
  showModal.value = true;
};

const saveCategory = async () => {
  try {
    if (editingCategory.value?.id) {
      await axios.put(`${API_ENDPOINTS.CATEGORIES}/${editingCategory.value.id}`, form.value);
    } else {
      await axios.post(API_ENDPOINTS.CATEGORIES, form.value);
    }
    closeModal();
    loadCategories();
  } catch (error) {
    console.error('Error saving category:', error);
  }
};

const deleteCategory = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar esta categoría?')) {
    try {
      await axios.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  editingCategory.value = null;
  form.value = {
    name: '',
    description: '',
    active: true
  };
};

onMounted(() => {
  loadCategories();
});
</script>
