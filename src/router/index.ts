import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '../views/Login.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Productos from '../views/Productos.vue'
import Customers from '../views/Customers.vue'
import Sucursales from '../views/Sucursales.vue'
import Categories from '../views/Categories.vue'
import Users from '../views/Users.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
    return
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/app/dashboard')
    return
  }
  
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
