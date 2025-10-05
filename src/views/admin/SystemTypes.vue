<template>
  <div class="system-types-admin">
    <div class="admin-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">
            <Settings class="h-8 w-8" />
            Administración de Sistemas
          </h1>
          <p class="page-subtitle">
            Gestiona los tipos de sistema disponibles y sus configuraciones
          </p>
        </div>
        <div class="header-actions">
          <Button @click="showCreateModal = true" class="create-btn">
            <Plus class="h-4 w-4 mr-2" />
            Nuevo Sistema
          </Button>
        </div>
      </div>
    </div>

    <!-- Lista de sistemas -->
    <div class="systems-grid">
      <Card 
        v-for="system in systemTypes" 
        :key="system.id"
        class="system-card"
        :class="{ 'default-system': system.is_default }"
      >
        <div class="system-header">
          <div class="system-icon" :style="{ backgroundColor: system.color }">
            <component :is="getIcon(system.icon)" class="h-6 w-6 text-white" />
          </div>
          <div class="system-info">
            <h3 class="system-name">{{ system.name }}</h3>
            <p class="system-description">{{ system.description }}</p>
            <div class="system-badges">
              <span v-if="system.is_default" class="badge badge-default">Por Defecto</span>
              <span v-if="system.is_active" class="badge badge-active">Activo</span>
              <span v-else class="badge badge-inactive">Inactivo</span>
            </div>
          </div>
          <div class="system-actions">
            <Button 
              variant="outline" 
              size="sm" 
              @click="toggleSystem(system)"
              :class="{ 'text-green-600': system.is_active, 'text-red-600': !system.is_active }"
            >
              <Power v-if="system.is_active" class="h-4 w-4" />
              <PowerOff v-else class="h-4 w-4" />
            </Button>
            <Button 
              v-if="!system.is_default"
              variant="outline" 
              size="sm" 
              @click="setAsDefault(system)"
              class="text-blue-600"
            >
              <Star class="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              @click="editSystem(system)"
            >
              <Edit class="h-4 w-4" />
            </Button>
            <Button 
              v-if="!system.is_default"
              variant="outline" 
              size="sm" 
              @click="deleteSystem(system)"
              class="text-red-600"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="system-content">
          <div class="features-section">
            <h4 class="section-title">Características</h4>
            <div class="features-list">
              <span 
                v-for="feature in system.features" 
                :key="feature"
                class="feature-tag"
              >
                {{ feature }}
              </span>
            </div>
          </div>

          <div class="tables-section">
            <h4 class="section-title">Tablas Requeridas</h4>
            <div class="tables-list">
              <span 
                v-for="table in system.required_tables" 
                :key="table"
                class="table-tag"
              >
                {{ table }}
              </span>
            </div>
          </div>

          <div class="modules-section">
            <h4 class="section-title">Módulos ({{ system.modules?.length || 0 }})</h4>
            <div class="modules-preview">
              <span 
                v-for="module in system.modules?.slice(0, 3)" 
                :key="module.id"
                class="module-tag"
              >
                {{ module.name }}
              </span>
              <span v-if="system.modules?.length > 3" class="more-modules">
                +{{ system.modules.length - 3 }} más
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Modal para crear/editar sistema -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ showCreateModal ? 'Crear Nuevo Sistema' : 'Editar Sistema' }}
          </h3>
          <Button variant="outline" size="sm" @click="closeModal">
            <X class="h-4 w-4" />
          </Button>
        </div>

        <form @submit.prevent="saveSystem" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <Label for="name">Nombre del Sistema</Label>
              <Input 
                id="name"
                v-model="formData.name" 
                placeholder="Ej: Clínica Dental"
                required
              />
            </div>

            <div class="form-group">
              <Label for="slug">Slug (Identificador)</Label>
              <Input 
                id="slug"
                v-model="formData.slug" 
                placeholder="clinica-dental"
                required
              />
            </div>

            <div class="form-group full-width">
              <Label for="description">Descripción</Label>
              <textarea 
                id="description"
                v-model="formData.description" 
                placeholder="Descripción del sistema..."
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <Label for="icon">Icono</Label>
              <Input 
                id="icon"
                v-model="formData.icon" 
                placeholder="Stethoscope"
              />
            </div>

            <div class="form-group">
              <Label for="color">Color</Label>
              <Input 
                id="color"
                v-model="formData.color" 
                type="color"
                placeholder="#10B981"
              />
            </div>

            <div class="form-group">
              <Label for="sort_order">Orden</Label>
              <Input 
                id="sort_order"
                v-model.number="formData.sort_order" 
                type="number"
                min="0"
              />
            </div>

            <div class="form-group full-width">
              <Label>Características</Label>
              <div class="features-input">
                <Input 
                  v-model="newFeature" 
                  placeholder="Agregar característica..."
                  @keyup.enter="addFeature"
                />
                <Button type="button" @click="addFeature" size="sm">
                  <Plus class="h-4 w-4" />
                </Button>
              </div>
              <div class="features-list">
                <span 
                  v-for="(feature, index) in formData.features" 
                  :key="index"
                  class="feature-tag removable"
                  @click="removeFeature(index)"
                >
                  {{ feature }}
                  <X class="h-3 w-3 ml-1" />
                </span>
              </div>
            </div>

            <div class="form-group full-width">
              <Label>Tablas Requeridas</Label>
              <div class="tables-input">
                <Input 
                  v-model="newTable" 
                  placeholder="Agregar tabla..."
                  @keyup.enter="addTable"
                />
                <Button type="button" @click="addTable" size="sm">
                  <Plus class="h-4 w-4" />
                </Button>
              </div>
              <div class="tables-list">
                <span 
                  v-for="(table, index) in formData.required_tables" 
                  :key="index"
                  class="table-tag removable"
                  @click="removeTable(index)"
                >
                  {{ table }}
                  <X class="h-3 w-3 ml-1" />
                </span>
              </div>
            </div>

            <div class="form-group">
              <Label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="formData.is_active"
                  class="checkbox-input"
                />
                Sistema Activo
              </Label>
            </div>

            <div class="form-group">
              <Label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="formData.is_default"
                  class="checkbox-input"
                />
                Sistema por Defecto
              </Label>
            </div>
          </div>

          <div class="modal-actions">
            <Button variant="outline" @click="closeModal">
              Cancelar
            </Button>
            <Button type="submit" :disabled="loading">
              <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
              {{ showCreateModal ? 'Crear Sistema' : 'Actualizar Sistema' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { 
  Settings, 
  Plus, 
  Power, 
  PowerOff, 
  Star, 
  Edit, 
  Trash2, 
  X, 
  Loader2,
  LayoutDashboard,
  Stethoscope,
  Heart,
  Building2,
  FileText,
  ShoppingCart,
  Scale
} from 'lucide-vue-next'

const { success, error: showError } = useToast()

// Estado reactivo
const systemTypes = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingSystem = ref(null)

// Formulario
const formData = reactive({
  name: '',
  slug: '',
  description: '',
  features: [],
  required_tables: [],
  is_active: true,
  is_default: false,
  icon: '',
  color: '#3B82F6',
  sort_order: 0
})

const newFeature = ref('')
const newTable = ref('')

// Iconos disponibles
const iconMap = {
  LayoutDashboard,
  Stethoscope,
  Heart,
  Building2,
  FileText,
  ShoppingCart,
  Scale
}

// Métodos
const getIcon = (iconName: string) => {
  return iconMap[iconName] || LayoutDashboard
}

const loadSystemTypes = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/admin/system-types', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error('Error al cargar sistemas')
    
    const data = await response.json()
    systemTypes.value = data.data
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'No se pudieron cargar los sistemas')
  } finally {
    loading.value = false
  }
}

const toggleSystem = async (system: any) => {
  try {
    const response = await fetch(`/api/admin/system-types/${system.id}/toggle`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error('Error al cambiar estado')
    
    const data = await response.json()
    system.is_active = !system.is_active
    success('Estado cambiado', data.message)
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'No se pudo cambiar el estado del sistema')
  }
}

const setAsDefault = async (system: any) => {
  try {
    const response = await fetch(`/api/admin/system-types/${system.id}/set-default`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error('Error al establecer como defecto')
    
    const data = await response.json()
    
    // Actualizar todos los sistemas
    systemTypes.value.forEach(s => s.is_default = false)
    system.is_default = true
    system.is_active = true
    
    success('Sistema por defecto', data.message)
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'No se pudo establecer como sistema por defecto')
  }
}

const editSystem = (system: any) => {
  editingSystem.value = system
  Object.assign(formData, {
    name: system.name,
    slug: system.slug,
    description: system.description,
    features: [...(system.features || [])],
    required_tables: [...(system.required_tables || [])],
    is_active: system.is_active,
    is_default: system.is_default,
    icon: system.icon,
    color: system.color,
    sort_order: system.sort_order
  })
  showEditModal.value = true
}

const deleteSystem = async (system: any) => {
  if (!confirm(`¿Estás seguro de eliminar el sistema "${system.name}"?`)) return
  
  try {
    const response = await fetch(`/api/admin/system-types/${system.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error('Error al eliminar sistema')
    
    const data = await response.json()
    systemTypes.value = systemTypes.value.filter(s => s.id !== system.id)
    success('Sistema eliminado', data.message)
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'No se pudo eliminar el sistema')
  }
}

const addFeature = () => {
  if (newFeature.value.trim()) {
    formData.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}

const removeFeature = (index: number) => {
  formData.features.splice(index, 1)
}

const addTable = () => {
  if (newTable.value.trim()) {
    formData.required_tables.push(newTable.value.trim())
    newTable.value = ''
  }
}

const removeTable = (index: number) => {
  formData.required_tables.splice(index, 1)
}

const saveSystem = async () => {
  try {
    loading.value = true
    
    const url = showCreateModal.value 
      ? '/api/admin/system-types'
      : `/api/admin/system-types/${editingSystem.value.id}`
    
    const method = showCreateModal.value ? 'POST' : 'PUT'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) throw new Error('Error al guardar sistema')
    
    const data = await response.json()
    
    if (showCreateModal.value) {
      systemTypes.value.push(data.data)
      success('Sistema creado', data.message)
    } else {
      const index = systemTypes.value.findIndex(s => s.id === editingSystem.value.id)
      if (index !== -1) {
        systemTypes.value[index] = data.data
      }
      success('Sistema actualizado', data.message)
    }
    
    closeModal()
  } catch (error) {
    console.error('Error:', error)
    showError('Error', 'No se pudo guardar el sistema')
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingSystem.value = null
  
  // Resetear formulario
  Object.assign(formData, {
    name: '',
    slug: '',
    description: '',
    features: [],
    required_tables: [],
    is_active: true,
    is_default: false,
    icon: '',
    color: '#3B82F6',
    sort_order: 0
  })
  
  newFeature.value = ''
  newTable.value = ''
}

// Lifecycle
onMounted(() => {
  loadSystemTypes()
})
</script>

<style scoped>
.system-types-admin {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}

.create-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.create-btn:hover {
  background: #2563eb;
}

.systems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.system-card {
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.system-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.default-system {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.system-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.system-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.system-info {
  flex: 1;
  min-width: 0;
}

.system-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.system-description {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.system-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-default {
  background: #f59e0b;
  color: white;
}

.badge-active {
  background: #10b981;
  color: white;
}

.badge-inactive {
  background: #ef4444;
  color: white;
}

.system-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.system-content {
  space-y: 1rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.features-list,
.tables-list,
.modules-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag,
.table-tag,
.module-tag {
  padding: 0.25rem 0.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #475569;
}

.feature-tag.removable,
.table-tag.removable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.feature-tag.removable:hover,
.table-tag.removable:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.more-modules {
  padding: 0.25rem 0.5rem;
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #3730a3;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.modal-form {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
}

.features-input,
.tables-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Dark mode */
.dark .page-title {
  color: #f1f5f9;
}

.dark .page-subtitle {
  color: #94a3b8;
}

.dark .system-card {
  border-color: #334155;
  background: #1e293b;
}

.dark .system-card:hover {
  border-color: #3b82f6;
}

.dark .default-system {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
}

.dark .system-name {
  color: #f1f5f9;
}

.dark .system-description {
  color: #94a3b8;
}

.dark .section-title {
  color: #e2e8f0;
}

.dark .feature-tag,
.dark .table-tag,
.dark .module-tag {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

.dark .modal-content {
  background: #1e293b;
}

.dark .modal-header {
  border-bottom-color: #334155;
}

.dark .modal-title {
  color: #f1f5f9;
}

.dark .form-textarea {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

.dark .modal-actions {
  border-top-color: #334155;
}

/* Responsive */
@media (max-width: 768px) {
  .system-types-admin {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .systems-grid {
    grid-template-columns: 1fr;
  }
  
  .system-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .system-actions {
    justify-content: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style>
