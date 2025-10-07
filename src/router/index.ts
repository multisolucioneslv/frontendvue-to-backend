/*
 * ============================================================================
 * ROUTER CONFIGURATION - SISTEMA MULTI-SERVICIO
 * ============================================================================
 * 
 * ⚠️  IMPORTANTE: SETUP INICIAL TEMPORALMENTE DESHABILITADO
 * 
 * Este archivo ha sido modificado para deshabilitar temporalmente el sistema
 * de configuración inicial. Los cambios están marcados con comentarios
 * que indican cómo revertir las modificaciones.
 * 
 * 🔧 CAMBIOS REALIZADOS:
 * 1. Ruta principal cambiada de '/initial-setup' a '/login'
 * 2. Middleware de setup comentado completamente
 * 3. Meta 'requiresSetupCompleted' removida de rutas /app y /admin-setup
 * 4. Ruta /initial-setup comentada
 * 
 * 📝 PARA REHABILITAR EL SETUP INICIAL:
 * 1. Buscar comentarios "TEMPORALMENTE DESHABILITADO"
 * 2. Descomentar las líneas marcadas
 * 3. Agregar 'requiresSetupCompleted: true' de vuelta a las rutas
 * 4. Cambiar redirect principal de '/login' a '/initial-setup'
 * 
 * 📋 ARCHIVOS RELACIONADOS QUE TAMBIÉN FUERON MODIFICADOS:
 * - frontendvue/src/views/Login.vue (sección de setup comentada)
 * - Ver archivo: SETUP_DISABLED_GUIDE.md para documentación completa
 * 
 * ============================================================================
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// TEMPORALMENTE DESHABILITADO: Middleware de setup inicial
// import { useSetupMiddleware } from '@/middleware/setup'
// TEMPORALMENTE DESHABILITADO: Componente de configuración inicial
// import InitialSetupFlow from '../views/admin/setup/InitialSetupFlow.vue'
import AdminPanel from '../views/admin/panels/AdminPanel.vue'
import SuperAdminPanel from '../views/admin/panels/SuperAdminPanel.vue'
import Login from '../views/Login.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Productos from '../views/Productos.vue'
import Customers from '../views/Customers.vue'
import Sucursales from '../views/Sucursales.vue'
import Categories from '../views/Categories.vue'
import Users from '../views/Users.vue'
import Cotizaciones from '../views/Cotizaciones.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'
import Documentation from '../views/Documentation.vue'
import GeneralSettings from '../views/settings/GeneralSettings.vue'
import AppearanceSettings from '../views/settings/AppearanceSettings.vue'
import CompanyInfoSettings from '../views/settings/CompanyInfoSettings.vue'
import BrandingSettings from '../views/settings/BrandingSettings.vue'
import ViewsSettings from '../views/settings/ViewsSettings.vue'
import TimezoneSettings from '../views/settings/TimezoneSettings.vue'
import SystemTypeSettings from '../views/settings/SystemTypeSettings.vue'
import TaxSettings from '../views/settings/TaxSettings.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import SystemTypes from '../views/admin/SystemTypes.vue'

const routes: Array<RouteRecordRaw> = [
  {
    // ⚠️  MODIFICADO: Cambiado de '/initial-setup' a '/login'
    // Para revertir: cambiar redirect de '/login' a '/initial-setup'
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/clear-sessions',
    name: 'clear-sessions',
    redirect: '/clear-sessions.html'
  },
  // ⚠️  TEMPORALMENTE DESHABILITADO: Ruta de configuración inicial
  // Para revertir: descomentar estas líneas y comentar la redirección a /login arriba
  // {
  //   path: '/initial-setup',
  //   name: 'initial-setup',
  //   component: InitialSetupFlow,
  //   meta: { requiresSetupNotCompleted: true, requiresSuperAdmin: true }
  // },
  {
    // ⚠️  MODIFICADO: Removido 'requiresSetupCompleted: true'
    // Para revertir: cambiar meta de { requiresSuperAdmin: true } a { requiresSetupCompleted: true, requiresSuperAdmin: true }
    path: '/admin-setup',
    name: 'admin-setup',
    component: SuperAdminPanel,
    meta: { requiresSuperAdmin: true }
  },
  {
    path: '/admin-panel',
    name: 'admin-panel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    // ⚠️  MODIFICADO: Removido 'requiresSetupCompleted: true'
    // Para revertir: cambiar meta de { requiresAuth: true } a { requiresAuth: true, requiresSetupCompleted: true }
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { viewKey: 'dashboard' }
      },
      {
        path: 'productos',
        name: 'productos',
        component: Productos,
        meta: { viewKey: 'productos' }
      },
      {
        path: 'customers',
        name: 'customers',
        component: Customers,
        meta: { viewKey: 'customers' }
      },
      {
        path: 'sucursales',
        name: 'sucursales',
        component: Sucursales,
        meta: { viewKey: 'sucursales' }
      },
      {
        path: 'categories',
        name: 'categories',
        component: Categories,
        meta: { viewKey: 'categories' }
      },
      {
        path: 'users',
        name: 'users',
        component: Users,
        meta: { viewKey: 'users' }
      },
      {
        path: 'cotizaciones',
        name: 'cotizaciones',
        component: Cotizaciones,
        meta: { viewKey: 'cotizaciones' }
      },
      {
        path: 'cotizaciones/create',
        name: 'create-cotizacion',
        component: () => import('../views/CreateCotizacion.vue'),
        meta: { viewKey: 'cotizaciones' }
      },
      {
        path: 'cotizaciones/:id/edit',
        name: 'edit-cotizacion',
        component: () => import('../views/EditCotizacion.vue'),
        meta: { viewKey: 'cotizaciones' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
        meta: { viewKey: 'profile' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: Settings,
        meta: { viewKey: 'settings' }
      },
      {
        path: 'settings/general',
        name: 'settings-general',
        component: GeneralSettings,
        meta: { viewKey: 'settings' }
      },
      {
        path: 'settings/appearance',
        name: 'settings-appearance',
        component: AppearanceSettings,
        meta: { viewKey: 'settings' }
      },
      {
        path: 'settings/company',
        name: 'settings-company',
        component: CompanyInfoSettings,
        meta: { viewKey: 'settings' }
      },
      {
        path: 'settings/branding',
        name: 'settings-branding',
        component: BrandingSettings,
        meta: { viewKey: 'settings' }
      },
      {
        path: 'settings/views',
        name: 'settings-views',
        component: ViewsSettings,
        meta: { viewKey: 'settings' }
      },
      {
        path: 'settings/timezone',
        name: 'settings-timezone',
        component: TimezoneSettings,
        meta: { viewKey: 'settings' }
      },
      {
        path: 'settings/system-type',
        name: 'settings-system-type',
        component: SystemTypeSettings,
        meta: { viewKey: 'settings' }
      },
      {
        path: 'settings/tax',
        name: 'settings-tax',
        component: TaxSettings,
        meta: { viewKey: 'settings' }
      },
      {
        path: 'documentation',
        name: 'documentation',
        component: Documentation,
        meta: { viewKey: 'documentation' }
      },
      // Rutas de administración
      {
        path: 'admin',
        name: 'admin',
        component: AdminDashboard,
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/system-types',
        name: 'admin-system-types',
        component: SystemTypes,
        meta: { requiresAdmin: true }
      }
    ]
  },
  {
    path: '/dashboard',
    redirect: '/app/dashboard'
  },
  {
    path: '/productos',
    redirect: '/app/productos'
  },
  {
    path: '/customers',
    redirect: '/app/customers'
  },
  {
    path: '/sucursales',
    redirect: '/app/sucursales'
  },
  {
    path: '/categories',
    redirect: '/app/categories'
  },
  {
    path: '/users',
    redirect: '/app/users'
  },
  {
    path: '/profile',
    redirect: '/app/profile'
  },
  {
    path: '/settings',
    redirect: '/app/settings'
  },
  {
    path: '/documentation',
    redirect: '/app/documentation'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  console.log('🛣️ Router Guard - Navegando a:', to.path)
  console.log('🛣️ Router Guard - Desde:', from.path)
  console.log('🛣️ Router Guard - Meta:', to.meta)
  
  const authStore = useAuthStore()

  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Excepción: permitir acceso al admin-setup sin autenticación si el setup está completado
    if (to.path === '/admin-setup') {
      console.log('🔧 Acceso especial al admin-setup sin autenticación permitido')
      // Continuar sin redirección
    } else {
      console.log('🔒 Requiere auth pero no está autenticado, redirigiendo a /login')
      next('/login')
      return
    }
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('👤 Requiere guest pero está autenticado, redirigiendo a dashboard')
    next('/app/dashboard')
    return
  }
  
  // Verificar permisos de SuperAdmin
  if (to.meta.requiresSuperAdmin) {
    // Primero verificar si está autenticado
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }
    
    // Si no tiene usuario cargado, intentar cargarlo
    if (!authStore.user) {
      await authStore.loadUser()
    }
    
    // Verificar si es SuperAdmin
    const user = authStore.user
    if (!user || !user.roles?.includes('SuperAdmin')) {
      console.log('🚫 Acceso denegado: Se requiere rol SuperAdmin')
      next('/app/dashboard')
      return
    }
  }
  
  // Verificar permisos de administrador
  if (to.meta.requiresAdmin) {
    // Primero verificar si está autenticado
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }
    
    // Si no tiene usuario cargado, intentar cargarlo
    if (!authStore.user) {
      await authStore.loadUser()
    }
    
    // Verificar si es administrador
    const user = authStore.user
    if (!user || (!user.roles?.includes('Admin') && !user.roles?.includes('SuperAdmin'))) {
      console.log('🚫 Acceso denegado: Se requiere rol Admin o SuperAdmin')
      next('/app/dashboard')
      return
    }
  }

  // ⚠️  TEMPORALMENTE DESHABILITADO: Verificar configuración inicial
  // Para revertir: descomentar las siguientes líneas y comentar el return next() al final
  // const { requireSetupCompleted, requireSetupNotCompleted } = useSetupMiddleware()
  
  // ⚠️  TEMPORALMENTE DESHABILITADO: Verificar setup inicial para rutas que lo requieren
  // if (to.meta.requiresSetupCompleted) {
  //   await requireSetupCompleted(to, from, next)
  //   return
  // }

  // ⚠️  TEMPORALMENTE DESHABILITADO: Verificar que el setup NO esté completado para rutas de configuración inicial
  // if (to.meta.requiresSetupNotCompleted) {
  //   await requireSetupNotCompleted(to, from, next)
  //   return
  // }
  
  // Verificar si la vista está habilitada (solo para rutas con viewKey)
  if (to.meta.viewKey && typeof window !== 'undefined') {
    try {
      const settings = localStorage.getItem('appSettings')
      if (settings) {
        const parsedSettings = JSON.parse(settings)
        const isViewEnabled = parsedSettings.views?.[to.meta.viewKey as string]
        
        if (isViewEnabled === false) {
          // Vista deshabilitada, redirigir al dashboard
          console.log(`Vista ${to.meta.viewKey} está deshabilitada, redirigiendo al dashboard`)
          next('/app/dashboard')
          return
        }
      }
    } catch (error) {
      console.error('Error verificando configuración de vista:', error)
    }
  }
  
  next()
})

export default router