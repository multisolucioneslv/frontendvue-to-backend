<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Clientes</h2>
      <Button @click="showModal = true">
        <Plus class="mr-2 h-4 w-4" /> Nuevo Cliente
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
      :data="filteredCustomers"
      :sort-by="sortBy"
      :sort-order="sortOrderComputed"
      @sort="handleSortChange"
    >
      <template #header>
        <div></div>
      </template>

      <template #cell-name="{ item }">
        {{ item.name }} {{ item.lastname }}
      </template>

      <template #cell-phone="{ item }">
        {{ item.phone?.phone || '-' }}
      </template>

      <template #cell-telegram="{ item }">
        {{ item.telegram?.telegramID || '-' }}
      </template>

      <template #cell-sex="{ item }">
        {{ item.sex?.name || '-' }}
      </template>

      <template #actions="{ item }">
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="editCustomer(item)">
            <Pencil class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="deleteCustomer(item.id)">
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

    <Dialog :open="showModal" @update:open="showModal = $event" title="Cliente">
      <form @submit.prevent="saveCustomer" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Nombre</Label>
            <Input v-model="form.name" required />
          </div>
          <div class="space-y-2">
            <Label>Apellido</Label>
            <Input v-model="form.lastname" required />
          </div>
        </div>

        <div class="space-y-2">
          <Label>Email</Label>
          <Input v-model="form.email" type="email" required />
        </div>

        <div class="space-y-2">
          <Label>Dirección</Label>
          <Input v-model="form.address" />
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
            <Label>Teléfono ID</Label>
            <Input v-model="form.phone_id" type="number" />
          </div>
        </div>

        <div class="space-y-2">
          <Label>Telegram ID</Label>
          <Input v-model="form.telegram_id" type="number" />
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

interface Customer {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  phone_id?: number;
  telegram_id?: number;
  user_id?: number;
  sex_id?: number;
  address?: string;
  phone?: any;
  telegram?: any;
  sex?: any;
}

const customers = ref<Customer[]>([]);
const sexOptions = ref<any[]>([]);
const showModal = ref(false);
const editingCustomer = ref<Customer | null>(null);
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
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Teléfono', sortable: false },
  { key: 'telegram', label: 'Telegram', sortable: false },
  { key: 'sex', label: 'Sexo', sortable: false },
  { key: 'address', label: 'Dirección', sortable: true },
];

const form = ref<Customer>({
  name: '',
  lastname: '',
  email: '',
  address: '',
  phone_id: undefined,
  telegram_id: undefined,
  sex_id: undefined
});

const loadCustomers = async (page = 1) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      sort_by: sortBy.value,
      sort_order: sortOrder.value,
      per_page: perPage.value
    });
    
    const response = await axios.get(`${API_ENDPOINTS.CUSTOMERS}?${params}`);

    if (response.data.pagination) {
      customers.value = response.data.data.data || response.data.data;
      pagination.value = {
        current_page: response.data.pagination.current_page,
        last_page: response.data.pagination.last_page,
        total: response.data.pagination.total,
        per_page: response.data.pagination.per_page,
        from: response.data.pagination.from || 0,
        to: response.data.pagination.to || 0
      };
    } else {
      customers.value = response.data.data || response.data;
    }
  } catch (error) {
    console.error('Error loading customers:', error);
  }
};

const filteredCustomers = computed(() => {
  if (!searchQuery.value.trim()) {
    return customers.value;
  }

  const query = searchQuery.value.toLowerCase();
  return customers.value.filter(customer => {
    const fullName = `${customer.name} ${customer.lastname}`.toLowerCase();
    const email = customer.email.toLowerCase();
    const phone = customer.phone?.phone?.toString().toLowerCase() || '';

    return fullName.includes(query) ||
           email.includes(query) ||
           phone.includes(query);
  });
});

const sortOrderComputed = computed(() => sortOrder.value as 'asc' | 'desc');

const handleSortChange = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key;
  sortOrder.value = order;
  loadCustomers(1);
};

const handlePerPageChange = () => {
  loadCustomers(1);
};

const handleSearch = () => {
  // La búsqueda se realiza automáticamente mediante el computed
};

const handlePageChange = (page: number) => {
  loadCustomers(page);
};

const loadSexOptions = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.SEXS);
    sexOptions.value = response.data.data || response.data;
  } catch (error) {
    console.error('Error loading sex options:', error);
  }
};

const editCustomer = (customer: Customer) => {
  editingCustomer.value = customer;
  form.value = { ...customer };
  showModal.value = true;
};

const saveCustomer = async () => {
  try {
    if (editingCustomer.value?.id) {
      await axios.put(`${API_ENDPOINTS.CUSTOMERS}/${editingCustomer.value.id}`, form.value);
    } else {
      await axios.post(API_ENDPOINTS.CUSTOMERS, form.value);
    }
    closeModal();
    loadCustomers();
  } catch (error) {
    console.error('Error saving customer:', error);
  }
};

const deleteCustomer = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    try {
      await axios.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`);
      loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  editingCustomer.value = null;
  form.value = {
    name: '',
    lastname: '',
    email: '',
    address: '',
    phone_id: undefined,
    telegram_id: undefined,
    sex_id: undefined
  };
};

onMounted(() => {
  loadCustomers();
  loadSexOptions();
});
</script>
