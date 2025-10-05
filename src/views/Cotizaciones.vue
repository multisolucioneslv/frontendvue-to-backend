<template>
  <div class="space-y-4">
    <!-- Header -->
    <PageHeader title="Cotizaciones" subtitle="Gestiona las cotizaciones de tus clientes" :icon="FileText">
      <template #actions>
        <Button @click="mostrarModalNueva">
          <Plus class="mr-2 h-4 w-4" /> Nueva Cotización
        </Button>
      </template>
    </PageHeader>

    <!-- Estadísticas -->
    <StatsGrid>
      <StatsCard
        :icon="FileText"
        label="Total"
        :value="estadisticas.total || 0"
        gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
      />
      <StatsCard
        :icon="Edit"
        label="Borradores"
        :value="estadisticas.borrador || 0"
        gradient="linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
      />
      <StatsCard
        :icon="Send"
        label="Enviadas"
        :value="estadisticas.enviada || 0"
        gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      />
      <StatsCard
        :icon="CheckCircle"
        label="Aprobadas"
        :value="estadisticas.aprobada || 0"
        gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
      />
    </StatsGrid>

    <!-- Controles de tabla -->
    <TableControls
      v-model:per-page="perPage"
      v-model:search-query="searchQuery"
      @update:per-page="handlePerPageChange"
    >
      <template #filters>
        <select 
          v-model="filtros.estado" 
          @change="cargarCotizaciones" 
          class="px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700"
        >
          <option value="">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="enviada">Enviada</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
          <option value="vencida">Vencida</option>
        </select>
      </template>
    </TableControls>

    <!-- Tabla de Cotizaciones con DataTable -->
    <DataTable 
      :columns="columns" 
      :data="filteredCotizaciones"
      :loading="cargando"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @sort="handleSort"
    >
      <template #cell-numero_cotizacion="{ item }">
        <span class="font-mono font-semibold text-blue-600 dark:text-blue-400">
          {{ item.numero_cotizacion }}
        </span>
      </template>

      <template #cell-customer_name="{ item }">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {{ (item.customer?.name || 'N')[0].toUpperCase() }}
            </span>
          </div>
          <div>
            <div class="font-medium text-sm">
              {{ item.customer?.name }} {{ item.customer?.lastname }}
            </div>
          </div>
        </div>
      </template>

      <template #cell-fecha_cotizacion="{ item }">
        <span class="text-sm">{{ formatearFecha(item.fecha_cotizacion) }}</span>
      </template>

      <template #cell-fecha_vencimiento="{ item }">
        <span class="text-sm">{{ formatearFecha(item.fecha_vencimiento) }}</span>
      </template>

      <template #cell-estado="{ item }">
        <StatusBadge :status="item.estado" :label="capitalizar(item.estado)" />
      </template>

      <template #cell-total="{ item }">
        <span class="font-semibold text-green-600 dark:text-green-400">
          ${{ Number(item.total).toFixed(2) }}
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="verDetalle(item)" title="Ver detalles">
            <Eye class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" @click="editarCotizacion(item)" title="Editar">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="eliminarCotizacion(item)" title="Eliminar">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </template>
    </DataTable>

    <!-- Modal Nueva/Editar Cotización -->
    <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ modoEdicion ? 'Editar Cotización' : 'Nueva Cotización' }}</h2>
          <button @click="cerrarModal" class="modal-close">
            <X class="h-6 w-6" />
          </button>
        </div>

        <div class="modal-body">
          <!-- Información General -->
          <div class="form-section">
            <h3 class="section-title">Información General</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Cliente *</label>
                <select v-model="formulario.customer_id" class="form-select" required>
                  <option value="">Selecciona un cliente</option>
                  <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                    {{ cliente.name }} {{ cliente.lastname }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Estado</label>
                <select v-model="formulario.estado" class="form-select">
                  <option value="borrador">Borrador</option>
                  <option value="enviada">Enviada</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="rechazada">Rechazada</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Fecha de Cotización *</label>
                <input 
                  v-model="formulario.fecha_cotizacion" 
                  type="date" 
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Fecha de Vencimiento *</label>
                <input 
                  v-model="formulario.fecha_vencimiento" 
                  type="date" 
                  class="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Items de la Cotización -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">Items de la Cotización</h3>
              <Button @click="agregarItem" variant="secondary" size="sm">
                <Plus class="h-4 w-4 mr-2" />
                Agregar Item
              </Button>
            </div>

            <div class="items-list">
              <div v-for="(item, index) in formulario.items" :key="index" class="item-card">
                <div class="item-header">
                  <span class="item-number">Item {{ index + 1 }}</span>
                  <button 
                    v-if="formulario.items.length > 1"
                    @click="eliminarItem(index)" 
                    class="item-remove"
                    type="button"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>

                <div class="item-form">
                  <div class="form-group">
                    <label class="form-label">Producto *</label>
                    <select 
                      v-model="item.producto_id" 
                      @change="seleccionarProducto(index)"
                      class="form-select"
                      required
                    >
                      <option value="">Selecciona un producto</option>
                      <option v-for="producto in productos" :key="producto.id" :value="producto.id">
                        {{ producto.name }} - ${{ Number(producto.price).toFixed(2) }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Cantidad *</label>
                    <input 
                      v-model.number="item.cantidad" 
                      type="number" 
                      min="1"
                      class="form-input"
                      @input="calcularSubtotalItem(index)"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Precio Unitario *</label>
                    <input 
                      v-model.number="item.precio_unitario" 
                      type="number" 
                      step="0.01"
                      min="0"
                      class="form-input"
                      @input="calcularSubtotalItem(index)"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Descuento</label>
                    <input 
                      v-model.number="item.descuento" 
                      type="number" 
                      step="0.01"
                      min="0"
                      class="form-input"
                      @input="calcularSubtotalItem(index)"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <input 
                      v-model="item.descripcion" 
                      type="text" 
                      class="form-input"
                      placeholder="Descripción adicional (opcional)"
                    />
                  </div>

                  <div class="form-group subtotal-group">
                    <label class="form-label">Subtotal</label>
                    <div class="subtotal-display">
                      ${{ calcularSubtotal(item).toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Totales y Datos Adicionales -->
          <div class="form-section">
            <h3 class="section-title">Totales y Notas</h3>
            
            <div class="totales-section">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Impuesto (%)</label>
                  <input 
                    v-model.number="formulario.impuesto" 
                    type="number" 
                    step="0.01"
                    min="0"
                    class="form-input"
                    @input="calcularTotales"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Descuento Global</label>
                  <input 
                    v-model.number="formulario.descuento" 
                    type="number" 
                    step="0.01"
                    min="0"
                    class="form-input"
                    @input="calcularTotales"
                  />
                </div>
              </div>

              <div class="totales-display">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span class="total-value">${{ totales.subtotal.toFixed(2) }}</span>
                </div>
                <div class="total-row">
                  <span>Impuesto ({{ formulario.impuesto }}%):</span>
                  <span class="total-value">${{ totales.impuestoMonto.toFixed(2) }}</span>
                </div>
                <div class="total-row">
                  <span>Descuento:</span>
                  <span class="total-value text-red-600">-${{ formulario.descuento.toFixed(2) }}</span>
                </div>
                <div class="total-row total-final">
                  <span>Total:</span>
                  <span class="total-value">${{ totales.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Notas</label>
              <textarea 
                v-model="formulario.notas" 
                class="form-textarea"
                rows="3"
                placeholder="Notas adicionales para la cotización..."
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Términos y Condiciones</label>
              <textarea 
                v-model="formulario.terminos" 
                class="form-textarea"
                rows="3"
                placeholder="Términos y condiciones de la cotización..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <Button @click="cerrarModal" variant="secondary" :disabled="guardando">
            Cancelar
          </Button>
          <Button @click="guardarCotizacion" variant="primary" :disabled="guardando || !formularioValido">
            <Save class="h-4 w-4 mr-2" />
            {{ guardando ? 'Guardando...' : 'Guardar Cotización' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import axios from '@/config/axios'
import Button from '@/components/ui/Button.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Input from '@/components/ui/Input.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatsGrid from '@/components/ui/StatsGrid.vue'
import StatsCard from '@/components/ui/StatsCard.vue'
import TableControls from '@/components/ui/TableControls.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { 
  FileText, 
  Plus, 
  Edit, 
  Send, 
  CheckCircle, 
  Eye, 
  Trash2,
  X,
  Save
} from 'lucide-vue-next'

const { success, error: showError } = useToast()

// Estado
const cotizaciones = ref([])
const estadisticas = ref({})
const clientes = ref([])
const productos = ref([])
const cargando = ref(false)
const guardando = ref(false)
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const cotizacionActual = ref(null)

// Formulario
const formulario = ref({
  customer_id: '',
  fecha_cotizacion: new Date().toISOString().split('T')[0],
  fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  estado: 'borrador',
  impuesto: 0,
  descuento: 0,
  notas: '',
  terminos: 'Válido por 30 días. Precios sujetos a cambios sin previo aviso.',
  items: [{
    producto_id: '',
    cantidad: 1,
    precio_unitario: 0,
    descuento: 0,
    descripcion: ''
  }]
})

// Totales calculados
const totales = computed(() => {
  const subtotal = formulario.value.items.reduce((sum, item) => {
    return sum + calcularSubtotal(item)
  }, 0)
  
  const impuestoMonto = subtotal * (formulario.value.impuesto / 100)
  const total = subtotal + impuestoMonto - formulario.value.descuento
  
  return {
    subtotal,
    impuestoMonto,
    total: total > 0 ? total : 0
  }
})

// Validación del formulario
const formularioValido = computed(() => {
  if (!formulario.value.customer_id) return false
  if (!formulario.value.fecha_cotizacion) return false
  if (!formulario.value.fecha_vencimiento) return false
  if (formulario.value.items.length === 0) return false
  
  // Validar que todos los items tengan producto y cantidad
  return formulario.value.items.every(item => 
    item.producto_id && item.cantidad > 0 && item.precio_unitario >= 0
  )
})

// Filtros y Paginación
const filtros = ref({
  estado: '',
})

const paginacion = ref({
  pagina_actual: 1,
  ultima_pagina: 1,
  total: 0,
  por_pagina: 10
})

// Búsqueda y paginación local
const searchQuery = ref('')
const perPage = ref('10')

// Sorting
const sortBy = ref('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Definición de columnas para DataTable
const columns = [
  { key: 'numero_cotizacion', label: 'Número', sortable: true },
  { key: 'customer_name', label: 'Cliente', sortable: true },
  { key: 'fecha_cotizacion', label: 'Fecha', sortable: true },
  { key: 'fecha_vencimiento', label: 'Vencimiento', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'total', label: 'Total', sortable: true },
]

// Cotizaciones filtradas por búsqueda y ordenadas
const filteredCotizaciones = computed(() => {
  let filtered = cotizaciones.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((cot: any) => {
      const numero = cot.numero_cotizacion?.toLowerCase() || ''
      const cliente = `${cot.customer?.name || ''} ${cot.customer?.lastname || ''}`.toLowerCase()
      const estado = cot.estado?.toLowerCase() || ''
      
      return numero.includes(query) || cliente.includes(query) || estado.includes(query)
    })
  }

  // Aplicar sorting
  if (sortBy.value && sortOrder.value) {
    filtered = [...filtered].sort((a: any, b: any) => {
      let aValue = getNestedValue(a, sortBy.value)
      let bValue = getNestedValue(b, sortBy.value)
      
      // Manejar valores nulos/undefined
      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''
      
      // Convertir a string para comparación si no son números
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      // Comparación de strings
      aValue = String(aValue).toLowerCase()
      bValue = String(bValue).toLowerCase()
      
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

// Métodos del Formulario
const cargarClientes = async () => {
  try {
    const response = await axios.get('/customers')
    clientes.value = response.data.data.data || response.data.data
  } catch (err) {
    console.error('Error al cargar clientes:', err)
  }
}

const cargarProductos = async () => {
  try {
    const response = await axios.get('/productos', { params: { per_page: 'all' } })
    productos.value = response.data.data
  } catch (err) {
    console.error('Error al cargar productos:', err)
  }
}

const agregarItem = () => {
  formulario.value.items.push({
    producto_id: '',
    cantidad: 1,
    precio_unitario: 0,
    descuento: 0,
    descripcion: ''
  })
}

const eliminarItem = (index: number) => {
  if (formulario.value.items.length > 1) {
    formulario.value.items.splice(index, 1)
    calcularTotales()
  }
}

const seleccionarProducto = (index: number) => {
  const item = formulario.value.items[index]
  const producto = productos.value.find((p: any) => p.id === item.producto_id)
  
  if (producto) {
    item.precio_unitario = Number(producto.price)
    item.descripcion = producto.description || ''
    calcularSubtotalItem(index)
  }
}

const calcularSubtotal = (item: any) => {
  const cantidad = Number(item.cantidad) || 0
  const precioUnitario = Number(item.precio_unitario) || 0
  const descuento = Number(item.descuento) || 0
  
  return (cantidad * precioUnitario) - descuento
}

const calcularSubtotalItem = (index: number) => {
  // Recalcular totales
  calcularTotales()
}

const calcularTotales = () => {
  // Los totales se calculan automáticamente con el computed
}

const resetearFormulario = () => {
  formulario.value = {
    customer_id: '',
    fecha_cotizacion: new Date().toISOString().split('T')[0],
    fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estado: 'borrador',
    impuesto: 0,
    descuento: 0,
    notas: '',
    terminos: 'Válido por 30 días. Precios sujetos a cambios sin previo aviso.',
    items: [{
      producto_id: '',
      cantidad: 1,
      precio_unitario: 0,
      descuento: 0,
      descripcion: ''
    }]
  }
}

// Métodos
const cargarCotizaciones = async (pagina = 1) => {
  try {
    cargando.value = true
    const params: any = {
      page: pagina
    }

    if (filtros.value.estado) {
      params.estado = filtros.value.estado
    }

    const response = await axios.get('/cotizaciones', { params })
    
    cotizaciones.value = response.data.data.data
    paginacion.value = {
      pagina_actual: response.data.paginacion.pagina_actual,
      ultima_pagina: response.data.paginacion.ultima_pagina,
      total: response.data.paginacion.total,
      por_pagina: response.data.paginacion.por_pagina
    }
  } catch (err: any) {
    console.error('Error al cargar cotizaciones:', err)
    showError('Error', 'No se pudieron cargar las cotizaciones')
  } finally {
    cargando.value = false
  }
}

const cargarEstadisticas = async () => {
  try {
    const response = await axios.get('/cotizaciones-estadisticas')
    estadisticas.value = response.data.data
  } catch (err) {
    console.error('Error al cargar estadísticas:', err)
  }
}

const limpiarFiltros = () => {
  filtros.value.estado = ''
  cargarCotizaciones()
}

const cambiarPagina = (pagina: number) => {
  cargarCotizaciones(pagina)
}

const handlePerPageChange = () => {
  // Por ahora solo cambia el valor, la paginación la maneja el backend
  cargarCotizaciones(1)
}

const handleSort = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key
  sortOrder.value = order
}

// Función auxiliar para obtener valores anidados
const getNestedValue = (obj: any, path: string) => {
  // Mapear nombres especiales de columnas a rutas reales
  if (path === 'customer_name') {
    return obj.customer?.name || ''
  }
  
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

const mostrarModalNueva = () => {
  modoEdicion.value = false
  cotizacionActual.value = null
  resetearFormulario()
  mostrarModal.value = true
}

const verDetalle = (cotizacion: any) => {
  console.log('Ver detalle:', cotizacion)
  // TODO: Implementar modal de detalle
  success('Información', `Viendo detalles de ${cotizacion.numero_cotizacion}`)
}

const editarCotizacion = (cotizacion: any) => {
  modoEdicion.value = true
  cotizacionActual.value = { ...cotizacion }
  
  // Cargar datos en el formulario
  formulario.value = {
    customer_id: cotizacion.customer_id,
    fecha_cotizacion: cotizacion.fecha_cotizacion,
    fecha_vencimiento: cotizacion.fecha_vencimiento,
    estado: cotizacion.estado,
    impuesto: Number(cotizacion.impuesto) || 0,
    descuento: Number(cotizacion.descuento) || 0,
    notas: cotizacion.notas || '',
    terminos: cotizacion.terminos || '',
    items: cotizacion.items?.map((item: any) => ({
      id: item.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: Number(item.precio_unitario),
      descuento: Number(item.descuento) || 0,
      descripcion: item.descripcion || ''
    })) || [{
      producto_id: '',
      cantidad: 1,
      precio_unitario: 0,
      descuento: 0,
      descripcion: ''
    }]
  }
  
  mostrarModal.value = true
}

const eliminarCotizacion = async (cotizacion: any) => {
  if (!confirm(`¿Estás seguro de eliminar la cotización ${cotizacion.numero_cotizacion}?`)) {
    return
  }

  try {
    await axios.delete(`/cotizaciones/${cotizacion.id}`)
    success('Éxito', 'Cotización eliminada correctamente')
    cargarCotizaciones()
    cargarEstadisticas()
  } catch (err) {
    showError('Error', 'No se pudo eliminar la cotización')
  }
}

const guardarCotizacion = async () => {
  if (!formularioValido.value) {
    showError('Error', 'Por favor completa todos los campos requeridos')
    return
  }

  try {
    guardando.value = true
    
    const datos = {
      customer_id: formulario.value.customer_id,
      fecha_cotizacion: formulario.value.fecha_cotizacion,
      fecha_vencimiento: formulario.value.fecha_vencimiento,
      estado: formulario.value.estado,
      impuesto: formulario.value.impuesto,
      descuento: formulario.value.descuento,
      notas: formulario.value.notas,
      terminos: formulario.value.terminos,
      items: formulario.value.items.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        descuento: item.descuento || 0,
        descripcion: item.descripcion || ''
      }))
    }

    if (modoEdicion.value && cotizacionActual.value) {
      // Actualizar cotización existente
      await axios.put(`/cotizaciones/${cotizacionActual.value.id}`, datos)
      success('Éxito', 'Cotización actualizada correctamente')
    } else {
      // Crear nueva cotización
      await axios.post('/cotizaciones', datos)
      success('Éxito', 'Cotización creada correctamente')
    }
    
    cerrarModal()
    cargarCotizaciones()
    cargarEstadisticas()
  } catch (err: any) {
    console.error('Error al guardar:', err)
    const mensaje = err.response?.data?.error || err.response?.data?.mensaje || 'No se pudo guardar la cotización'
    showError('Error', mensaje)
  } finally {
    guardando.value = false
  }
}

const cerrarModal = () => {
  mostrarModal.value = false
  modoEdicion.value = false
  cotizacionActual.value = null
  resetearFormulario()
}

const formatearFecha = (fecha: string) => {
  if (!fecha) return '-'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const capitalizar = (texto: string) => {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Lifecycle
onMounted(() => {
  cargarCotizaciones()
  cargarEstadisticas()
  cargarClientes()
  cargarProductos()
})
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dark .modal-content {
  background: #334155;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dark .modal-header {
  border-color: #475569;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.dark .modal-header h2 {
  color: #f8fafc;
}

.modal-close {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.dark .modal-close:hover {
  background: #475569;
  color: #f8fafc;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.dark .modal-footer {
  border-color: #475569;
}

/* Estilos del Formulario */
.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.dark .section-title {
  color: #f8fafc;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.dark .form-label {
  color: #cbd5e1;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1e293b;
  background: white;
  transition: all 0.2s;
}

.dark .form-input,
.dark .form-select,
.dark .form-textarea {
  background: #475569;
  border-color: #64748b;
  color: #f8fafc;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Items de Cotización */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card {
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #f8fafc;
}

.dark .item-card {
  background: #475569;
  border-color: #64748b;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.dark .item-header {
  border-color: #64748b;
}

.item-number {
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.875rem;
}

.item-remove {
  padding: 0.5rem;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-remove:hover {
  background: #fecaca;
}

.item-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.subtotal-group {
  grid-column: span 2;
}

.subtotal-display {
  padding: 0.625rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 0.5rem;
  font-weight: 600;
  text-align: right;
  font-size: 1.125rem;
}

.dark .subtotal-display {
  background: #1e3a8a;
  color: #93c5fd;
}

/* Totales */
.totales-section {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.dark .totales-section {
  background: #475569;
}

.totales-display {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.dark .totales-display {
  background: #334155;
  border-color: #64748b;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
}

.dark .total-row {
  border-color: #475569;
}

.total-row:last-child {
  border-bottom: none;
}

.total-row.total-final {
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 2px solid #3b82f6;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e40af;
}

.dark .total-row.total-final {
  color: #60a5fa;
}

.total-value {
  font-weight: 600;
  color: #059669;
}

.dark .total-value {
  color: #10b981;
}

.total-row.total-final .total-value {
  color: #1e40af;
}

.dark .total-row.total-final .total-value {
  color: #60a5fa;
}

/* Responsive */
@media (max-width: 768px) {
  .cotizaciones-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-container {
    overflow-x: scroll;
  }

  .cotizaciones-table {
    min-width: 800px;
  }
}
</style>

