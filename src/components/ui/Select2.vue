<template>
  <div class="select2-wrapper">
    <select
      ref="selectElement"
      :id="id"
      :name="name"
      :multiple="multiple"
      :disabled="disabled"
      :required="required"
      class="form-select"
      @change="handleChange"
    >
      <option v-if="placeholder && !multiple" value="">{{ placeholder }}</option>
      <slot></slot>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSelect2 } from '@/composables/useSelect2'

interface Props {
  id?: string
  name?: string
  modelValue?: any
  options?: Array<{ value: any; text: string; [key: string]: any }>
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
  required?: boolean
  searchable?: boolean
  clearable?: boolean
  allowCustom?: boolean
  ajax?: {
    url: string
    method?: string
    dataType?: string
    delay?: number
    data?: (params: any) => any
    processResults?: (data: any) => any
  }
}

interface Emits {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any, element: HTMLElement): void
  (e: 'select', data: any): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecciona una opción...',
  multiple: false,
  disabled: false,
  required: false,
  searchable: true,
  clearable: true,
  allowCustom: false
})

const emit = defineEmits<Emits>()

const { selectElement, select2Instance, initializeSelect2, destroySelect2 } = useSelect2()

// Inicializar Select2 cuando el componente se monta
onMounted(() => {
  
  const select2Options: any = {
    placeholder: props.placeholder,
    allowClear: props.clearable,
    disabled: props.disabled,
    multiple: props.multiple,
    language: {
      noResults: () => 'No se encontraron resultados',
      searching: () => 'Buscando...',
      inputTooShort: () => 'Escribe al menos 1 carácter'
    }
  }

  // Configurar AJAX si se proporciona
  if (props.ajax) {
    select2Options.ajax = {
      url: props.ajax.url,
      method: props.ajax.method || 'GET',
      dataType: props.ajax.dataType || 'json',
      delay: props.ajax.delay || 250,
      data: props.ajax.data || ((params: any) => ({
        search: params.term,
        page: params.page || 1
      })),
      processResults: props.ajax.processResults || ((data: any) => ({
        results: data.data || data,
        pagination: {
          more: data.more || false
        }
      }))
    }
  } else if (props.options && props.options.length > 0) {
    // Usar opciones estáticas
    const options = props.options.map(option => ({
      id: option.value,
      ...option
    }))
    
    // Limpiar opciones existentes y agregar las nuevas
    window.$(selectElement.value).empty()
    if (props.placeholder && !props.multiple) {
      window.$(selectElement.value).append(new Option(props.placeholder, '', false, false))
    }
    window.$(selectElement.value).append(options.map(opt => new Option(opt.text, opt.id, false, false)))
  }

  // Permitir búsqueda personalizada si está habilitado
  if (props.allowCustom) {
    select2Options.tags = true
    select2Options.tokenSeparators = [',']
  }

  // Inicializar Select2
  const instance = initializeSelect2(select2Options)

  // Configurar eventos
  if (instance) {
    instance.on('change', (e: any) => {
      const value = window.$(e.target).val()
      emit('update:modelValue', value)
      emit('change', value, e.target)
    })

    instance.on('select2:select', (e: any) => {
      emit('select', e.params.data)
    })

    instance.on('select2:clear', () => {
      emit('clear')
    })

    // Establecer valor inicial
    if (props.modelValue !== undefined) {
      window.$(selectElement.value).val(props.modelValue).trigger('change')
    }
  }
})

// Limpiar Select2 cuando el componente se desmonta
onUnmounted(() => {
  destroySelect2()
})

// Observar cambios en el valor del modelo
watch(() => props.modelValue, (newValue) => {
  if (select2Instance.value && newValue !== undefined) {
    window.$(selectElement.value).val(newValue).trigger('change')
  }
}, { immediate: true })

// Observar cambios en las opciones
watch(() => props.options, (newOptions) => {
  if (select2Instance.value && newOptions) {
    const options = newOptions.map(option => ({
      id: option.value,
      ...option
    }))
    
    window.$(selectElement.value).empty()
    if (props.placeholder && !props.multiple) {
      window.$(selectElement.value).append(new Option(props.placeholder, '', false, false))
    }
    window.$(selectElement.value).append(options.map(opt => new Option(opt.text, opt.id, false, false)))
    window.$(selectElement.value).trigger('change')
  }
}, { deep: true })

// Observar cambios en disabled
watch(() => props.disabled, (newDisabled) => {
  if (select2Instance.value) {
    window.$(selectElement.value).prop('disabled', newDisabled)
    select2Instance.value.trigger('change')
  }
})

const handleChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  const value = props.multiple ? 
    Array.from(target.selectedOptions).map(option => option.value) : 
    target.value
  emit('update:modelValue', value)
  emit('change', value, target)
}

// Exponer métodos para uso externo
defineExpose({
  setValue: (value: any) => {
    if (select2Instance.value) {
      window.$(selectElement.value).val(value).trigger('change')
    }
  },
  clear: () => {
    if (select2Instance.value) {
      window.$(selectElement.value).val(null).trigger('change')
    }
  },
  destroy: destroySelect2
})
</script>

<style scoped>
.select2-wrapper {
  width: 100%;
}

/* Estilos para Select2 */
:deep(.select2-container) {
  width: 100% !important;
}

:deep(.select2-container .select2-selection--single) {
  height: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.625rem;
  font-size: 0.875rem;
}

:deep(.select2-container .select2-selection--multiple) {
  min-height: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

:deep(.select2-container .select2-selection--single .select2-selection__rendered) {
  padding-left: 0;
  padding-right: 20px;
  line-height: 28px;
}

:deep(.select2-container .select2-selection--single .select2-selection__placeholder) {
  color: #9ca3af;
}

:deep(.select2-container .select2-selection--single .select2-selection__arrow) {
  height: 40px;
  right: 8px;
}

:deep(.select2-dropdown) {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.select2-results__option) {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

:deep(.select2-results__option--highlighted) {
  background-color: #3b82f6;
  color: white;
}

:deep(.select2-search--dropdown .select2-search__field) {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 0.875rem;
}

/* Modo oscuro */
.dark :deep(.select2-container .select2-selection--single) {
  background-color: #475569;
  border-color: #64748b;
  color: #f8fafc;
}

.dark :deep(.select2-container .select2-selection--multiple) {
  background-color: #475569;
  border-color: #64748b;
}

.dark :deep(.select2-dropdown) {
  background-color: #475569;
  border-color: #64748b;
}

.dark :deep(.select2-results__option) {
  background-color: #475569;
  color: #f8fafc;
}

.dark :deep(.select2-search--dropdown .select2-search__field) {
  background-color: #475569;
  border-color: #64748b;
  color: #f8fafc;
}

/* Estados de enfoque */
:deep(.select2-container--focus .select2-selection--single) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.select2-container--focus .select2-selection--multiple) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
