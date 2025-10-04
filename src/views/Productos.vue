<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Productos</h2>
      <Button @click="showModal = true">
        <Plus class="mr-2 h-4 w-4" /> Nuevo Producto
      </Button>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Buscar por nombre o descripción..."
          class="pl-10"
          @input="handleSearch"
        />
      </div>
      
      <!-- Controles de tamaño de miniaturas -->
      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 thumbnail-controls">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Miniaturas:</span>
        <Button 
          @click="decreaseThumbnailSize" 
          variant="outline" 
          size="sm"
          :disabled="thumbnailSize <= 30"
          title="Reducir tamaño"
        >
          <Minus class="h-3 w-3" />
        </Button>
        <span class="text-sm font-mono min-w-[3rem] text-center">{{ thumbnailSize }}px</span>
        <Button 
          @click="increaseThumbnailSize" 
          variant="outline" 
          size="sm"
          :disabled="thumbnailSize >= 150"
          title="Aumentar tamaño"
        >
          <Plus class="h-3 w-3" />
        </Button>
        <Button 
          @click="resetThumbnailSize" 
          variant="outline" 
          size="sm"
          title="Tamaño por defecto"
        >
          <RotateCcw class="h-3 w-3" />
        </Button>
      </div>
    </div>

    <DataTable :columns="columns" :data="filteredProductos">
      <template #header>
        <div></div>
      </template>

      <template #cell-image="{ item }">
        <ProductImage 
          :product-id="item.id"
          :product-name="item.name"
          :image-url="item.images && item.images.length > 0 ? item.images[0] : ''"
          :width="thumbnailSize"
          :height="thumbnailSize"
          :show-gallery="true"
          :all-images="item.images || []"
          @click.stop
        />
      </template>

      <template #cell-price="{ item }">
        <span class="font-semibold text-green-600">${{ item.price }}</span>
      </template>

      <template #cell-stock="{ item }">
        <span :class="[
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          item.stock > 10 ? 'bg-green-100 text-green-800' :
          item.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        ]">
          {{ item.stock }} unidades
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="editProducto(item)">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="deleteProducto(item.id)">
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

    <Dialog :open="showModal" @update:open="showModal = $event" :title="editingProducto ? 'Editar Producto' : 'Nuevo Producto'" class="modal-producto">
      <div class="modal-content">
        <form @submit.prevent="saveProducto" class="product-form">
          <!-- Información Básica -->
          <div class="form-section">
            <h3 class="section-title">Información Básica</h3>
            <div class="form-grid">
              <div class="form-group">
                <Label for="name">Nombre del Producto</Label>
                <Input 
                  id="name"
                  v-model="form.name" 
                  placeholder="Ej: Laptop Gaming Pro"
                  required 
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <Label for="price">Precio</Label>
                <Input 
                  id="price"
                  v-model.number="form.price" 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  required 
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <Label for="stock">Stock</Label>
                <Input 
                  id="stock"
                  v-model.number="form.stock" 
                  type="number" 
                  placeholder="0"
                  required 
                  class="form-input"
                />
              </div>
            </div>
            
            <div class="form-group full-width">
              <Label for="description">Descripción</Label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                placeholder="Describe las características principales del producto..."
                class="form-textarea"
                required
              />
            </div>
          </div>

          <!-- Galería de Imágenes -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">Galería de Imágenes</h3>
              <div v-if="editingProducto && form.images.length > 0 && selectedFiles.length === 0" class="existing-images-info">
                <span class="text-sm text-blue-600">📷 Imágenes existentes: {{ form.images.length }}</span>
              </div>
            </div>
            
            <FileUpload 
              :max-files="10"
              :max-file-size="5"
              @files-change="handleFilesChange"
            />
            
            <div v-if="form.images.length === 0 && selectedFiles.length === 0" class="empty-gallery-message">
              <p class="text-sm text-muted-foreground">
                Selecciona imágenes desde tu computadora para crear la galería del producto
              </p>
            </div>
            
            <div v-else-if="editingProducto && form.images.length > 0 && selectedFiles.length === 0" class="existing-images-message">
              <p class="text-sm text-blue-600">
                💡 Selecciona nuevas imágenes para reemplazar las existentes, o mantén las actuales
              </p>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="form-actions">
            <Button type="button" variant="outline" @click="closeModal">
              Cancelar
            </Button>
            <Button type="submit" :disabled="selectedFiles.length === 0 && form.images.length === 0">
              {{ editingProducto ? 'Actualizar Producto' : 'Crear Producto' }}
            </Button>
          </div>
        </form>
      </div>
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
import ProductImage from '@/components/ui/ProductImage.vue';
import FileUpload from '@/components/ui/FileUpload.vue';
import { Plus, Search, Edit, Trash2, Minus, RotateCcw } from 'lucide-vue-next';
import { imageService } from '@/services/imageService';

interface Producto {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[]; // Cambiado de 'image' a 'images' array
}

const productos = ref<Producto[]>([]);
const showModal = ref(false);
const editingProducto = ref<Producto | null>(null);
const searchQuery = ref('');
const thumbnailSize = ref(50); // Tamaño dinámico de miniaturas
const selectedFiles = ref<File[]>([]);
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
  from: 0,
  to: 0
});

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'price', label: 'Precio' },
  { key: 'stock', label: 'Stock' },
  { key: 'image', label: 'Imagen' },
];

const form = ref<Producto>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  images: []
});

const loadProductos = async (page = 1) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.PRODUCTOS}?page=${page}`);

    if (response.data.pagination) {
      productos.value = response.data.data.data || response.data.data;
      pagination.value = {
        current_page: response.data.pagination.current_page,
        last_page: response.data.pagination.last_page,
        total: response.data.pagination.total,
        per_page: response.data.pagination.per_page,
        from: response.data.pagination.from || 0,
        to: response.data.pagination.to || 0
      };
    } else {
      productos.value = response.data.data || response.data;
    }
  } catch (error) {
    console.error('Error loading productos:', error);
  }
};

const filteredProductos = computed(() => {
  if (!searchQuery.value.trim()) {
    return productos.value;
  }

  const query = searchQuery.value.toLowerCase();
  return productos.value.filter(producto => {
    const name = producto.name.toLowerCase();
    const description = producto.description?.toLowerCase() || '';

    return name.includes(query) || description.includes(query);
  });
});

const handleSearch = () => {
  // La búsqueda se realiza automáticamente mediante el computed
};

const handlePageChange = (page: number) => {
  loadProductos(page);
};

const editProducto = (producto: Producto) => {
  editingProducto.value = producto;
  form.value = {
    id: producto.id,
    name: producto.name,
    description: producto.description,
    price: producto.price,
    stock: producto.stock,
    images: producto.images ? [...producto.images] : []
  };
  // Limpiar archivos seleccionados al editar
  selectedFiles.value = [];
  showModal.value = true;
};

const saveProducto = async () => {
  try {
    let imagesToSave = form.value.images;
    
    // Si hay archivos nuevos seleccionados, convertir a base64
    if (selectedFiles.value.length > 0) {
      imagesToSave = await convertFilesToBase64(selectedFiles.value);
    } else if (editingProducto.value?.id && form.value.images.length > 0) {
      // Si estamos editando y no hay archivos nuevos, mantener las imágenes existentes
      imagesToSave = form.value.images;
    }
    
    const productData = {
      ...form.value,
      images: imagesToSave
    };
    
    if (editingProducto.value?.id) {
      await axios.put(`${API_ENDPOINTS.PRODUCTOS}/${editingProducto.value.id}`, productData);
    } else {
      await axios.post(API_ENDPOINTS.PRODUCTOS, productData);
    }
    closeModal();
    loadProductos();
  } catch (error) {
    console.error('Error saving producto:', error);
  }
};

const deleteProducto = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    try {
      await axios.delete(`${API_ENDPOINTS.PRODUCTOS}/${id}`);
      loadProductos();
    } catch (error) {
      console.error('Error deleting producto:', error);
    }
  }
};

const generateRandomImages = () => {
  const numberOfImages = Math.floor(Math.random() * 4) + 2; // Entre 2 y 5 imágenes
  const newImages = [];
  
  for (let i = 0; i < numberOfImages; i++) {
    const randomImageUrl = imageService.getRandomProductImage({
      width: 400,
      height: 400,
      category: 'product'
    });
    newImages.push(randomImageUrl);
  }
  
  form.value.images = newImages;
};

const addImageUrl = () => {
  if (form.value.images.length < 10) { // Máximo 10 imágenes
    form.value.images.push('');
  }
};

const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
};

const updateImageUrl = (index: number, url: string) => {
  form.value.images[index] = url;
};

// Funciones para manejar archivos
const handleFilesChange = (files: File[]) => {
  selectedFiles.value = files;
  // Si hay archivos nuevos, reemplazar las imágenes existentes
  if (files.length > 0) {
    form.value.images = files.map(file => URL.createObjectURL(file));
  }
};

const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
  const base64Images: string[] = [];
  
  for (const file of files) {
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    base64Images.push(base64);
  }
  
  return base64Images;
};

// Funciones para cambiar el tamaño de miniaturas
const increaseThumbnailSize = () => {
  if (thumbnailSize.value < 150) {
    thumbnailSize.value += 10;
  }
};

const decreaseThumbnailSize = () => {
  if (thumbnailSize.value > 30) {
    thumbnailSize.value -= 10;
  }
};

const resetThumbnailSize = () => {
  thumbnailSize.value = 50;
};

const setThumbnailSize = (size: number) => {
  if (size >= 30 && size <= 150) {
    thumbnailSize.value = size;
  }
};

const closeModal = () => {
  showModal.value = false;
  editingProducto.value = null;
  selectedFiles.value = [];
  form.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    images: []
  };
};

onMounted(() => {
  loadProductos();
});
</script>

<style scoped>
/* Estilos para la tabla de productos */
:deep(.data-table) {
  width: 100%;
}

:deep(.data-table th:nth-child(5)),
:deep(.data-table td:nth-child(5)) {
  width: calc(v-bind(thumbnailSize) + 20px);
  min-width: calc(v-bind(thumbnailSize) + 20px);
  max-width: calc(v-bind(thumbnailSize) + 20px);
}

:deep(.product-image-container) {
  max-width: v-bind(thumbnailSize + 'px');
  max-height: v-bind(thumbnailSize + 'px');
}

:deep(.product-image) {
  max-width: v-bind(thumbnailSize + 'px');
  max-height: v-bind(thumbnailSize + 'px');
  width: v-bind(thumbnailSize + 'px');
  height: v-bind(thumbnailSize + 'px');
  object-fit: cover;
}

:deep(.image-wrapper) {
  max-width: v-bind(thumbnailSize + 'px');
  max-height: v-bind(thumbnailSize + 'px');
  width: v-bind(thumbnailSize + 'px');
  height: v-bind(thumbnailSize + 'px');
}

/* Estilos para los controles de tamaño */
.thumbnail-controls {
  transition: all 0.2s ease;
}

.thumbnail-controls:hover {
  background-color: var(--gray-200);
}

.dark .thumbnail-controls:hover {
  background-color: var(--gray-700);
}

/* Estilos para el modal de producto */
:deep(.modal-producto) {
  width: 60vw !important;
  max-width: 1200px !important;
  height: 40vh !important;
  max-height: 500px !important;
}

:deep(.modal-producto .dialog-content) {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.dark .modal-content {
  background: #1a1a1a;
}

.product-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.dark .section-title {
  color: #f9fafb;
  border-bottom-color: #374151;
}

.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-actions {
  display: flex;
  gap: 0.5rem;
}

.images-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.75rem;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.dark .images-gallery {
  border-color: #374151;
  background: #111827;
}

.image-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.dark .image-item {
  background: #1f2937;
  border-color: #374151;
}

.image-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .image-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.image-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.image-url-input {
  flex: 1;
}

.remove-btn {
  flex-shrink: 0;
}

.image-preview {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 150px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.empty-gallery-message {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-top: 1rem;
}

.dark .empty-gallery-message {
  background: #1f2937;
}

.existing-images-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.existing-images-message {
  text-align: center;
  padding: 1rem;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  margin-top: 1rem;
}

.dark .existing-images-message {
  background: #1e3a8a;
  border-color: #3b82f6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
}

.dark .form-actions {
  border-top-color: #374151;
}

/* Responsive */
@media (max-width: 1024px) {
  :deep(.modal-producto) {
    width: 80vw !important;
    height: 50vh !important;
  }
  
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  :deep(.modal-producto) {
    width: 95vw !important;
    height: 60vh !important;
  }
  
  .product-form {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
