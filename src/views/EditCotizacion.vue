<template>
  <div class="space-y-6">
    <!-- Header -->
    <PageHeader :title="`Editar Cotización ${cotizacion?.numero_cotizacion || ''}`" subtitle="Modifica los datos de la cotización" :icon="FileText">
      <template #actions>
        <Button @click="volver" variant="secondary">
          <ArrowLeft class="h-4 w-4 mr-2" />
          Volver a Cotizaciones
        </Button>
        <Button @click="guardarCotizacion" :disabled="!formularioValido" variant="primary">
          <Save class="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </template>
    </PageHeader>

    <!-- Formulario -->
    <div v-if="cotizacion" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <!-- Información General -->
      <div class="form-section">
        <h3 class="section-title">Información General</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Número de Cotización</label>
            <input 
              :value="cotizacion.numero_cotizacion" 
              type="text" 
              class="form-input"
              readonly
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Cliente</label>
            <input 
              :value="`${cotizacion.customer?.name || ''} ${cotizacion.customer?.lastname || ''}`" 
              type="text" 
              class="form-input"
              readonly
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Estado</label>
            <select 
              v-model="formulario.estado"
              id="estado-select"
              class="form-select w-full"
            >
              <option 
                v-for="estado in estadosOptions" 
                :key="estado.value" 
                :value="estado.value"
              >
                {{ estado.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Fecha de Cotización</label>
            <input 
              v-model="formulario.fecha_cotizacion" 
              type="date" 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Fecha de Vencimiento</label>
            <input 
              v-model="formulario.fecha_vencimiento" 
              type="date" 
              class="form-input"
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
                  :id="`producto-select-${index}`"
                  class="form-select w-full"
                  @change="seleccionarProducto(index)"
                  required
                >
                  <option value="">Selecciona un producto</option>
                  <option 
                    v-for="producto in productos" 
                    :key="producto.id" 
                    :value="producto.id"
                  >
                    {{ producto.name }} - ${{ Number(producto.price).toFixed(2) }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Cantidad *</label>
                <InputMask 
                  v-model="item.cantidad" 
                  mask="999"
                  placeholder="1"
                  class="form-input"
                  :class="{ 'border-red-500': errores[`cantidad_${index}`] }"
                  @blur="errores[`cantidad_${index}`] = validarCampo('cantidad', item.cantidad)"
                />
                <InlineMessage v-if="errores[`cantidad_${index}`]" severity="error" :text="errores[`cantidad_${index}`]" />
              </div>

              <div class="form-group">
                <label class="form-label">Precio Unitario *</label>
                <InputMask 
                  v-model="item.precio_unitario" 
                  mask="999999.99"
                  placeholder="0.00"
                  class="form-input"
                  :class="{ 'border-red-500': errores[`precio_${index}`] }"
                  @blur="errores[`precio_${index}`] = validarCampo('precio', item.precio_unitario)"
                />
                <InlineMessage v-if="errores[`precio_${index}`]" severity="error" :text="errores[`precio_${index}`]" />
              </div>

              <div class="form-group">
                <label class="form-label">Descuento</label>
                <InputMask 
                  v-model="item.descuento" 
                  mask="999999.99"
                  placeholder="0.00"
                  class="form-input"
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
            </div>
          </div>
        </div>
      </div>

      <!-- Totales -->
      <div class="form-section">
        <h3 class="section-title">Totales</h3>
        <div class="totals-grid">
          <div class="total-item">
            <label class="total-label">Subtotal:</label>
            <span class="total-value">${{ totales.subtotal.toFixed(2) }}</span>
          </div>
          
          <div class="total-item">
            <label class="total-label">Descuento Global:</label>
            <div class="total-input">
              <InputMask 
                v-model="formulario.descuento" 
                mask="999999.99"
                placeholder="0.00"
                class="form-input"
              />
            </div>
          </div>
          
          <div class="total-item">
            <label class="total-label">Impuesto ({{ formulario.impuesto }}%):</label>
            <div class="total-input">
              <InputMask 
                v-model="formulario.impuesto" 
                mask="99.99"
                placeholder="0.00"
                class="form-input"
              />
            </div>
          </div>
          
          <div class="total-item total-final">
            <label class="total-label">Total:</label>
            <span class="total-value">${{ totales.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Notas y Términos -->
      <div class="form-section">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Notas</label>
            <textarea 
              v-model="formulario.notas" 
              class="form-textarea"
              placeholder="Notas adicionales para la cotización..."
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Términos y Condiciones</label>
            <textarea 
              v-model="formulario.terminos" 
              class="form-textarea"
              placeholder="Términos y condiciones..."
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="cargando" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Cargando cotización...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div class="flex items-center">
        <AlertCircle class="h-5 w-5 text-red-400 mr-3" />
        <div>
          <h3 class="text-red-800 dark:text-red-200 font-medium">Error</h3>
          <p class="text-red-600 dark:text-red-300">No se pudo cargar la cotización</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Declarar jQuery globalmente para ESLint
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}
const $ = window.$
import axios from '../config/axios'
import { useToast } from '../composables/useToast'
import PageHeader from '../components/ui/PageHeader.vue'
import Button from '../components/ui/Button.vue'
import InputMask from 'primevue/inputmask'
import InlineMessage from 'primevue/inlinemessage'
import { 
  FileText, 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle 
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { success, error } = useToast() // Fixed: corrected function names and null safety

// Datos
const cotizacion = ref(null)
const productos = ref([])
const cargando = ref(false)

// Formulario
const formulario = ref({
  estado: '',
  fecha_cotizacion: '',
  fecha_vencimiento: '',
  items: [],
  impuesto: '0.00',
  descuento: '0.00',
  notas: '',
  terminos: ''
})

// Validaciones
const errores = ref({})

// Opciones para selects
const estadosOptions = [
  { value: 'generada', label: 'Generada' },
  { value: 'entregada', label: 'Entregada' },
  { value: 'vendida', label: 'Vendida' },
  { value: 'rechazada', label: 'Rechazada' }
]

const productosOptions = computed(() => {
  return productos.value.map((producto: any) => ({
    value: producto.id,
    label: `${producto.name} - $${Number(producto.price).toFixed(2)}`,
    data: producto
  }))
})

// Validación del formulario
const formularioValido = computed(() => {
  if (formulario.value.items.length === 0) return false
  
  return formulario.value.items.every(item => 
    item.producto_id && parseFloat(item.cantidad) > 0 && parseFloat(item.precio_unitario) >= 0
  )
})

// Cálculos
const calcularSubtotal = (item: any) => {
  const cantidad = parseFloat(item.cantidad) || 0
  const precio = parseFloat(item.precio_unitario) || 0
  const descuento = parseFloat(item.descuento) || 0
  return (cantidad * precio) - descuento
}

const totales = computed(() => {
  const subtotal = formulario.value.items.reduce((sum, item) => sum + calcularSubtotal(item), 0)
  const descuentoGlobal = parseFloat(formulario.value.descuento) || 0
  const impuesto = parseFloat(formulario.value.impuesto) || 0
  
  const subtotalConDescuento = subtotal - descuentoGlobal
  const impuestoCalculado = (subtotalConDescuento * impuesto) / 100
  const total = subtotalConDescuento + impuestoCalculado
  
  return {
    subtotal,
    descuentoGlobal,
    impuesto: impuestoCalculado,
    total
  }
})

// Validación de campos
const validarCampo = (campo: string, valor: any) => {
  switch (campo) {
    case 'cantidad': {
      const cantidad = parseFloat(valor)
      if (!cantidad || cantidad <= 0) {
        return 'La cantidad debe ser mayor a 0'
      }
      return null
    }
    case 'precio': {
      const precio = parseFloat(valor)
      if (precio < 0) {
        return 'El precio no puede ser negativo'
      }
      return null
    }
    default:
      return null
  }
}

// Métodos
const limpiarErrores = () => {
  errores.value = {}
}

const agregarItem = () => {
  formulario.value.items.push({
    producto_id: null,
    cantidad: '1',
    precio_unitario: '0.00',
    descuento: '0.00',
    descripcion: ''
  })
  // Inicializar Select2 para el nuevo item
  observarItems()
}

const eliminarItem = (index: number) => {
  formulario.value.items.splice(index, 1)
  limpiarErrores()
}

const seleccionarProducto = (index: number) => {
  const item = formulario.value.items[index]
  const producto = productos.value.find((p: any) => p.id === item.producto_id)
  if (producto) {
    item.precio_unitario = Number(producto.price).toFixed(2)
  }
}

const volver = () => {
  router.push('/app/cotizaciones')
}

const cargarCotizacion = async () => {
  try {
    cargando.value = true
    const response = await axios.get(`/cotizaciones/${route.params.id}`)
    cotizacion.value = response.data.data
    
    // Validar que la cotización existe
    if (!cotizacion.value) {
      throw new Error('Cotización no encontrada')
    }
    
    // Cargar datos en el formulario
    formulario.value = {
      estado: cotizacion.value.estado || '',
      fecha_cotizacion: cotizacion.value.fecha_cotizacion ? new Date(cotizacion.value.fecha_cotizacion).toISOString().split('T')[0] : '',
      fecha_vencimiento: cotizacion.value.fecha_vencimiento ? new Date(cotizacion.value.fecha_vencimiento).toISOString().split('T')[0] : '',
      items: (cotizacion.value.items || []).map((item: any) => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: (item.cantidad || 0).toString(),
        precio_unitario: (item.precio_unitario || 0).toString(),
        descuento: (item.descuento || 0).toString(),
        descripcion: item.descripcion || ''
      })),
      impuesto: (cotizacion.value.impuesto || 0).toString(),
      descuento: (cotizacion.value.descuento || 0).toString(),
      notas: cotizacion.value.notas || '',
      terminos: cotizacion.value.terminos || ''
    }
  } catch (err: any) {
    console.error('Error al cargar cotización:', err)
    error('Error', 'No se pudo cargar la cotización')
  } finally {
    cargando.value = false
  }
}

const guardarCotizacion = async () => {
  if (!formularioValido.value) return
  
  try {
    cargando.value = true
    
    await axios.put(`/cotizaciones/${route.params.id}`, formulario.value)
    success('Éxito', 'Cotización actualizada correctamente')
    router.push('/app/cotizaciones')
  } catch (err: any) {
    console.error('Error al guardar cotización:', err)
    error('Error', 'No se pudo actualizar la cotización')
  } finally {
    cargando.value = false
  }
}

// Cargar datos
const cargarProductos = async () => {
  try {
    const response = await axios.get('/productos', { params: { per_page: 'all' } })
    productos.value = response.data.data
  } catch (err) {
    console.error('Error al cargar productos:', err)
  }
}

// Inicializar Select2
const inicializarSelect2 = async () => {
  await nextTick()
  
  // Inicializar Select2 para estado
  const estadoSelect = document.getElementById('estado-select')
  if (estadoSelect && !$(estadoSelect).hasClass('select2-hidden-accessible')) {
    $(estadoSelect).select2({
      placeholder: 'Selecciona un estado',
      allowClear: false,
      width: '100%'
    }).on('change', function() {
      formulario.value.estado = $(this).val()
    })
    
    // Establecer el valor después de inicializar Select2
    $(estadoSelect).val(formulario.value.estado).trigger('change')
  }
  
  // Inicializar Select2 para productos existentes
  formulario.value.items.forEach((item, index) => {
    const productoSelect = document.getElementById(`producto-select-${index}`)
    if (productoSelect && !$(productoSelect).hasClass('select2-hidden-accessible')) {
      $(productoSelect).select2({
        placeholder: 'Selecciona un producto',
        allowClear: true,
        width: '100%'
      }).on('change', function() {
        formulario.value.items[index].producto_id = $(this).val()
        seleccionarProducto(index)
      })
      
      // Establecer el valor después de inicializar Select2
      if (item.producto_id) {
        $(productoSelect).val(item.producto_id).trigger('change')
      }
    }
  })
}

// Observar cambios en items para inicializar nuevos selects
const observarItems = () => {
  nextTick(() => {
    inicializarSelect2()
  })
}

onMounted(async () => {
  await cargarCotizacion()
  await cargarProductos()
  await inicializarSelect2()
})
</script>

<style scoped>
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
.form-textarea,
.form-select {
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.dark .form-input,
.dark .form-textarea,
.dark .form-select {
  background: #475569;
  border-color: #64748b;
  color: #f8fafc;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
}

.dark .item-card {
  border-color: #475569;
  background: #374151;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-number {
  font-weight: 600;
  color: #1e293b;
}

.dark .item-number {
  color: #f8fafc;
}

.item-remove {
  padding: 0.5rem;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.item-remove:hover {
  background: #dc2626;
}

.item-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.totals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  max-width: 600px;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #f8fafc;
}

.dark .total-item {
  border-color: #475569;
  background: #374151;
}

.total-final {
  background: #3b82f6;
  color: white;
  font-weight: 600;
}

.total-label {
  font-weight: 500;
}

.total-value {
  font-weight: 600;
  font-size: 1.125rem;
}

.total-input {
  width: 120px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .item-form {
    grid-template-columns: 1fr;
  }
  
  .totals-grid {
    grid-template-columns: 1fr;
  }
}
</style>
