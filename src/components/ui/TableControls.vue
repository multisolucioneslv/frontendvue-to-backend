<template>
  <div class="table-controls">
    <!-- Selector de entradas por página -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">Mostrar</span>
      <select 
        :value="perPage" 
        @change="$emit('update:perPage', ($event.target as HTMLSelectElement).value)"
        class="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700"
      >
        <option v-for="option in perPageOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <span class="text-sm text-muted-foreground">{{ entriesText }}</span>
    </div>
    
    <!-- Controles adicionales (filtros, búsqueda) -->
    <div class="flex items-center gap-3">
      <!-- Slot para filtros personalizados -->
      <slot name="filters"></slot>

      <!-- Barra de búsqueda -->
      <div v-if="showSearch" class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          :model-value="searchQuery"
          @update:model-value="$emit('update:searchQuery', $event)"
          :placeholder="searchPlaceholder"
          class="pl-10 w-64"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from './Input.vue'
import { Search } from 'lucide-vue-next'

interface Props {
  perPage: string | number
  searchQuery?: string
  perPageOptions?: (string | number)[]
  entriesText?: string
  searchPlaceholder?: string
  showSearch?: boolean
}

withDefaults(defineProps<Props>(), {
  perPageOptions: () => [10, 25, 50, 100],
  entriesText: 'entradas por página',
  searchPlaceholder: 'Buscar...',
  showSearch: true,
  searchQuery: ''
})

defineEmits<{
  (e: 'update:perPage', value: string | number): void
  (e: 'update:searchQuery', value: string): void
}>()
</script>

<style scoped>
.table-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

