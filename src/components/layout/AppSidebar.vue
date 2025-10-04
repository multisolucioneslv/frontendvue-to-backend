<template>
  <div :class="cn('flex h-screen flex-col border-r bg-background', collapsed && 'w-16', !collapsed && 'w-64')" class="transition-all duration-300" data-sidebar>
    <!-- Header -->
    <div class="flex h-16 items-center border-b px-4 justify-between">
             <div class="flex flex-col items-center gap-2">
               <!-- Logo de la empresa -->
               <div v-if="companyLogo" class="logo-container">
                 <img 
                   :src="companyLogo" 
                   alt="Logo de la empresa" 
                   class="company-logo"
                 />
               </div>
               <!-- Fallback cuando no hay logo - mostrar nombre y slogan -->
               <div v-else class="logo-placeholder">
                 <Building2 class="h-8 w-8 text-primary" />
               </div>
               <!-- Título del sistema - solo cuando NO hay logo -->
               <h2 v-if="!collapsed && !companyLogo" class="text-lg font-semibold">{{ companyName }}</h2>
               <!-- Slogan de la empresa - solo cuando NO hay logo -->
               <p v-if="!collapsed && !companyLogo && companySlogan" class="text-xs text-gray-500 italic">{{ companySlogan }}</p>
             </div>
      <button
        @click="$emit('toggle')"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" x2="21" y1="6" y2="6" />
          <line x1="3" x2="21" y1="12" y2="12" />
          <line x1="3" x2="21" y1="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-auto p-2">
      <div class="space-y-1">
        <!-- Menu items principales -->
        <router-link
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :data-view="item.viewKey"
          :class="cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
            collapsed && 'justify-center'
          )"
          active-class="bg-accent text-accent-foreground"
        >
          <component :is="item.icon" class="h-5 w-5" />
          <span v-if="!collapsed">{{ item.label }}</span>
        </router-link>

        <!-- Submenú de Configuraciones -->
        <div v-if="!collapsed" class="mt-2">
          <SubMenu
            title="Configuraciones"
            :icon="Settings"
            :items="settingsSubMenuItems"
            :collapsible="true"
            :default-collapsed="true"
          />
        </div>

        <!-- Item de Documentación -->
        <router-link
          :to="documentationItem.to"
          :data-view="documentationItem.viewKey"
          :class="cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
            collapsed && 'justify-center'
          )"
          active-class="bg-accent text-accent-foreground"
        >
          <component :is="documentationItem.icon" class="h-5 w-5" />
          <span v-if="!collapsed">{{ documentationItem.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Footer -->
    <div class="border-t p-2">
      <button
        @click="$emit('logout')"
        :class="cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-destructive hover:text-destructive-foreground',
          collapsed && 'justify-center'
        )"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
        <span v-if="!collapsed">Cerrar Sesión</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  Building2,
  FolderOpen,
  Settings,
  Type,
  Palette,
  Eye,
  ImageIcon,
  HelpCircle,
  ChevronDown
} from 'lucide-vue-next';
import SubMenu from '@/components/ui/SubMenu.vue';
import { useSettings } from '@/composables/useSettings'

defineProps<{
  collapsed: boolean;
}>();

defineEmits<{
  (e: 'toggle'): void;
  (e: 'logout'): void;
}>();

// Obtener el logo y nombre de la empresa desde las configuraciones
const { settings } = useSettings()
const companyLogo = computed(() => settings.value.branding?.logo || '')
const companyName = computed(() => settings.value.branding?.companyName || 'Sistema')
const companySlogan = computed(() => settings.value.branding?.companySlogan || '')

const menuItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, viewKey: 'dashboard' },
  { to: '/app/productos', label: 'Productos', icon: Package, viewKey: 'productos' },
  { to: '/app/customers', label: 'Clientes', icon: Users, viewKey: 'customers' },
  { to: '/app/sucursales', label: 'Sucursales', icon: Building2, viewKey: 'sucursales' },
  { to: '/app/categories', label: 'Categorías', icon: FolderOpen, viewKey: 'categories' },
  { to: '/app/users', label: 'Usuarios', icon: UserCheck, viewKey: 'users' },
];

const settingsSubMenuItems = [
  { to: '/app/settings/general', label: 'General', icon: Settings },
  { to: '/app/settings/appearance', label: 'Apariencia', icon: Palette },
  { to: '/app/settings/company', label: 'Empresa', icon: Building2 },
  { to: '/app/settings/branding', label: 'Branding', icon: ImageIcon },
  { to: '/app/settings/views', label: 'Vistas', icon: Eye },
];

const documentationItem = {
  to: '/app/documentation',
  label: 'Documentación',
  icon: HelpCircle,
  viewKey: 'documentation'
};
</script>

<style scoped>
/* Logo de la empresa */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.company-logo {
  height: 2.5rem;
  width: auto;
  max-width: 8rem;
  object-fit: contain;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.company-logo:hover {
  transform: scale(1.05);
}

/* Placeholder cuando no hay logo */
.logo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #f8fafc;
  border-radius: 0.375rem;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.logo-placeholder:hover {
  background: #e2e8f0;
  transform: scale(1.05);
}

/* Responsive para sidebar colapsado */
[data-sidebar].w-16 .logo-container {
  width: 2rem;
  height: 2rem;
}

[data-sidebar].w-16 .company-logo {
  height: 2rem;
  max-width: 2rem;
}

[data-sidebar].w-16 .logo-placeholder {
  width: 2rem;
  height: 2rem;
}

/* Dark mode */
.dark .logo-placeholder {
  background: #334155;
  border-color: #475569;
}

.dark .logo-placeholder:hover {
  background: #475569;
}

/* Animaciones suaves */
.logo-container,
.logo-placeholder {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Asegurar que el logo se mantenga centrado */
.flex.flex-col.items-center.gap-2 {
  min-width: 0;
  flex: 1;
}

/* Ajustes para el título cuando hay logo */
.flex.flex-col.items-center.gap-2 h2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.flex.flex-col.items-center.gap-2 p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  max-width: 100%;
}
</style>
