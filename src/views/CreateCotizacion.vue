<template>
  <div class="space-y-6">
    <!-- Header -->
    <PageHeader title="Nueva Cotización" subtitle="Crea una nueva cotización para tu cliente" :icon="FileText">
      <template #actions>
        <Button @click="volver" variant="secondary">
          <ArrowLeft class="h-4 w-4 mr-2" />
          Volver a Cotizaciones
        </Button>
        <Button @click="limpiarFormulario" variant="outline" size="sm">
          <Trash2 class="h-4 w-4 mr-2" />
          Limpiar Formulario
        </Button>
      </template>
    </PageHeader>

    <!-- Indicador de Pasos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="steps-container">
        <div 
          v-for="(paso, index) in [
            { numero: 1, titulo: 'Selección de Cliente', descripcion: 'Elige cliente existente o nuevo' },
            { numero: 2, titulo: 'Productos', descripcion: 'Agrega productos a la cotización' },
            { numero: 3, titulo: 'Finalizar', descripcion: 'Revisa y guarda la cotización' }
          ]" 
          :key="index"
          class="step-item"
          :class="{ 
            'active': paso.numero === pasoActual,
            'completed': paso.numero < pasoActual,
            'disabled': paso.numero > pasoActual
          }"
          @click="irAPaso(paso.numero)"
        >
          <div class="step-number">
            <Check v-if="paso.numero < pasoActual" class="h-4 w-4" />
            <span v-else>{{ paso.numero }}</span>
          </div>
          <div class="step-content">
            <h4 class="step-title">{{ paso.titulo }}</h4>
            <p class="step-description">{{ paso.descripcion }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <!-- PASO 1: Selección de Cliente -->
      <div v-if="pasoActual === 1" class="form-section">
        <div class="step-header">
          <h3 class="section-title">Paso 1: Selección de Cliente</h3>
          <p class="step-subtitle">Elige si vas a usar un cliente existente o crear uno nuevo</p>
        </div>
        <div class="client-type-selection">
          <div class="radio-group">
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="tipoCliente" 
                value="existente"
                class="radio-input"
              />
              <span class="radio-label">
                <Users class="h-5 w-5 mr-2" />
                Cliente Existente
              </span>
            </label>
            
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="tipoCliente" 
                value="nuevo"
                class="radio-input"
              />
              <span class="radio-label">
                <UserPlus class="h-5 w-5 mr-2" />
                Nuevo Cliente
              </span>
            </label>
          </div>
        </div>

        <!-- Formulario de Nuevo Cliente (solo si se selecciona "nuevo") -->
        <div v-if="tipoCliente === 'nuevo'" class="form-section mt-6">
          <h4 class="subsection-title">Datos del Nuevo Cliente</h4>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nombre *</label>
              <input 
                v-model="formularioNuevoCliente.name" 
                type="text" 
                class="form-input"
                placeholder="Nombre del cliente"
                :class="{ 'border-red-500': errores.nombre }"
                @blur="errores.nombre = validarCampo('nombre', formularioNuevoCliente.name)"
              />
              <InlineMessage v-if="errores.nombre" severity="error" :text="errores.nombre" />
            </div>
            
            <div class="form-group">
              <label class="form-label">Apellido *</label>
              <input 
                v-model="formularioNuevoCliente.lastname" 
                type="text" 
                class="form-input"
                placeholder="Apellido del cliente"
                :class="{ 'border-red-500': errores.apellido }"
                @blur="errores.apellido = validarCampo('apellido', formularioNuevoCliente.lastname)"
              />
              <InlineMessage v-if="errores.apellido" severity="error" :text="errores.apellido" />
            </div>
            
            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                v-model="formularioNuevoCliente.email" 
                type="email"
                placeholder="correo@ejemplo.com"
                class="form-input"
                :class="{ 'border-red-500': errores.email }"
                @blur="errores.email = validarCampo('email', formularioNuevoCliente.email)"
              />
              <InlineMessage v-if="errores.email" severity="error" :text="errores.email" />
            </div>
            
            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input 
                v-model="formularioNuevoCliente.phone" 
                type="tel"
                placeholder="(999) 999-9999"
                class="form-input"
                :class="{ 'border-red-500': errores.telefono }"
                @blur="errores.telefono = validarCampo('telefono', formularioNuevoCliente.phone)"
              />
              <InlineMessage v-if="errores.telefono" severity="error" :text="errores.telefono" />
            </div>
            
            <div class="form-group">
              <label class="form-label">Empresa</label>
              <input 
                v-model="formularioNuevoCliente.company" 
                type="text" 
                class="form-input"
                placeholder="Nombre de la empresa"
              />
            </div>
          </div>
        </div>

        <!-- Información General (solo si es cliente existente) -->
        <div v-if="tipoCliente === 'existente'" class="form-section mt-6">
          <h4 class="subsection-title">Seleccionar Cliente Existente</h4>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Cliente *</label>
              <select 
                v-model="formulario.customer_id" 
                id="cliente-select"
                class="form-select w-full"
                required
              >
                <option value=""></option>
                <option 
                  v-for="cliente in clientes" 
                  :key="cliente.id" 
                  :value="cliente.id"
                >
                  {{ cliente.name }} {{ cliente.lastname }}{{ cliente.email ? ` - ${cliente.email}` : '' }}{{ cliente.company ? ` (${cliente.company})` : '' }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Botón para continuar (opcional, ya que avanza automáticamente) -->
        <div v-if="validarPaso1()" class="step-actions mt-6">
          <Button @click="avanzarPaso" variant="default" class="w-full">
            Continuar al Paso 2
            <ChevronRight class="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <!-- PASO 2: Productos de la Cotización -->
      <div v-if="pasoActual === 2" class="form-section">
        <div class="step-header">
          <h3 class="section-title">Paso 2: Productos de la Cotización</h3>
          <p class="step-subtitle">Agrega los productos que incluirás en esta cotización</p>
        </div>

        <!-- Botones de navegación -->
        <div class="step-actions mb-4 flex gap-3">
          <Button @click="retrocederPaso" variant="outline" size="sm">
            <ChevronLeft class="h-4 w-4 mr-2" />
            Volver al Paso 1
          </Button>

          <Button v-if="validarPaso2()" @click="avanzarPaso" variant="default" size="sm">
            Continuar al Paso 3
            <ChevronRight class="h-4 w-4 ml-2" />
          </Button>
        </div>

      <!-- Items de la Cotización -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">Productos de la Cotización</h3>
          <Button @click="agregarItem" variant="secondary" size="sm">
            <Plus class="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </div>

        <div class="items-list">
          <div v-for="(item, index) in formulario.items" :key="item.id" class="item-card">
            <div class="item-header">
              <span class="item-number">Producto {{ index + 1 }}</span>
              <button 
                v-if="formulario.items.length > 1"
                @click="eliminarItem(item.id)" 
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
                  @change="seleccionarProducto(item.id)"
                  required
                >
                  <option value=""></option>
                  <option
                    v-for="producto in getProductosDisponibles(index)"
                    :key="producto.id"
                    :value="producto.id"
                  >
                    {{ producto.name }} - ${{ Number(producto.price).toFixed(2) }}
                  </option>
                </select>
              </div>

              <div class="form-group form-group-small">
                <label class="form-label">Cantidad *</label>
                <input
                  v-model.number="item.cantidad"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  class="form-input"
                  :class="{ 'border-red-500': errores[`cantidad_${index}`] }"
                  @blur="errores[`cantidad_${index}`] = validarCampo('cantidad', item.cantidad)"
                />
                <InlineMessage v-if="errores[`cantidad_${index}`]" severity="error" :text="errores[`cantidad_${index}`]" />
              </div>

              <div class="form-group form-group-wide">
                <label class="form-label">Precio Unitario *</label>
                <input
                  v-model="item.precio_unitario"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="form-input"
                  :class="{ 'border-red-500': errores[`precio_${index}`], 'price-auto-loaded': item.producto_id && item.precio_unitario !== '0.00' }"
                  @blur="errores[`precio_${index}`] = validarCampo('precio', item.precio_unitario)"
                />
                <span v-if="item.producto_id && item.precio_unitario !== '0.00'" class="price-indicator-below">
                  ✓ Auto-cargado
                </span>
                <InlineMessage v-if="errores[`precio_${index}`]" severity="error" :text="errores[`precio_${index}`]" />
              </div>

              <div class="form-group form-group-compact">
                <label class="form-label">Descuento</label>
                <input
                  v-model="item.descuento"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="form-input"
                />
              </div>

              <div class="form-group form-group-wide">
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
      </div>

      <!-- PASO 3: Finalizar Cotización -->
      <div v-if="pasoActual === 3" class="form-section">
        <div class="step-header">
          <h3 class="section-title">Paso 3: Finalizar Cotización</h3>
          <p class="step-subtitle">Revisa los detalles y guarda la cotización</p>
        </div>
        
        <!-- Botón para volver al paso anterior -->
        <div class="step-actions mb-4">
          <Button @click="retrocederPaso" variant="outline" size="sm">
            <ChevronLeft class="h-4 w-4 mr-2" />
            Volver al Paso 2
          </Button>
        </div>

        <!-- Resumen del Cliente -->
        <div class="summary-section mb-6">
          <h4 class="subsection-title">Información del Cliente</h4>
          <div v-if="getClienteInfo" class="client-info-card">
            <div class="client-info-row">
              <span class="client-info-label">Nombre Completo:</span>
              <span class="client-info-value">{{ getClienteInfo.name }} {{ getClienteInfo.lastname }}</span>
            </div>
            <div v-if="getClienteInfo.email" class="client-info-row">
              <span class="client-info-label">Email:</span>
              <span class="client-info-value">{{ getClienteInfo.email }}</span>
            </div>
            <div v-if="getClienteInfo.phone" class="client-info-row">
              <span class="client-info-label">Teléfono:</span>
              <span class="client-info-value">{{ getClienteInfo.phone.phone }}</span>
            </div>
            <div v-if="getClienteInfo.company" class="client-info-row">
              <span class="client-info-label">Empresa:</span>
              <span class="client-info-value">{{ getClienteInfo.company }}</span>
            </div>
          </div>
          <div v-else class="no-client-message">
            <p>No se ha seleccionado un cliente.</p>
          </div>
        </div>

        <!-- Tabla de Productos -->
        <div class="summary-section mb-6">
          <h4 class="subsection-title">Productos Seleccionados</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Para modificar o agregar productos, regrese al Paso 2
          </p>
          <div class="products-table-container">
            <table class="products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Descuento</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in formulario.items" :key="item.id" class="product-row">
                  <td class="product-name">{{ getNombreProducto(item.producto_id) }}</td>
                  <td class="text-center">{{ item.cantidad }}</td>
                  <td class="text-right">${{ parseFloat(item.precio_unitario).toFixed(2) }}</td>
                  <td class="text-right">${{ parseFloat(item.descuento).toFixed(2) }}</td>
                  <td class="text-right font-semibold">${{ calcularSubtotal(item).toFixed(2) }}</td>
                  <td class="text-center">
                    <button
                      @click="eliminarItem(item.id)"
                      class="btn-delete-product"
                      type="button"
                      title="Eliminar producto"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="4" class="text-right font-semibold">Total Productos:</td>
                  <td class="text-right font-bold">${{ totales.subtotal.toFixed(2) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Totales -->
        <div class="form-section">
        <h3 class="section-title">Totales</h3>

        <!-- Checkbox para aplicar impuesto -->
        <div class="mb-4" v-if="impuestoSistema">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="aplicarImpuesto"
              type="checkbox"
              class="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Aplicar impuesto del sistema ({{ impuestoSistema.name }}: {{ impuestoSistema.rate }}%)
            </span>
          </label>
          <p class="text-xs text-gray-500 dark:text-gray-400 ml-7 mt-1" v-if="aplicarImpuesto">
            Se aplicará el impuesto configurado en el sistema
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 ml-7 mt-1" v-else>
            Puedes especificar un impuesto personalizado manualmente
          </p>
        </div>

        <div class="totals-grid-improved">
          <div class="total-item">
            <label class="total-label">Subtotal:</label>
            <span class="total-value">${{ totales.subtotal.toFixed(2) }}</span>
          </div>

          <div class="total-item">
            <label class="total-label">Descuento Global:</label>
            <div class="total-input-wide">
              <input
                v-model="formulario.descuento"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="form-input"
              />
            </div>
          </div>

          <div class="total-item">
            <label class="total-label">Impuesto ({{ totales.tasaImpuesto.toFixed(2) }}%):</label>
            <div class="total-input-wide" v-if="!aplicarImpuesto">
              <input
                v-model="formulario.impuesto"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0.00"
                class="form-input"
              />
            </div>
            <span v-else class="total-value">${{ totales.impuesto.toFixed(2) }}</span>
          </div>

          <div class="total-item total-final">
            <label class="total-label">Total:</label>
            <span class="total-value">${{ totales.total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Notas y Términos -->
        <div class="form-section">
          <h4 class="subsection-title">Información Adicional</h4>
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
        
        <!-- Botón de Guardar Cotización al final del Paso 3 -->
        <div class="step-actions mt-8">
          <Button @click="guardarCotizacion" :disabled="!formularioValido" variant="default" size="lg" class="w-full">
            <Save class="h-5 w-5 mr-2" />
            Guardar Cotización
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

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
  Users, 
  UserPlus,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const { success, error } = useToast()

// Control del tipo de cliente y pasos
const tipoCliente = ref<'existente' | 'nuevo' | null>('existente') // Por defecto cliente existente
const pasoActual = ref(1)
const pasosCompletados = ref<number[]>([])
const formularioNuevoCliente = ref({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  company: ''
})

// Formulario principal
const formulario = ref({
  customer_id: null,
  items: [
    {
      id: Date.now(), // ID único para el primer item
      producto_id: null,
      cantidad: 1,
      precio_unitario: '0.00',
      descuento: '0.00',
      descripcion: ''
    }
  ],
  impuesto: '0.00',
  descuento: '0.00',
  notas: '',
  terminos: 'Válido por 30 días. Precios sujetos a cambios sin previo aviso.'
})

// Datos
const clientes = ref<any[]>([])
const productos = ref<any[]>([])
const cargando = ref(false)
const impuestoSistema = ref<any>(null)
const aplicarImpuesto = ref(true)

// Validaciones
const errores = ref<any>({})

// Clave para localStorage
const STORAGE_KEY = 'cotizacion-temp-data'

// Funciones para persistencia
const guardarDatosTemporales = () => {
  const datosParaGuardar = {
    tipoCliente: tipoCliente.value,
    formularioNuevoCliente: formularioNuevoCliente.value,
    formulario: formulario.value,
    timestamp: Date.now()
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datosParaGuardar))
    console.log('Datos guardados temporalmente')
  } catch (error) {
    console.error('Error al guardar datos temporales:', error)
  }
}

const cargarDatosTemporales = () => {
  try {
    const datosGuardados = localStorage.getItem(STORAGE_KEY)
    if (datosGuardados) {
      const datos = JSON.parse(datosGuardados)
      
      // Verificar que los datos no sean muy antiguos (máximo 24 horas)
      const maxAge = 24 * 60 * 60 * 1000 // 24 horas en milisegundos
      if (Date.now() - datos.timestamp < maxAge) {
        tipoCliente.value = datos.tipoCliente
        formularioNuevoCliente.value = datos.formularioNuevoCliente || formularioNuevoCliente.value
        formulario.value = datos.formulario || formulario.value
        
        console.log('Datos temporales cargados')
        return true
      } else {
        // Limpiar datos antiguos
        localStorage.removeItem(STORAGE_KEY)
        console.log('Datos temporales expirados, limpiados')
      }
    }
  } catch (error) {
    console.error('Error al cargar datos temporales:', error)
    localStorage.removeItem(STORAGE_KEY)
  }
  return false
}

const limpiarDatosTemporales = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log('Datos temporales limpiados')
}

// Funciones para control de pasos
const validarPaso1 = () => {
  if (tipoCliente.value === 'existente') {
    return !!formulario.value.customer_id
  } else if (tipoCliente.value === 'nuevo') {
    return !!(formularioNuevoCliente.value.name && formularioNuevoCliente.value.lastname)
  }
  return false
}

const validarPaso2 = () => {
  return formulario.value.items.length > 0 && 
         formulario.value.items.every(item => 
           item.producto_id && 
           parseFloat(String(item.cantidad)) > 0 && 
           parseFloat(String(item.precio_unitario)) >= 0
         )
}

const avanzarPaso = () => {
  if (pasoActual.value < 3) {
    pasoActual.value++
    if (!pasosCompletados.value.includes(pasoActual.value - 1)) {
      pasosCompletados.value.push(pasoActual.value - 1)
    }
  }
}

const retrocederPaso = () => {
  if (pasoActual.value > 1) {
    pasoActual.value--
  }
}

const irAPaso = (paso: number) => {
  if (paso <= pasoActual.value || pasosCompletados.value.includes(paso - 1)) {
    pasoActual.value = paso
  }
}

// Opciones para PrimeVue Select
const clientesOptions = computed(() => {
  return clientes.value.map((cliente: any) => ({
    value: cliente.id,
    label: `${cliente.name} ${cliente.lastname}${cliente.email ? ` - ${cliente.email}` : ''}${cliente.company ? ` (${cliente.company})` : ''}`,
    data: cliente
  }))
})

const productosOptions = computed(() => {
  return productos.value.map((producto: any) => ({
    value: producto.id,
    label: `${producto.name} - $${Number(producto.price).toFixed(2)}`,
    data: producto
  }))
})

// Función para obtener productos disponibles para un item específico (excluye productos ya seleccionados)
const getProductosDisponibles = (currentIndex: number) => {
  console.log('🔍 getProductosDisponibles llamado con currentIndex:', currentIndex)
  console.log('📦 Total productos:', productos.value.length)
  
  // Obtener IDs de productos seleccionados en otros items
  const productosSeleccionados = formulario.value.items
    .map((item, index) => index !== currentIndex ? item.producto_id : null)
    .filter(id => id !== null)
    .map(id => Number(id))

  console.log('🚫 Productos seleccionados en otros items:', productosSeleccionados)

  // Filtrar productos que no están seleccionados
  const disponibles = productos.value.filter((producto: any) =>
    !productosSeleccionados.includes(Number(producto.id))
  )
  
  console.log('✅ Productos disponibles:', disponibles.length)
  console.log('📋 Lista disponible:', disponibles.map(p => ({ id: p.id, name: p.name })))
  
  return disponibles
}

// Validación del formulario
const formularioValido = computed(() => {
  if (!tipoCliente.value) return false
  
  // Si es cliente nuevo, validar datos del nuevo cliente
  if (tipoCliente.value === 'nuevo') {
    if (!formularioNuevoCliente.value.name || !formularioNuevoCliente.value.lastname) {
      return false
    }
  }
  
  // Si es cliente existente, validar selección
  if (tipoCliente.value === 'existente' && !formulario.value.customer_id) {
    return false
  }
  
  if (formulario.value.items.length === 0) return false
  
  // Validar que todos los items tengan producto y cantidad
  return formulario.value.items.every(item => 
    item.producto_id && parseFloat(String(item.cantidad)) > 0 && parseFloat(String(item.precio_unitario)) >= 0
  )
})

// Cálculos
const calcularSubtotal = (item: any) => {
  const cantidad = parseFloat(item.cantidad) || 0
  const precio = parseFloat(item.precio_unitario) || 0
  const descuento = parseFloat(item.descuento) || 0
  return (cantidad * precio) - descuento
}

// Función helper para obtener el nombre del producto por ID
const getNombreProducto = (productoId: any) => {
  console.log('🔍 getNombreProducto llamado con productoId:', productoId, '(tipo:', typeof productoId, ')')
  console.log('📦 Productos disponibles:', productos.value.length)
  
  const producto = productos.value.find((p: any) => {
    const pId = typeof p.id === 'string' ? parseInt(p.id) : p.id
    const itemId = typeof productoId === 'string' ? parseInt(productoId) : productoId
    console.log('🔄 Comparando:', pId, 'vs', itemId)
    return pId === itemId
  })
  
  const resultado = producto ? producto.name : 'Producto no encontrado'
  console.log('✅ Resultado:', resultado)
  return resultado
}

// Función para obtener información completa del cliente seleccionado
const getClienteInfo = computed(() => {
  console.log('🔍 getClienteInfo ejecutado')
  console.log('  - tipoCliente:', tipoCliente.value)
  console.log('  - customer_id:', formulario.value.customer_id, '(tipo:', typeof formulario.value.customer_id, ')')

  if (tipoCliente.value === 'existente' && formulario.value.customer_id) {
    // Normalizar IDs para comparación (convertir a número)
    const customerId = typeof formulario.value.customer_id === 'string'
      ? parseInt(formulario.value.customer_id)
      : formulario.value.customer_id

    const cliente = clientes.value.find((c: any) => {
      const cId = typeof c.id === 'string' ? parseInt(c.id) : c.id
      return cId === customerId
    })

    console.log('  - Cliente encontrado:', cliente ? cliente.name : 'No encontrado')
    return cliente
  } else if (tipoCliente.value === 'nuevo') {
    console.log('  - Usando formulario nuevo cliente:', formularioNuevoCliente.value.name)
    return formularioNuevoCliente.value
  }

  console.log('  - Retornando null')
  return null
})

const totales = computed(() => {
  const subtotal = formulario.value.items.reduce((sum, item) => sum + calcularSubtotal(item), 0)
  const descuentoGlobal = parseFloat(formulario.value.descuento) || 0

  // Usar el impuesto del sistema si está activo y aplicarImpuesto es true
  let tasaImpuesto = 0
  if (aplicarImpuesto.value && impuestoSistema.value && impuestoSistema.value.is_active) {
    tasaImpuesto = parseFloat(impuestoSistema.value.rate) || 0
  } else {
    tasaImpuesto = parseFloat(formulario.value.impuesto) || 0
  }

  const subtotalConDescuento = subtotal - descuentoGlobal
  const impuestoCalculado = (subtotalConDescuento * tasaImpuesto) / 100
  const total = subtotalConDescuento + impuestoCalculado

  return {
    subtotal,
    descuentoGlobal,
    impuesto: impuestoCalculado,
    tasaImpuesto,
    total
  }
})

// Validación de campos
const validarCampo = (campo: string, valor: any) => {
  switch (campo) {
    case 'nombre':
    case 'apellido': {
      if (!valor || valor.trim().length < 2) {
        return 'Este campo debe tener al menos 2 caracteres'
      }
      return null
    }
    case 'email': {
      if (!valor) return null // Email es opcional
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(valor)) {
        return 'Formato de email inválido'
      }
      return null
    }
    case 'telefono': {
      if (!valor) return null // Teléfono es opcional
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
      if (!phoneRegex.test(valor)) {
        return 'Formato de teléfono inválido'
      }
      return null
    }
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
  // Destruir todos los Select2 existentes ANTES de modificar el array
  formulario.value.items.forEach((_, index) => {
    const productoSelect = document.getElementById(`producto-select-${index}`)
    if (productoSelect && $(productoSelect).hasClass('select2-hidden-accessible')) {
      $(productoSelect).select2('destroy')
    }
  })

  // Agregar al inicio del array (unshift) en lugar del final (push)
  formulario.value.items.unshift({
    id: Date.now() + Math.random(), // ID único para el nuevo item
    producto_id: null,
    cantidad: 1,
    precio_unitario: '0.00',
    descuento: '0.00',
    descripcion: ''
  })

  // Esperar a que el DOM se actualice y luego reinicializar
  nextTick(() => {
    setTimeout(() => {
      inicializarSelect2()
    }, 100)
  })
}

const eliminarItem = (itemId: number) => {
  const index = formulario.value.items.findIndex(item => item.id === itemId)
  if (index !== -1) {
    formulario.value.items.splice(index, 1)
    limpiarErrores()

    // Reinicializar Select2 después de eliminar
    nextTick(() => {
      // Destruir todos los Select2 existentes
      formulario.value.items.forEach((_, idx) => {
        const productoSelect = document.getElementById(`producto-select-${idx}`)
        if (productoSelect && $(productoSelect).hasClass('select2-hidden-accessible')) {
          $(productoSelect).select2('destroy')
        }
      })
      // Reinicializar todos los Select2
      inicializarSelect2()
    })
  }
}

const seleccionarProducto = (itemId: number) => {
  console.log(`seleccionarProducto llamado con itemId: ${itemId}`)
  console.log(`Total de items: ${formulario.value.items.length}`)

  const item = formulario.value.items.find(i => i.id === itemId)

  if (!item) {
    console.error(`No se encontró el item con ID ${itemId}`)
    return
  }

  console.log(`Item encontrado, producto_id: ${item.producto_id} (tipo: ${typeof item.producto_id})`)
  console.log(`Total productos disponibles: ${productos.value.length}`)

  // Normalizar IDs para comparación (convertir a número)
  const productoId = typeof item.producto_id === 'string' ? parseInt(item.producto_id) : item.producto_id
  const producto = productos.value.find((p: any) => {
    const pId = typeof p.id === 'string' ? parseInt(p.id) : p.id
    return pId === productoId
  })

  if (producto) {
    // Cargar el precio del producto seleccionado
    const nuevoPrecio = Number(producto.price).toFixed(2)
    item.precio_unitario = nuevoPrecio

    // Mostrar mensaje de confirmación
    console.log(`✅ Precio cargado: $${nuevoPrecio} para producto: ${producto.name} (itemId: ${itemId})`)
  } else {
    console.warn(`❌ No se encontró el producto con ID: ${item.producto_id}`)
    console.log('Productos disponibles:', productos.value.map((p: any) => ({ id: p.id, name: p.name })))
    // Limpiar precio si no se encuentra el producto
    item.precio_unitario = '0.00'
  }
}

const limpiarFormulario = () => {
  // Resetear todos los datos del formulario
  tipoCliente.value = null
  formularioNuevoCliente.value = {
    name: '',
    lastname: '',
    email: '',
    phone: '',
    company: ''
  }
  formulario.value = {
    customer_id: null,
    items: [
      {
        producto_id: null,
        cantidad: 1,
        precio_unitario: '0.00',
        descuento: '0.00',
        descripcion: ''
      }
    ],
    impuesto: '0.00',
    descuento: '0.00',
    notas: '',
    terminos: 'Válido por 30 días. Precios sujetos a cambios sin previo aviso.'
  }
  
  // Limpiar errores y datos temporales
  errores.value = {}
  limpiarDatosTemporales()
  
  // Reinicializar Select2
  nextTick(() => {
    inicializarSelect2()
  })
  
  success('Formulario limpiado', 'Todos los datos han sido eliminados')
}

const volver = () => {
  router.push('/app/cotizaciones')
}

const guardarCotizacion = async () => {
  if (!formularioValido.value) return
  
  try {
    cargando.value = true
    
    const datosCotizacion = {
      ...formulario.value,
      // Si es cliente nuevo, incluir los datos del cliente
      ...(tipoCliente.value === 'nuevo' && {
        nuevo_cliente: formularioNuevoCliente.value
      })
    }
    
    console.log('Datos a enviar:', datosCotizacion)
    console.log('Tipo de cliente:', tipoCliente.value)
    console.log('Formulario:', formulario.value)
    console.log('Items:', formulario.value.items)
    
    const response = await axios.post('/cotizaciones', datosCotizacion)
    console.log('Respuesta del servidor:', response.data)
    
    success('Éxito', 'Cotización creada correctamente')
    
    // Limpiar datos temporales después de guardar exitosamente
    limpiarDatosTemporales()
    
    router.push('/app/cotizaciones')
  } catch (err: any) {
    console.error('Error al guardar cotización:', err)
    console.error('Detalles del error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
      config: err.config
    })
    error('Error', err.response?.data?.error || err.response?.data?.message || 'No se pudo crear la cotización')
  } finally {
    cargando.value = false
  }
}

// Cargar datos
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
    console.log('🔄 Cargando productos...')
    const response = await axios.get('/productos', { params: { per_page: 'all' } })
    console.log('📦 Respuesta de productos:', response.data)
    
    // Manejar diferentes estructuras de respuesta
    let productosData = response.data.data
    if (Array.isArray(productosData)) {
      // Cuando per_page: 'all', los datos están directamente en data
      productos.value = productosData
    } else if (productosData && productosData.data) {
      // Cuando hay paginación, los datos están en data.data
      productos.value = productosData.data
    } else {
      // Fallback: usar toda la respuesta como datos
      productos.value = response.data.data || []
    }
    
    console.log('✅ Productos cargados:', productos.value.length, 'productos')
    console.log('📋 Lista de productos:', productos.value.map(p => ({ id: p.id, name: p.name, price: p.price })))
  } catch (err) {
    console.error('❌ Error al cargar productos:', err)
  }
}

const cargarImpuestoSistema = async () => {
  try {
    const response = await axios.get('/taxes/active')
    if (response.data.data) {
      impuestoSistema.value = response.data.data
      // Actualizar el valor del impuesto en el formulario si aplicarImpuesto está activo
      if (aplicarImpuesto.value) {
        formulario.value.impuesto = response.data.data.rate.toString()
      }
    }
  } catch (err) {
    console.error('Error al cargar impuesto del sistema:', err)
  }
}

// Inicializar Select2 con configuración mejorada
const inicializarSelect2 = async () => {
  await nextTick()

  // Configuración común para ambos Select2
  const configuracionComun = {
    allowClear: true,
    width: '100%',
    language: {
      noResults: function() {
        return "No se encontraron resultados";
      },
      searching: function() {
        return "Buscando...";
      }
    }
  }

  // Inicializar Select2 para cliente solo si está visible
  if (tipoCliente.value === 'existente') {
    const clienteSelect = document.getElementById('cliente-select')
    if (clienteSelect) {
      // Destruir si ya existe
      if ($(clienteSelect).hasClass('select2-hidden-accessible')) {
        $(clienteSelect).select2('destroy')
      }
      $(clienteSelect).select2({
        ...configuracionComun,
        placeholder: 'Buscar cliente por nombre, email o empresa...',
        minimumInputLength: 0
      }).on('change', function(this: any) {
        formulario.value.customer_id = $(this).val()
      })
    }
  }

  // Inicializar Select2 para productos existentes
  formulario.value.items.forEach((item, index) => {
    const productoSelect = document.getElementById(`producto-select-${index}`)
    if (productoSelect) {
      // Remover TODOS los eventos anteriores primero
      $(productoSelect).off('change')
      $(productoSelect).off('select2:select')

      // Destruir si ya existe
      if ($(productoSelect).hasClass('select2-hidden-accessible')) {
        $(productoSelect).select2('destroy')
      }

      // Obtener productos disponibles para este item
      const productosDisponibles = getProductosDisponibles(index)

      // Crear opciones para Select2 usando productos filtrados
      const data = [
        { id: '', text: '' },
        ...productosDisponibles.map((p: any) => ({
          id: p.id,
          text: `${p.name} - $${Number(p.price).toFixed(2)}`
        }))
      ]

      $(productoSelect).select2({
        ...configuracionComun,
        placeholder: 'Selecciona un producto',
        minimumInputLength: 0,
        data: data
      })

      // Restaurar valor si existe
      if (item.producto_id) {
        $(productoSelect).val(item.producto_id).trigger('change.select2')
      }

      // Usar el evento select2:select en lugar de change
      $(productoSelect).on('select2:select', function(e: any) {
        const selectedId = e.params.data.id

        // Encontrar el índice actual del select en el DOM
        const selectId = $(e.target).attr('id')
        const currentIndex = parseInt(selectId.replace('producto-select-', ''))

        console.log(`Select2 evento disparado para índice: ${currentIndex}, producto ID: ${selectedId}`)

        // Actualizar el modelo
        formulario.value.items[currentIndex].producto_id = selectedId

        // Llamar a seleccionarProducto con el ID del item correcto
        const currentItem = formulario.value.items[currentIndex]
        if (currentItem) {
          seleccionarProducto(currentItem.id)
        }

        // Actualizar las listas de productos después
        setTimeout(() => {
          actualizarListasProductos()
        }, 100)
      })
    }
  })
}

// Actualizar listas de productos en todos los selects
const actualizarListasProductos = () => {
  formulario.value.items.forEach((item, index) => {
    const productoSelect = document.getElementById(`producto-select-${index}`)
    if (productoSelect && $(productoSelect).hasClass('select2-hidden-accessible')) {
      // Obtener el valor actual
      const valorActual = item.producto_id

      // Destruir Select2
      $(productoSelect).select2('destroy')

      // Obtener productos disponibles para este item
      const productosDisponibles = getProductosDisponibles(index)

      // Crear opciones para Select2 usando productos filtrados
      const data = [
        { id: '', text: '' },
        ...productosDisponibles.map((p: any) => ({
          id: p.id,
          text: `${p.name} - $${Number(p.price).toFixed(2)}`
        }))
      ]

      // Reinicializar Select2 con las nuevas opciones
      $(productoSelect).select2({
        allowClear: true,
        width: '100%',
        placeholder: 'Selecciona un producto',
        minimumInputLength: 0,
        data: data,
        language: {
          noResults: function() {
            return "No se encontraron resultados";
          },
          searching: function() {
            return "Buscando...";
          }
        }
      })

      // Restaurar el valor actual
      if (valorActual) {
        $(productoSelect).val(valorActual).trigger('change.select2')
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

// Observar cambios en tipoCliente para inicializar Select2 cuando sea necesario
watch(tipoCliente, (newValue: 'existente' | 'nuevo' | null) => {
  if (newValue === 'existente') {
    nextTick(() => {
      inicializarSelect2()
    })
  }

  // Resetear al paso 1 cuando cambie el tipo de cliente
  pasoActual.value = 1
  pasosCompletados.value = []
})

// Watcher para avanzar automáticamente al paso 2
// Deshabilitado para evitar avance prematuro mientras el usuario escribe
// El usuario debe hacer clic en "Siguiente" para avanzar
// watch([() => formulario.value.customer_id, () => formularioNuevoCliente.value.name, () => formularioNuevoCliente.value.lastname], () => {
//   if (validarPaso1() && pasoActual.value === 1) {
//     setTimeout(() => {
//       avanzarPaso()
//     }, 500) // Pequeño delay para mejor UX
//   }
// }, { deep: true })

// Watchers para guardar datos automáticamente (comentados para que el formulario siempre inicie limpio)
// watch(formularioNuevoCliente, () => {
//   guardarDatosTemporales()
// }, { deep: true })

// watch(formulario, () => {
//   guardarDatosTemporales()
// }, { deep: true })

onMounted(async () => {
  // Limpiar datos temporales al montar el componente para empezar siempre limpio
  limpiarDatosTemporales()

  // Resetear pasos al inicio
  pasoActual.value = 1
  pasosCompletados.value = []

  await cargarClientes()
  await cargarProductos()
  await cargarImpuestoSistema()

  // Inicializar Select2 después de cargar datos
  await inicializarSelect2()
})
</script>

<style scoped>
.form-section {
  margin-bottom: 2rem;
}

/* Estilos para el sistema de pasos */
.steps-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.step-item {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -50%;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.step-item.completed:not(:last-child)::after {
  background: #10b981;
}

.step-item.active {
  background: #3b82f6;
  color: white;
}

.step-item.completed {
  background: #10b981;
  color: white;
}

.step-item.disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.dark .step-item.disabled {
  background: #374151;
  color: #6b7280;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin-right: 0.75rem;
  font-weight: 600;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.step-description {
  font-size: 0.75rem;
  opacity: 0.8;
  margin: 0.25rem 0 0 0;
}

.step-header {
  margin-bottom: 1.5rem;
}

.step-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.dark .step-subtitle {
  color: #9ca3af;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.dark .subsection-title {
  color: #f3f4f6;
}

.step-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

/* Estilos para el resumen */
.summary-section {
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.dark .summary-section {
  background: #374151;
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.dark .summary-item {
  border-bottom-color: #4b5563;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-weight: 500;
  color: #6b7280;
}

.dark .summary-label {
  color: #9ca3af;
}

.summary-value {
  font-weight: 600;
  color: #374151;
}

.dark .summary-value {
  color: #f3f4f6;
}

.total-amount {
  font-size: 1.125rem;
  color: #3b82f6;
}

@media (max-width: 768px) {
  .steps-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step-item:not(:last-child)::after {
    display: none;
  }
  
  .summary-card {
    gap: 0.5rem;
  }
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

.client-type-selection {
  margin-bottom: 1rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.radio-option:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.dark .radio-option {
  border-color: #475569;
}

.dark .radio-option:hover {
  border-color: #3b82f6;
  background-color: #374151;
}

.radio-input {
  margin-right: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #374151;
}

.dark .radio-label {
  color: #f8fafc;
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
  min-height: 80px;
  justify-content: flex-start;
}

.form-group-compact {
  min-height: 70px;
}

.form-group-wide {
  min-height: 90px;
}

.form-group-small {
  min-height: 70px;
  max-width: 120px;
}

.price-input-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-indicator {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 500;
  white-space: nowrap;
}

.price-indicator-below {
  display: block;
  font-size: 0.7rem;
  color: #10b981;
  font-weight: 500;
  margin-top: 0.25rem;
  text-align: left;
}

.price-auto-loaded {
  border-color: #10b981 !important;
  background-color: #f0fdf4;
}

.dark .price-auto-loaded {
  background-color: #064e3b;
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

.totals-grid-improved {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  max-width: 800px;
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

.total-input-wide {
  width: 150px;
  min-width: 150px;
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
  
  .totals-grid-improved {
    grid-template-columns: 1fr;
  }
  
  .total-input-wide {
    width: 120px;
    min-width: 120px;
  }
  
  .price-input-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .price-indicator {
    font-size: 0.7rem;
  }
}

/* Estilos para información del cliente */
.client-info-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.dark .client-info-card {
  background: #1f2937;
  border-color: #374151;
}

.client-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.dark .client-info-row {
  border-bottom-color: #374151;
}

.client-info-row:last-child {
  border-bottom: none;
}

.client-info-label {
  font-weight: 500;
  color: #64748b;
  font-size: 0.875rem;
}

.dark .client-info-label {
  color: #94a3b8;
}

.client-info-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.dark .client-info-value {
  color: #f1f5f9;
}

.no-client-message {
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #991b1b;
  text-align: center;
}

.dark .no-client-message {
  background: #7f1d1d;
  border-color: #991b1b;
  color: #fecaca;
}

/* Estilos para tabla de productos */
.products-table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.dark .products-table-container {
  border-color: #374151;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.dark .products-table {
  background: #1f2937;
}

.products-table thead {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.dark .products-table thead {
  background: #374151;
  border-bottom-color: #4b5563;
}

.products-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .products-table th {
  color: #cbd5e1;
}

.products-table td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.dark .products-table td {
  color: #f1f5f9;
  border-bottom-color: #374151;
}

.product-row:hover {
  background: #f8fafc;
}

.dark .product-row:hover {
  background: #374151;
}

.product-name {
  font-weight: 500;
  color: #3b82f6;
}

.dark .product-name {
  color: #60a5fa;
}

.btn-delete-product {
  padding: 0.375rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-delete-product:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.btn-delete-product:active {
  transform: scale(0.95);
}

.products-table tfoot {
  background: #f8fafc;
  border-top: 2px solid #e2e8f0;
  font-weight: 600;
}

.dark .products-table tfoot {
  background: #374151;
  border-top-color: #4b5563;
}

.total-row td {
  padding: 1rem;
  font-size: 1rem;
  color: #1e293b;
}

.dark .total-row td {
  color: #f1f5f9;
}

@media (max-width: 768px) {
  .products-table {
    font-size: 0.75rem;
  }

  .products-table th,
  .products-table td {
    padding: 0.5rem;
  }

  .product-name {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* Estilos para checkbox de impuesto */
.form-checkbox {
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

.dark .form-checkbox {
  border-color: #6b7280;
  background-color: #374151;
}

.form-checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.dark .form-checkbox:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}
</style>
