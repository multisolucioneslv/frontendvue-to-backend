import { ref, computed, watch } from 'vue'

// Estado global de configuraciones
const settings = ref({
  // Configuraciones de fuente
  fontFamily: 'Inter',
  fontSize: 16,
  
  // Configuraciones de color
  primaryColor: '#ffffff',
  secondaryColor: '#f8fafc',
  
  // Configuraciones de vistas/funcionalidades
  views: {
    dashboard: true,
    productos: true,
    customers: true,
    users: true,
    sucursales: true,
    categories: true,
    profile: true,
    settings: true
  },
  
  // Configuraciones de tema
  theme: 'light',
  
  // Configuraciones adicionales
  animations: true,
  sounds: false,
  notifications: true
})

// Fuentes disponibles
const availableFonts = ref([
  { name: 'Inter', value: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
  { name: 'Roboto', value: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' },
  { name: 'Open Sans', value: 'Open Sans', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap' },
  { name: 'Lato', value: 'Lato', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap' },
  { name: 'Montserrat', value: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap' },
  { name: 'Poppins', value: 'Poppins', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro', url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap' },
  { name: 'Nunito', value: 'Nunito', url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap' }
])

// Colores disponibles
const availableColors = ref([
  { 
    id: 'neutral', 
    name: 'Neutro (Blanco)', 
    primary: '#ffffff', 
    secondary: '#f8fafc', 
    isNeutral: true, 
    editable: false 
  },
  { 
    id: 'blue-purple', 
    name: 'Azul Púrpura', 
    primary: '#667eea', 
    secondary: '#764ba2', 
    editable: true 
  },
  { 
    id: 'pink-red', 
    name: 'Rosa Rojo', 
    primary: '#f093fb', 
    secondary: '#f5576c', 
    editable: true 
  },
  { 
    id: 'green-turquoise', 
    name: 'Verde Turquesa', 
    primary: '#43e97b', 
    secondary: '#38f9d7', 
    editable: true 
  }
])

export function useSettings() {
  // Cargar configuraciones guardadas
  const loadSettings = () => {
    const saved = localStorage.getItem('appSettings')
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved)
        settings.value = { ...settings.value, ...parsedSettings }
      } catch (error) {
        console.error('Error loading settings:', error)
        // Si hay error, usar valores por defecto
        settings.value = {
          fontFamily: 'Inter',
          fontSize: 16,
          primaryColor: '#ffffff',
          secondaryColor: '#f8fafc',
          views: {
            dashboard: true,
            productos: true,
            customers: true,
            users: true,
            sucursales: true,
            categories: true,
            profile: true,
            settings: true
          },
          theme: 'light',
          animations: true,
          sounds: false,
          notifications: true
        }
      }
    } else {
      // Si no hay configuraciones guardadas, usar valores por defecto
      settings.value = {
        fontFamily: 'Inter',
        fontSize: 16,
        primaryColor: '#ffffff',
        secondaryColor: '#f8fafc',
        views: {
          dashboard: true,
          productos: true,
          customers: true,
          users: true,
          sucursales: true,
          categories: true,
          profile: true,
          settings: true
        },
        theme: 'light',
        animations: true,
        sounds: false,
        notifications: true
      }
    }
    
    // Aplicar configuraciones
    applySettings()
    
    // Aplicar colores de texto después de un breve delay para asegurar que el DOM esté listo
    setTimeout(() => {
      applyColorsToSidebarAndNavbar(settings.value.primaryColor, settings.value.secondaryColor)
      // Aplicar configuraciones de vistas
      applyAllViewSettings()
    }, 100)
  }

  // Guardar configuraciones
  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
    applySettings()
  }

  // Aplicar configuraciones
  const applySettings = () => {
    const root = document.documentElement
    
    // Aplicar fuente
    const fontFamily = settings.value.fontFamily
    const fontSize = settings.value.fontSize
    
    root.style.setProperty('--font-family', `'${fontFamily}', sans-serif`)
    root.style.setProperty('--font-size', `${fontSize}px`)
    
    // Aplicar colores
    root.style.setProperty('--primary-color', settings.value.primaryColor)
    root.style.setProperty('--secondary-color', settings.value.secondaryColor)
    
    // Aplicar colores específicamente al sidebar y navbar
    applyColorsToSidebarAndNavbar(settings.value.primaryColor, settings.value.secondaryColor)
    
    // Aplicar tema oscuro/claro (independiente de los colores de esquema)
    applyTheme(settings.value.theme)
    
    // Aplicar fuente al body y a todos los elementos
    if (document.body) {
      document.body.style.fontFamily = `'${fontFamily}', sans-serif`
      document.body.style.fontSize = `${fontSize}px`
    }
    
    // Aplicar fuente a todos los elementos con clase específica
    const allElements = document.querySelectorAll('*')
    allElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.fontFamily = `'${fontFamily}', sans-serif`
        element.style.fontSize = `${fontSize}px`
      }
    })
    
    // Cargar fuente desde Google Fonts si es necesario
    loadFont(fontFamily)
    
    console.log('Configuraciones aplicadas:', { fontFamily, fontSize })
  }

  // Aplicar tema oscuro/claro (independiente de colores de esquema)
  const applyTheme = (theme: string) => {
    const root = document.documentElement
    
    // Solo manejar el tema oscuro/claro, sin afectar colores de esquema
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    console.log('Tema aplicado:', theme)
  }

  // Aplicar colores específicamente al sidebar y navbar (independiente del tema)
  const applyColorsToSidebarAndNavbar = (primaryColor: string, secondaryColor: string) => {
    // Aplicar COLOR PRIMARIO al sidebar
    const sidebar = document.querySelector('[data-sidebar]') || 
                   document.querySelector('.sidebar') ||
                   document.querySelector('nav')
    
    if (sidebar && sidebar instanceof HTMLElement) {
      // Solo aplicar colores de esquema, no interferir con tema oscuro/claro
      sidebar.style.setProperty('--scheme-sidebar-bg', primaryColor)
      sidebar.style.setProperty('--scheme-sidebar-text-color', getAppropriateTextColor(primaryColor))
      sidebar.style.backgroundColor = primaryColor
      sidebar.style.color = getAppropriateTextColor(primaryColor)
      
      // Aplicar color sólido (no gradiente) al sidebar
      sidebar.style.background = primaryColor
      
      // Forzar que el sidebar mantenga sus colores de esquema independientemente del tema
      sidebar.style.setProperty('--sidebar-scheme-override', 'true')
    }

    // Aplicar COLOR SECUNDARIO al navbar/header
    const navbar = document.querySelector('header') || 
                   document.querySelector('[data-navbar]') ||
                   document.querySelector('.navbar')
    
    if (navbar && navbar instanceof HTMLElement) {
      // Solo aplicar colores de esquema, no interferir con tema oscuro/claro
      navbar.style.setProperty('--scheme-navbar-bg', secondaryColor)
      navbar.style.setProperty('--scheme-navbar-text-color', getAppropriateTextColor(secondaryColor))
      navbar.style.backgroundColor = secondaryColor
      navbar.style.color = getAppropriateTextColor(secondaryColor)
      
      // Aplicar color sólido (no gradiente) al navbar
      navbar.style.background = secondaryColor
      
      // Forzar que el navbar mantenga sus colores de esquema independientemente del tema
      navbar.style.setProperty('--navbar-scheme-override', 'true')
    }

    // Aplicar estilos específicos a elementos del sidebar
    const sidebarLinks = document.querySelectorAll('[data-sidebar] nav a, [data-sidebar] a, nav a')
    sidebarLinks.forEach(link => {
      const element = link as HTMLElement
      if (element) {
        // Ajustar color de texto según el fondo del sidebar
        element.style.color = getAppropriateTextColor(primaryColor)
        element.style.setProperty('--link-hover-bg', getAppropriateHoverColor(primaryColor))
        
        // Aplicar transición suave
        element.style.transition = 'all 0.3s ease'
      }
    })

    // Aplicar estilos específicos a elementos del navbar
    const navbarElements = document.querySelectorAll('[data-navbar] h1, [data-navbar] .text-xl, header h1, header .text-xl')
    navbarElements.forEach(element => {
      const el = element as HTMLElement
      if (el) {
        el.style.color = getAppropriateTextColor(secondaryColor)
        el.style.transition = 'color 0.3s ease'
      }
    })

    // Aplicar estilos a todos los elementos dentro del sidebar
    const sidebarElements = document.querySelectorAll('[data-sidebar] *')
    sidebarElements.forEach(element => {
      const el = element as HTMLElement
      if (el && !el.style.color) { // Solo si no tiene color específico
        el.style.color = getAppropriateTextColor(primaryColor)
      }
    })

    // Aplicar estilos a todos los elementos dentro del navbar
    const navbarAllElements = document.querySelectorAll('[data-navbar] *')
    navbarAllElements.forEach(element => {
      const el = element as HTMLElement
      if (el && !el.style.color) { // Solo si no tiene color específico
        el.style.color = getAppropriateTextColor(secondaryColor)
      }
    })

    // Aplicar estilos específicos a botones y elementos interactivos del sidebar
    const sidebarButtons = document.querySelectorAll('[data-sidebar] button')
    sidebarButtons.forEach(button => {
      const btn = button as HTMLElement
      if (btn) {
        btn.style.color = getAppropriateTextColor(primaryColor)
        btn.style.transition = 'all 0.3s ease'
      }
    })

    // Aplicar estilos específicos a botones y elementos interactivos del navbar
    const navbarButtons = document.querySelectorAll('[data-navbar] button')
    navbarButtons.forEach(button => {
      const btn = button as HTMLElement
      if (btn) {
        btn.style.color = getAppropriateTextColor(secondaryColor)
        btn.style.transition = 'all 0.3s ease'
      }
    })

    console.log('Colores aplicados al sidebar y navbar:', { primaryColor, secondaryColor })
  }

  // Función auxiliar para determinar si un color es claro
  const isLightBackground = (color: string): boolean => {
    // Convertir hex a RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Calcular luminosidad usando la fórmula estándar WCAG
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5
  }

  // Función para obtener el color de texto apropiado
  const getAppropriateTextColor = (backgroundColor: string): string => {
    return isLightBackground(backgroundColor) ? '#1e293b' : '#ffffff'
  }

  // Función para obtener el color de texto secundario apropiado
  const getAppropriateSecondaryTextColor = (backgroundColor: string): string => {
    return isLightBackground(backgroundColor) ? '#64748b' : '#e2e8f0'
  }

  // Función para obtener el color de hover apropiado
  const getAppropriateHoverColor = (backgroundColor: string): string => {
    return isLightBackground(backgroundColor) ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
  }

  // Cargar fuente desde Google Fonts
  const loadFont = (fontName: string) => {
    const font = availableFonts.value.find(f => f.value === fontName)
    if (font && font.url) {
      // Verificar si la fuente ya está cargada
      const existingLink = document.querySelector(`link[href="${font.url}"]`)
      if (!existingLink) {
        const link = document.createElement('link')
        link.href = font.url
        link.rel = 'stylesheet'
        link.type = 'text/css'
        
        // Agregar evento de carga
        link.onload = () => {
          console.log(`Fuente ${fontName} cargada exitosamente`)
          // Re-aplicar configuraciones después de cargar la fuente
          setTimeout(() => {
            applySettings()
          }, 100)
        }
        
        link.onerror = () => {
          console.error(`Error cargando fuente ${fontName}`)
        }
        
        document.head.appendChild(link)
        console.log(`Cargando fuente: ${fontName}`)
      } else {
        console.log(`Fuente ${fontName} ya está cargada`)
      }
    }
  }

  // Agregar fuente personalizada desde URL
  const addCustomFont = (name: string, url: string) => {
    const newFont = { name, value: name, url }
    availableFonts.value.push(newFont)
    
    // Cargar la fuente inmediatamente
    const link = document.createElement('link')
    link.href = url
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    
    return newFont
  }

  // Actualizar configuración específica
  const updateSetting = (key: string, value: any) => {
    const keys = key.split('.')
    let current = settings.value as any
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    // No guardar automáticamente, solo aplicar cambios
    applySettings()
  }

  // Toggle de vista/funcionalidad
  const toggleView = (viewName: string) => {
    const currentValue = settings.value.views[viewName as keyof typeof settings.value.views]
    settings.value.views[viewName as keyof typeof settings.value.views] = !currentValue
    
    // Aplicar cambios inmediatamente
    applyViewChanges(viewName, !currentValue)
    
    // Guardar configuraciones
    saveSettings()
    
    console.log(`Vista ${viewName} ${!currentValue ? 'activada' : 'desactivada'}`)
  }

  // Aplicar todas las configuraciones de vistas
  const applyAllViewSettings = () => {
    Object.entries(settings.value.views).forEach(([viewName, isEnabled]) => {
      applyViewChanges(viewName, isEnabled)
    })
  }

  // Aplicar cambios de vista inmediatamente
  const applyViewChanges = (viewName: string, isEnabled: boolean) => {
    // Ocultar/mostrar elementos del sidebar
    const sidebarLinks = document.querySelectorAll(`[data-view="${viewName}"]`)
    sidebarLinks.forEach(link => {
      const element = link as HTMLElement
      if (element) {
        element.style.display = isEnabled ? 'flex' : 'none'
      }
    })

    // Si la vista actual está desactivada, redirigir al dashboard
    const currentRoute = window.location.pathname
    const viewRoutes: { [key: string]: string } = {
      dashboard: '/app/dashboard',
      productos: '/app/productos',
      customers: '/app/customers',
      users: '/app/users',
      sucursales: '/app/sucursales',
      categories: '/app/categories',
      profile: '/app/profile',
      settings: '/app/settings'
    }

    if (!isEnabled && currentRoute === viewRoutes[viewName]) {
      // Redirigir al dashboard si la vista actual se desactiva
      window.location.href = '/app/dashboard'
    }
  }

  // Guardar configuraciones de fuentes
  const saveFontSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
    applySettings()
  }

  // Guardar configuraciones de colores
  const saveColorSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
    applySettings()
  }

  // Guardar configuraciones de vistas
  const saveViewSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
    applySettings()
  }

  // Guardar configuraciones de experiencia
  const saveExperienceSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
    applySettings()
  }

  // Resetear configuraciones a valores por defecto
  const resetSettings = () => {
    settings.value = {
      fontFamily: 'Inter',
      fontSize: 16,
      primaryColor: '#ffffff',
      secondaryColor: '#f8fafc',
      views: {
        dashboard: true,
        productos: true,
        customers: true,
        users: true,
        sucursales: true,
        categories: true,
        profile: true,
        settings: true
      },
      theme: 'light',
      animations: true,
      sounds: false,
      notifications: true
    }
    saveSettings()
    
    // Aplicar configuraciones inmediatamente
    applySettings()
    
    // Aplicar colores de texto
    setTimeout(() => {
      applyColorsToSidebarAndNavbar(settings.value.primaryColor, settings.value.secondaryColor)
    }, 100)
  }

  // Editar color preconfigurado
  const updatePredefinedColor = (colorId: string, primaryColor: string, secondaryColor: string) => {
    const colorIndex = availableColors.value.findIndex(color => color.id === colorId)
    if (colorIndex !== -1 && availableColors.value[colorIndex].editable) {
      availableColors.value[colorIndex].primary = primaryColor
      availableColors.value[colorIndex].secondary = secondaryColor
      console.log(`Color ${colorId} actualizado:`, { primaryColor, secondaryColor })
    }
  }

  // Obtener color por ID
  const getColorById = (colorId: string) => {
    return availableColors.value.find(color => color.id === colorId)
  }

  // Computed para verificar si una vista está habilitada
  const isViewEnabled = computed(() => {
    return (viewName: string) => settings.value.views[viewName as keyof typeof settings.value.views]
  })

  // Función para aplicar valores por defecto si es la primera vez
  const applyDefaultsIfFirstTime = () => {
    const hasSettings = localStorage.getItem('appSettings')
    const hasTheme = localStorage.getItem('theme')
    
    // Si no hay configuraciones previas, aplicar valores por defecto
    if (!hasSettings) {
      console.log('Primera vez - aplicando valores por defecto')
      settings.value = {
        fontFamily: 'Inter',
        fontSize: 16,
        primaryColor: '#ffffff',
        secondaryColor: '#f8fafc',
        views: {
          dashboard: true,
          productos: true,
          customers: true,
          users: true,
          sucursales: true,
          categories: true,
          profile: true,
          settings: true
        },
        theme: 'light',
        animations: true,
        sounds: false,
        notifications: true
      }
      saveSettings()
    }
    
    // Si no hay tema guardado, usar tema claro por defecto
    if (!hasTheme) {
      localStorage.setItem('theme', 'light')
    }
  }

  // Watcher para aplicar cambios automáticamente
  watch(settings, () => {
    applySettings()
  }, { deep: true })

  return {
    settings: computed(() => settings.value),
    availableFonts: computed(() => availableFonts.value),
    availableColors: computed(() => availableColors.value),
    loadSettings,
    saveSettings,
    saveFontSettings,
    saveColorSettings,
    saveViewSettings,
    saveExperienceSettings,
    applySettings,
    applyTheme,
    applyDefaultsIfFirstTime,
    loadFont,
    addCustomFont,
    updateSetting,
    updatePredefinedColor,
    getColorById,
    isLightBackground,
    getAppropriateTextColor,
    getAppropriateSecondaryTextColor,
    getAppropriateHoverColor,
    toggleView,
    applyViewChanges,
    applyAllViewSettings,
    resetSettings,
    isViewEnabled
  }
}
