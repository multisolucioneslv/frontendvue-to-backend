<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Sucursales</h2>
      <Button @click="showModal = true">
        <Plus class="mr-2 h-4 w-4" /> Nueva Sucursal
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
      :data="filteredSucursales"
      :sort-by="sortBy"
      :sort-order="sortOrderComputed"
      @sort="handleSortChange"
    >
      <template #header>
        <div></div>
      </template>

      <template #cell-activo="{ item }">
        <span :class="[
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          item.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]">
          {{ item.activo ? 'Activo' : 'Inactivo' }}
        </span>
      </template>

      <template #cell-principal="{ item }">
        <span v-if="item.principal" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800">
          Principal
        </span>
        <span v-else>-</span>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="editSucursal(item)">
            <Pencil class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="deleteSucursal(item.id)">
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

    <Dialog :open="showModal" @update:open="showModal = $event" title="Sucursal">
      <form @submit.prevent="saveSucursal" class="space-y-4">
        <div class="space-y-2">
          <Label>Nombre</Label>
          <Input v-model="form.nombre" required />
        </div>

        <div class="space-y-2">
          <Label>Dirección</Label>
          <Input v-model="form.direccion" required />
        </div>

        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            v-model="form.activo"
            id="activo"
            class="h-4 w-4 rounded border-gray-300"
          />
          <Label for="activo">Activo</Label>
        </div>

        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            v-model="form.principal"
            id="principal"
            class="h-4 w-4 rounded border-gray-300"
          />
          <Label for="principal">Sucursal Principal</Label>
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

interface Sucursal {
  id?: number;
  nombre: string;
  direccion: string;
  activo: boolean;
  principal: boolean;
  user_id?: number;
}

const sucursales = ref<Sucursal[]>([]);
const showModal = ref(false);
const editingSucursal = ref<Sucursal | null>(null);
const searchQuery = ref('');

// Variables para ordenamiento y paginación
const sortBy = ref('nombre');
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
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'direccion', label: 'Dirección', sortable: true },
  { key: 'activo', label: 'Estado', sortable: true },
  { key: 'principal', label: 'Principal', sortable: true },
];

const form = ref<Sucursal>({
  nombre: '',
  direccion: '',
  activo: true,
  principal: false
});

const loadSucursales = async (page = 1) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      sort_by: sortBy.value,
      sort_order: sortOrder.value,
      per_page: perPage.value
    });
    
    const response = await axios.get(`${API_ENDPOINTS.SUCURSALES}?${params}`);

    if (response.data.pagination) {
      sucursales.value = response.data.data.data || response.data.data;
      pagination.value = {
        current_page: response.data.pagination.current_page,
        last_page: response.data.pagination.last_page,
        total: response.data.pagination.total,
        per_page: response.data.pagination.per_page,
        from: response.data.pagination.from || 0,
        to: response.data.pagination.to || 0
      };
    } else {
      sucursales.value = response.data.data || response.data;
    }
  } catch (error) {
    console.error('Error loading sucursales:', error);
  }
};

const filteredSucursales = computed(() => {
  if (!searchQuery.value.trim()) {
    return sucursales.value;
  }

  const query = searchQuery.value.toLowerCase();
  return sucursales.value.filter(sucursal => {
    const nombre = sucursal.nombre.toLowerCase();
    const direccion = sucursal.direccion.toLowerCase();

    return nombre.includes(query) || direccion.includes(query);
  });
});

const sortOrderComputed = computed(() => sortOrder.value as 'asc' | 'desc');

const handleSortChange = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key;
  sortOrder.value = order;
  loadSucursales(1);
};

const handlePerPageChange = () => {
  loadSucursales(1);
};

const handleSearch = () => {
  // La búsqueda se realiza automáticamente mediante el computed
};

const handlePageChange = (page: number) => {
  loadSucursales(page);
};

const editSucursal = (sucursal: Sucursal) => {
  editingSucursal.value = sucursal;
  form.value = { ...sucursal };
  showModal.value = true;
};

const saveSucursal = async () => {
  try {
    if (editingSucursal.value?.id) {
      await axios.put(`${API_ENDPOINTS.SUCURSALES}/${editingSucursal.value.id}`, form.value);
    } else {
      await axios.post(API_ENDPOINTS.SUCURSALES, form.value);
    }
    closeModal();
    loadSucursales();
  } catch (error) {
    console.error('Error saving sucursal:', error);
  }
};

const deleteSucursal = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
    try {
      await axios.delete(`${API_ENDPOINTS.SUCURSALES}/${id}`);
      loadSucursales();
    } catch (error) {
      console.error('Error deleting sucursal:', error);
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  editingSucursal.value = null;
  form.value = {
    nombre: '',
    direccion: '',
    activo: true,
    principal: false
  };
};

onMounted(() => {
  loadSucursales();
});
</script>
