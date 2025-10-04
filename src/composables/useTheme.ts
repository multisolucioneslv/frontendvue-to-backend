import { ref, computed } from 'vue'

// Estado global del tema
const isDark = ref(false)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const setTheme = (dark: boolean) => {
    isDark.value = dark
    applyTheme()
  }

  const applyTheme = () => {
    const html = document.documentElement
    
    // Solo aplicar tema oscuro/claro, sin afectar colores de esquema
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    // Guardar tema en localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    
    // No aplicar colores de esquema aquí - eso se maneja en useSettings
    console.log('Tema oscuro/claro aplicado:', isDark.value ? 'dark' : 'light')
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    
    // Priorizar tema guardado, pero si no hay ninguno, usar tema claro por defecto
    if (savedTheme === 'dark') {
      isDark.value = true
    } else {
      // Por defecto, usar tema claro (no seguir preferencias del sistema)
      isDark.value = false
    }
    applyTheme()
  }

  // Inicializar tema al cargar
  if (typeof window !== 'undefined') {
    initTheme()
  }

  return {
    isDark: computed(() => isDark.value),
    toggleTheme,
    setTheme,
    applyTheme,
    initTheme
  }
}
