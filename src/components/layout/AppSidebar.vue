<template>
  <div :class="cn('flex h-screen flex-col border-r bg-background', collapsed && 'w-16', !collapsed && 'w-64')" class="transition-all duration-300" data-sidebar>
    <!-- Header -->
    <div class="flex h-16 items-center border-b px-4 justify-between">
      <h2 v-if="!collapsed" class="text-lg font-semibold">Sistema</h2>
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
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  Building2,
  FolderOpen
} from 'lucide-vue-next';

defineProps<{
  collapsed: boolean;
}>();

defineEmits<{
  (e: 'toggle'): void;
  (e: 'logout'): void;
}>();

const menuItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, viewKey: 'dashboard' },
  { to: '/app/productos', label: 'Productos', icon: Package, viewKey: 'productos' },
  { to: '/app/customers', label: 'Clientes', icon: Users, viewKey: 'customers' },
  { to: '/app/users', label: 'Usuarios', icon: UserCheck, viewKey: 'users' },
  { to: '/app/sucursales', label: 'Sucursales', icon: Building2, viewKey: 'sucursales' },
  { to: '/app/categories', label: 'Categorías', icon: FolderOpen, viewKey: 'categories' },
];
</script>
