<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <AppSidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" @logout="handleLogout" />

    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <header class="flex h-16 items-center gap-4 border-b bg-background px-6" data-navbar>
        <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
        <div class="ml-auto flex items-center gap-4">
          <UserMenu @logout="handleLogout" />
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppSidebar from './AppSidebar.vue';
import UserMenu from '@/components/ui/UserMenu.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const sidebarCollapsed = ref(false);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    productos: 'Productos',
    customers: 'Clientes',
    users: 'Usuarios',
    profile: 'Perfil',
    settings: 'Configuraciones',
    sucursales: 'Sucursales',
    categories: 'Categorías'
  };
  return titles[route.name as string] || 'Sistema';
});

</script>
