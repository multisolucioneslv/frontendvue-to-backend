<template>
  <div class="submenu-container">
    <div class="submenu-header">
      <div class="submenu-icon">
        <component :is="icon" class="h-5 w-5" />
      </div>
      <h3 class="submenu-title">{{ title }}</h3>
      <button
        v-if="collapsible"
        @click="toggleCollapsed"
        class="submenu-toggle"
        :class="{ collapsed: isCollapsed }"
      >
        <ChevronDown class="h-4 w-4" />
      </button>
    </div>
    
    <div 
      v-show="!isCollapsed || !collapsible" 
      class="submenu-content"
      :class="{ 'collapsed': isCollapsed && collapsible }"
    >
      <div class="submenu-items">
        <router-link
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="submenu-item"
          :class="{ active: $route.path === item.to }"
        >
          <component :is="item.icon" class="h-4 w-4" />
          <span class="submenu-item-label">{{ item.label }}</span>
          <span v-if="item.badge" class="submenu-badge">{{ item.badge }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface SubMenuItem {
  to: string
  label: string
  icon: any
  badge?: string
}

defineProps<{
  title: string
  icon: any
  items: SubMenuItem[]
  collapsible?: boolean
  defaultCollapsed?: boolean
}>()

const isCollapsed = ref(false)

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.submenu-container {
  margin-bottom: 0.5rem;
}

.submenu-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 0.25rem;
}

.submenu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #667eea;
  color: white;
  border-radius: 6px;
  flex-shrink: 0;
}

.submenu-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  flex: 1;
}

.submenu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.submenu-toggle:hover {
  background: #e5e7eb;
  color: #374151;
}

.submenu-toggle.collapsed {
  transform: rotate(-90deg);
}

.submenu-content {
  transition: all 0.3s ease;
  overflow: hidden;
}

.submenu-content.collapsed {
  max-height: 0;
  opacity: 0;
}

.submenu-items {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding-left: 0.5rem;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.submenu-item:hover {
  background: #f3f4f6;
  color: #374151;
}

.submenu-item.active {
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
}

.submenu-item.active::before {
  content: '';
  position: absolute;
  left: -0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 1rem;
  background: #1d4ed8;
  border-radius: 0 2px 2px 0;
}

.submenu-item-label {
  flex: 1;
}

.submenu-badge {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 0.75rem;
  min-width: 1.25rem;
  text-align: center;
}

/* Dark mode */
.dark .submenu-header {
  background: #1e293b;
}

.dark .submenu-title {
  color: #f1f5f9;
}

.dark .submenu-toggle {
  color: #94a3b8;
}

.dark .submenu-toggle:hover {
  background: #334155;
  color: #f1f5f9;
}

.dark .submenu-item {
  color: #94a3b8;
}

.dark .submenu-item:hover {
  background: #334155;
  color: #f1f5f9;
}

.dark .submenu-item.active {
  background: #1e3a8a;
  color: #60a5fa;
}

.dark .submenu-item.active::before {
  background: #60a5fa;
}
</style>
