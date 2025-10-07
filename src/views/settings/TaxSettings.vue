<template>
  <div class="space-y-6">
    <!-- Header -->
    <PageHeader
      title="Configuración de Impuestos"
      subtitle="Gestiona los impuestos del sistema"
      :icon="Receipt"
    />

    <!-- Card de impuesto activo -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Impuesto Activo</h3>

      <div v-if="cargando" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="impuestoActivo">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label class="form-label">Nombre del Impuesto</label>
            <input
              v-model="formulario.name"
              type="text"
              class="form-input"
              placeholder="Ej: ITBIS, IVA"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Tasa (%)</label>
            <input
              v-model.number="formulario.rate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              class="form-input"
              placeholder="8.5"
            />
          </div>

          <div class="form-group col-span-full">
            <label class="form-label">Descripción</label>
            <textarea
              v-model="formulario.description"
              class="form-textarea"
              rows="3"
              placeholder="Descripción del impuesto..."
            ></textarea>
          </div>

          <div class="form-group col-span-full">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="formulario.is_active"
                type="checkbox"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Impuesto activo
              </span>
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Cuando está activo, este impuesto se aplicará automáticamente en cotizaciones y ventas
            </p>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <Button @click="guardarCambios" variant="default">
            <Save class="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>

          <Button @click="cancelar" variant="outline">
            <X class="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No hay impuesto configurado</p>
        <Button @click="crearNuevoImpuesto" variant="default" class="mt-4">
          <Plus class="h-4 w-4 mr-2" />
          Crear Impuesto
        </Button>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <Info class="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
            Acerca del impuesto
          </h3>
          <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
            <p>El impuesto configurado aquí se aplicará automáticamente al crear cotizaciones y ventas.</p>
            <p class="mt-1">Puedes activar o desactivar el impuesto según sea necesario.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../../config/axios'
import { useToast } from '../../composables/useToast'
import PageHeader from '../../components/ui/PageHeader.vue'
import Button from '../../components/ui/Button.vue'
import { Receipt, Save, X, Plus, Info } from 'lucide-vue-next'

const { success, error } = useToast()

interface Tax {
  id: number
  name: string
  rate: number
  is_active: boolean
  description: string | null
}

const cargando = ref(false)
const impuestoActivo = ref<Tax | null>(null)
const formulario = ref({
  name: '',
  rate: 0,
  is_active: true,
  description: ''
})

const cargarImpuestoActivo = async () => {
  try {
    cargando.value = true
    const response = await axios.get('/taxes/active')

    if (response.data.data) {
      impuestoActivo.value = response.data.data
      formulario.value = {
        name: response.data.data.name,
        rate: parseFloat(response.data.data.rate),
        is_active: response.data.data.is_active,
        description: response.data.data.description || ''
      }
    }
  } catch (err: any) {
    console.error('Error al cargar impuesto:', err)
    error('Error', 'No se pudo cargar la configuración del impuesto')
  } finally {
    cargando.value = false
  }
}

const guardarCambios = async () => {
  if (!impuestoActivo.value) return

  try {
    cargando.value = true
    await axios.put(`/taxes/${impuestoActivo.value.id}`, formulario.value)

    success('Éxito', 'Configuración de impuesto actualizada correctamente')
    await cargarImpuestoActivo()
  } catch (err: any) {
    console.error('Error al guardar impuesto:', err)
    error('Error', 'No se pudo guardar la configuración del impuesto')
  } finally {
    cargando.value = false
  }
}

const crearNuevoImpuesto = async () => {
  try {
    cargando.value = true
    await axios.post('/taxes', {
      name: 'ITBIS',
      rate: 8.5,
      is_active: true,
      description: 'Impuesto sobre Transferencia de Bienes Industrializados y Servicios'
    })

    success('Éxito', 'Impuesto creado correctamente')
    await cargarImpuestoActivo()
  } catch (err: any) {
    console.error('Error al crear impuesto:', err)
    error('Error', 'No se pudo crear el impuesto')
  } finally {
    cargando.value = false
  }
}

const cancelar = () => {
  if (impuestoActivo.value) {
    formulario.value = {
      name: impuestoActivo.value.name,
      rate: parseFloat(impuestoActivo.value.rate.toString()),
      is_active: impuestoActivo.value.is_active,
      description: impuestoActivo.value.description || ''
    }
  }
}

onMounted(() => {
  cargarImpuestoActivo()
})
</script>

<style scoped>
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
.form-textarea {
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.dark .form-input,
.dark .form-textarea {
  background: #475569;
  border-color: #64748b;
  color: #f8fafc;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-checkbox {
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}

.dark .form-checkbox {
  border-color: #6b7280;
  background-color: #374151;
}
</style>
