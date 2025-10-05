import { ref, computed } from 'vue'
import { API_CONFIG } from '@/config/api'

// Estado global para fecha y hora
const currentDateTime = ref<any>(null)
const timezone = ref<string>('America/Los_Angeles')

// Composable para manejar fecha y hora
export function useDateTime() {
  
  /**
   * Obtiene la fecha y hora actual del servidor
   */
  const fetchCurrentDateTime = async () => {
    try {
      const response = await fetch(`${API_CONFIG.URL_BASE}/datetime/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        currentDateTime.value = data.data
        timezone.value = data.data.timezone
        return data.data
      } else {
        throw new Error(data.message || 'Error al obtener fecha y hora')
      }
    } catch (error) {
      console.error('Error obteniendo fecha y hora:', error)
      // Fallback a fecha local si hay error
      const now = new Date()
      currentDateTime.value = {
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5),
        datetime: now.toISOString(),
        formatted_date: now.toLocaleDateString('es-ES'),
        formatted_datetime: now.toLocaleString('es-ES'),
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString().padStart(2, '0'),
        day: now.getDate().toString().padStart(2, '0'),
        timezone: 'America/Los_Angeles',
        timestamp: now.getTime()
      }
      return currentDateTime.value
    }
  }

  /**
   * Crea un reporte usando el backend
   */
  const createReport = async (reportName: string, content: string, metadata: any = {}) => {
    try {
      const response = await fetch(`${API_CONFIG.URL_BASE}/reports/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: reportName,
          content: content,
          metadata: metadata
        })
      })
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        throw new Error(data.message || 'Error al crear reporte')
      }
    } catch (error) {
      console.error('Error creando reporte:', error)
      throw error
    }
  }

  /**
   * Genera la estructura de carpetas para reportes en el frontend
   */
  const generateReportPath = (basePath = 'REPORTES') => {
    const dateInfo = currentDateTime.value || {
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      day: new Date().getDate().toString().padStart(2, '0')
    }
    
    return `${basePath}/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}`
  }

  /**
   * Genera un nombre de archivo para reporte con fecha y hora
   */
  const generateReportFilename = (reportName: string) => {
    const dateInfo = currentDateTime.value || {
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      day: new Date().getDate().toString().padStart(2, '0'),
      time: new Date().toTimeString().split(' ')[0].substring(0, 5).replace(':', '-')
    }
    
    const sanitizedName = reportName.toUpperCase().replace(/[^a-zA-Z0-9_]/g, '_')
    
    return `${dateInfo.year}-${dateInfo.month}-${dateInfo.day}_${dateInfo.time}_${sanitizedName}.md`
  }

  /**
   * Formatea la fecha para mostrar en español
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Formatea la fecha y hora para mostrar en español
   */
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Computed properties
  const currentDate = computed(() => currentDateTime.value?.date || '')
  const currentTime = computed(() => currentDateTime.value?.time || '')
  const currentFormattedDate = computed(() => currentDateTime.value?.formatted_date || '')
  const currentFormattedDateTime = computed(() => currentDateTime.value?.formatted_datetime || '')
  const currentYear = computed(() => currentDateTime.value?.year || '')
  const currentMonth = computed(() => currentDateTime.value?.month || '')
  const currentDay = computed(() => currentDateTime.value?.day || '')
  const currentTimezone = computed(() => currentDateTime.value?.timezone || 'America/Los_Angeles')

  return {
    // Estado
    currentDateTime: computed(() => currentDateTime.value),
    timezone: computed(() => timezone.value),
    
    // Computed properties
    currentDate,
    currentTime,
    currentFormattedDate,
    currentFormattedDateTime,
    currentYear,
    currentMonth,
    currentDay,
    currentTimezone,
    
    // Métodos
    fetchCurrentDateTime,
    createReport,
    generateReportPath,
    generateReportFilename,
    formatDate,
    formatDateTime
  }
}
