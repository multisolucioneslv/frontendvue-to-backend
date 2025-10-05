<template>
  <Card class="stat-card">
    <div class="stat-content">
      <div class="stat-icon" :style="{ background: gradient }">
        <component :is="icon" class="h-6 w-6 text-white" />
      </div>
      <div class="stat-info">
        <p class="stat-label">{{ label }}</p>
        <p class="stat-value">{{ value }}</p>
        <p v-if="subtitle" class="stat-subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from './Card.vue'

interface Props {
  icon: any
  label: string
  value: string | number
  subtitle?: string
  gradient?: string
}

withDefaults(defineProps<Props>(), {
  gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  subtitle: ''
})
</script>

<style scoped>
.stat-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.dark .stat-card {
  background: #334155;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.dark .stat-label {
  color: #cbd5e1;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0.25rem 0 0;
  line-height: 1;
}

.dark .stat-value {
  color: #f8fafc;
}

.stat-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0.25rem 0 0;
}

.dark .stat-subtitle {
  color: #64748b;
}
</style>

