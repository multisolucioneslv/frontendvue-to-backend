import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// Declarar jQuery globalmente
declare const $: any

export function useSelect2() {
  const selectElement = ref<HTMLElement | null>(null)
  const select2Instance = ref<any>(null)

  const initializeSelect2 = (options: any = {}) => {
    if (!selectElement.value) return

    // Configuración por defecto
    const defaultOptions = {
      placeholder: 'Selecciona una opción...',
      allowClear: true,
      language: {
        noResults: () => 'No se encontraron resultados',
        searching: () => 'Buscando...',
        inputTooShort: () => 'Escribe al menos 1 carácter'
      },
      ...options
    }

    // Inicializar Select2
    select2Instance.value = $(selectElement.value).select2(defaultOptions)

    return select2Instance.value
  }

  const destroySelect2 = () => {
    if (select2Instance.value) {
      select2Instance.value.select2('destroy')
      select2Instance.value = null
    }
  }

  const updateSelect2 = (newOptions: any = {}) => {
    if (select2Instance.value) {
      select2Instance.value.select2('destroy')
      initializeSelect2(newOptions)
    }
  }

  const setValue = (value: any) => {
    if (select2Instance.value) {
      select2Instance.value.val(value).trigger('change')
    }
  }

  const getValue = () => {
    return select2Instance.value ? select2Instance.value.val() : null
  }

  const clear = () => {
    if (select2Instance.value) {
      select2Instance.value.val(null).trigger('change')
    }
  }

  // Cleanup automático
  onUnmounted(() => {
    destroySelect2()
  })

  return {
    selectElement,
    select2Instance,
    initializeSelect2,
    destroySelect2,
    updateSelect2,
    setValue,
    getValue,
    clear
  }
}
