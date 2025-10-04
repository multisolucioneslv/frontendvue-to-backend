<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="settings-header">
      <div class="header-content">
        <div class="header-icon">
          <component :is="icon" class="h-8 w-8" />
        </div>
        <div class="header-text">
          <h1 class="settings-title">{{ title }}</h1>
          <p class="settings-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div class="header-actions">
        <Button variant="outline" @click="resetSettings" v-if="showReset">
          <RotateCcw class="h-4 w-4 mr-2" />
          Restablecer Todo
        </Button>
      </div>
    </div>

    <!-- Content -->
    <div class="settings-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

defineProps<{
  title: string
  subtitle: string
  icon: any
  showReset?: boolean
}>()

const emit = defineEmits<{
  (e: 'reset'): void
}>()

const resetSettings = () => {
  emit('reset')
}
</script>

<style scoped>
.settings-page {
  width: 100%;
  margin: 0;
  padding: 0;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.header-text h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-text p {
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.settings-content {
  padding: 1.5rem;
}

/* Dark mode */
.dark .settings-header {
  border-bottom-color: #334155;
}

.dark .header-text h1 {
  color: #f1f5f9;
}

.dark .header-text p {
  color: #94a3b8;
}
</style>
