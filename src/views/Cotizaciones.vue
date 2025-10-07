<template>
  <div class="space-y-6">
    <PageHeader title="Cotizaciones" subtitle="Gestiona las cotizaciones de tus clientes" :icon="FileText">
      <template #actions>
        <Button @click="nuevaCotizacion">
          <Plus class="mr-2 h-4 w-4" /> Nueva Cotización
        </Button>
      </template>
    </PageHeader>

    <!-- Estadísticas -->
    <StatsGrid>
      <StatsCard 
        label="Total Cotizaciones" 
        :value="(estadisticas as any).total || 0" 
        icon="FileText" 
        color="blue"
      />
      <StatsCard 
        label="Generadas" 
        :value="(estadisticas as any).generada || 0" 
        icon="Send" 
        color="yellow"
      />
      <StatsCard 
        label="Entregadas" 
        :value="(estadisticas as any).entregada || 0" 
        icon="CheckCircle" 
        color="green"
      />
      <StatsCard 
        label="Vendidas" 
        :value="(estadisticas as any).vendida || 0" 
        icon="DollarSign" 
        color="emerald"
      />
    </StatsGrid>

    <!-- Controles de tabla -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">Mostrar</span>
          <select 
            v-model="elementosPorPagina" 
            @change="cargarCotizaciones"
            class="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-sm text-muted-foreground">entradas por página</span>
        </div>
        
        <!-- Botón de borrado múltiple -->
        <Button 
          v-if="seleccionadas.length > 0" 
          variant="destructive" 
          size="sm"
          @click="confirmarBorradoMultiple"
        >
          <Trash2 class="mr-2 h-4 w-4" />
          Eliminar {{ seleccionadas.length }} seleccionada{{ seleccionadas.length > 1 ? 's' : '' }}
        </Button>
      </div>
      
      <div class="relative">
        <input
          v-model="busqueda"
          placeholder="Buscar..."
          class="pl-10 pr-4 py-2 border rounded-lg w-64 text-sm"
          @input="cargarCotizaciones"
        />
      </div>
    </div>
    <div class="mb-4">
      <select 
        v-model="filtroEstado" 
        class="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700"
        @change="cargarCotizaciones"
      >
        <option value="">Todos los estados</option>
        <option value="generada">Generada</option>
        <option value="entregada">Entregada</option>
        <option value="vendida">Vendida</option>
        <option value="rechazada">Rechazada</option>
      </select>
    </div>

    <!-- Tabla de cotizaciones -->
    <DataTable
      :columns="columns"
      :data="Array.isArray(cotizaciones) ? cotizaciones : []"
      :sort-by="ordenarPor"
      :sort-order="sortOrderComputed"
      @sort="handleSortChange"
    >
      <template #header-seleccionar>
        <input
          type="checkbox"
          :checked="todasSeleccionadas"
          @change="toggleTodasSeleccionadas"
          class="h-4 w-4 text-blue-600 rounded cursor-pointer"
          title="Seleccionar todas"
        />
      </template>

      <template #cell-seleccionar="{ item }">
        <input
          type="checkbox"
          :checked="seleccionadas.includes(item.id)"
          @change="toggleSeleccion(item.id)"
          class="h-4 w-4 text-blue-600 rounded cursor-pointer"
        />
      </template>

      <template #cell-numero_cotizacion="{ item }">
        <span class="font-mono font-semibold text-blue-600 dark:text-blue-400">
          {{ item?.numero_cotizacion || '-' }}
        </span>
      </template>

      <template #cell-customer_name="{ item }">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
                {{ item?.customer?.name?.charAt(0) || '?' }}
              </span>
            </div>
          </div>
          <div>
            <div class="font-medium text-sm">
              {{ item?.customer?.name }} {{ item?.customer?.lastname }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ item?.customer?.email }}
            </div>
          </div>
        </div>
      </template>

      <template #cell-fecha_cotizacion="{ item }">
        <span class="text-sm">{{ formatearFecha(item?.fecha_cotizacion) }}</span>
      </template>

      <template #cell-fecha_vencimiento="{ item }">
        <span class="text-sm">{{ formatearFecha(item?.fecha_vencimiento) }}</span>
      </template>

      <template #cell-estado="{ item }">
        <StatusBadge :status="item?.estado" :label="capitalizar(item?.estado)" />
      </template>

      <template #cell-total="{ item }">
        <span class="font-semibold text-green-600 dark:text-green-400">
          ${{ Number(item?.total || 0).toFixed(2) }}
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" @click="editarCotizacion(item)" title="Editar">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" @click="verCotizacion(item)" title="Ver">
            <Eye class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="eliminarCotizacion(item)" title="Eliminar">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </template>
    </DataTable>

    <!-- Paginación -->
    <Pagination
      v-if="paginacion.total > 0"
      :current-page="paginacion.paginaActual"
      :last-page="paginacion.ultimaPagina"
      :total="paginacion.total"
      :from="paginacion.desde"
      :to="paginacion.hasta"
      @change="cambiarPagina"
    />

    <!-- Diálogo de confirmación -->
    <ConfirmDialog
      ref="confirmDialog"
      :title="confirmacion.title"
      :message="confirmacion.message"
      :details="confirmacion.details"
      :confirmText="confirmacion.confirmText"
      @confirm="confirmacion.onConfirm"
      @cancel="confirmacion.onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import axios from '@/config/axios'
import Button from '@/components/ui/Button.vue'
import DataTable from '@/components/ui/DataTable.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatsGrid from '@/components/ui/StatsGrid.vue'
import StatsCard from '@/components/ui/StatsCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import Pagination from '@/components/ui/Pagination.vue'
import { 
  FileText, 
  Plus, 
  Edit, 
  Send, 
  CheckCircle, 
  DollarSign,
  Eye, 
  Trash2,
} from 'lucide-vue-next'

const { success, error: showError } = useToast()
const router = useRouter()

// Estado
const cotizaciones = ref([])
const estadisticas = ref({})
const cargando = ref(false)

// Filtros y ordenamiento
const busqueda = ref('')
const filtroEstado = ref('')
const ordenarPor = ref('fecha_cotizacion')
const direccionOrden = ref('desc')
const elementosPorPagina = ref(10)

// Paginación
const paginacion = ref({
  paginaActual: 1,
  ultimaPagina: 1,
  total: 0,
  desde: 0,
  hasta: 0
})

// Selección múltiple
const seleccionadas = ref<number[]>([])

// Computed para verificar si todas están seleccionadas
const todasSeleccionadas = computed({
  get: () => {
    if (cotizaciones.value.length === 0) return false
    return cotizaciones.value.every((c: any) => seleccionadas.value.includes(c.id))
  },
  set: (value: boolean) => {
    if (value) {
      seleccionadas.value = cotizaciones.value.map((c: any) => c.id)
    } else {
      seleccionadas.value = []
    }
  }
})

// Referencia al diálogo de confirmación
const confirmDialog = ref<any>(null)

// Estado de confirmación
const confirmacion = ref<{
  title: string
  message: string
  details: string
  confirmText: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}>({
  title: '',
  message: '',
  details: '',
  confirmText: 'Sí, continuar',
  onConfirm: () => { /* empty */ },
  onCancel: undefined
})

// Columnas de la tabla
const columns = ref([
  { key: 'seleccionar', label: '', sortable: false },
  { key: 'numero_cotizacion', label: 'Número', sortable: true },
  { key: 'customer_name', label: 'Cliente', sortable: true },
  { key: 'fecha_cotizacion', label: 'Fecha Cotización', sortable: true },
  { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'total', label: 'Total', sortable: true }
])

// Métodos
const cargarCotizaciones = async () => {
  try {
    cargando.value = true
    const params: any = {
      per_page: elementosPorPagina.value,
      page: paginacion.value.paginaActual,
      sort_by: ordenarPor.value,
      sort_direction: direccionOrden.value
    }
    
    if (busqueda.value) params.search = busqueda.value
    if (filtroEstado.value) params.estado = filtroEstado.value
    
    const response = await axios.get('/cotizaciones', { params })
    
    // Los datos de cotizaciones están en response.data.data.data (array dentro del objeto de paginación)
    if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
      cotizaciones.value = response.data.data.data
      
      // Actualizar datos de paginación
      const paginationData = response.data.data
      paginacion.value = {
        paginaActual: paginationData.current_page || 1,
        ultimaPagina: paginationData.last_page || 1,
        total: paginationData.total || 0,
        desde: paginationData.from || 0,
        hasta: paginationData.to || 0
      }
    } else {
      console.error('Los datos no son un array:', response.data)
      cotizaciones.value = []
    }
    
    // Cargar estadísticas
    const statsResponse = await axios.get('/cotizaciones/estadisticas')
    
    // Las estadísticas están en response.data.data
    if (statsResponse.data && statsResponse.data.data && typeof statsResponse.data.data === 'object') {
      estadisticas.value = statsResponse.data.data
    } else {
      console.error('Las estadísticas no son un objeto:', statsResponse.data)
      estadisticas.value = {}
    }
  } catch (err) {
    console.error('Error al cargar cotizaciones:', err)
    showError('Error', 'No se pudieron cargar las cotizaciones')
  } finally {
    cargando.value = false
  }
}

const nuevaCotizacion = () => {
  router.push('/app/cotizaciones/create')
}

const editarCotizacion = (cotizacion: any) => {
  router.push(`/app/cotizaciones/${cotizacion.id}/edit`)
}

const verCotizacion = (cotizacion: any) => {
  // TODO: Implementar vista de detalle
  console.log('Ver cotización:', cotizacion)
}

// Funciones de selección múltiple
const toggleSeleccion = (id: number) => {
  const index = seleccionadas.value.indexOf(id)
  if (index > -1) {
    seleccionadas.value.splice(index, 1)
  } else {
    seleccionadas.value.push(id)
  }
}

const toggleTodasSeleccionadas = () => {
  todasSeleccionadas.value = !todasSeleccionadas.value
}

const cambiarPagina = (pagina: number) => {
  paginacion.value.paginaActual = pagina
  seleccionadas.value = [] // Limpiar selección al cambiar de página
  cargarCotizaciones()
}

const confirmarBorradoMultiple = () => {
  const cantidad = seleccionadas.value.length
  const mensaje = cantidad === 1 
    ? '¿Estás seguro de que quieres eliminar esta cotización?' 
    : `¿Estás seguro de que quieres eliminar ${cantidad} cotizaciones?`
  
  const detalles = cantidad === 1
    ? 'Esta acción no se puede deshacer.'
    : `Se eliminarán ${cantidad} cotizaciones. Esta acción no se puede deshacer.`
  
  confirmacion.value = {
    title: 'Confirmar eliminación',
    message: mensaje,
    details: detalles,
    confirmText: 'Sí, continuar',
    onConfirm: eliminarMultiples,
    onCancel: undefined
  }
  
  confirmDialog.value?.open()
}

const eliminarMultiples = async () => {
  try {
    cargando.value = true
    await axios.post('/cotizaciones/bulk-delete', {
      ids: seleccionadas.value
    })
    
    const cantidad = seleccionadas.value.length
    success(
      'Éxito', 
      `${cantidad} cotización${cantidad > 1 ? 'es' : ''} eliminada${cantidad > 1 ? 's' : ''} correctamente`
    )
    
    seleccionadas.value = []
    cargarCotizaciones()
  } catch (err) {
    console.error('Error al eliminar cotizaciones:', err)
    showError('Error', 'No se pudieron eliminar las cotizaciones')
  } finally {
    cargando.value = false
  }
}

const eliminarCotizacion = (cotizacion: any) => {
  confirmacion.value = {
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de que quieres eliminar la cotización ${cotizacion?.numero_cotizacion || 'N/A'}?`,
    details: 'Esta acción no se puede deshacer.',
    confirmText: 'Sí, continuar',
    onConfirm: async () => {
      try {
        await axios.delete(`/cotizaciones/${cotizacion?.id}`)
        success('Éxito', 'Cotización eliminada correctamente')
        cargarCotizaciones()
      } catch (err) {
        console.error('Error al eliminar cotización:', err)
        showError('Error', 'No se pudo eliminar la cotización')
      }
    },
    onCancel: undefined
  }
  
  confirmDialog.value?.open()
}

const formatearFecha = (fecha: string | undefined | null) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const capitalizar = (texto: string | undefined | null) => {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const sortOrderComputed = computed(() => {
  return direccionOrden.value as 'asc' | 'desc'
})

const handleSortChange = (key: string, order: 'asc' | 'desc') => {
  ordenarPor.value = key
  direccionOrden.value = order
  cargarCotizaciones()
}

// Lifecycle
onMounted(() => {
  cargarCotizaciones()
})
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>