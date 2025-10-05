<template>
  <div class="page-header">
    <div class="flex items-center gap-3">
      <component v-if="icon" :is="icon" class="h-8 w-8 text-primary" />
      <div>
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm text-muted-foreground mt-1">{{ subtitle }}</p>
      </div>
    </div>
    <div class="header-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  icon?: any
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  icon: undefined
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }
}
</style>

