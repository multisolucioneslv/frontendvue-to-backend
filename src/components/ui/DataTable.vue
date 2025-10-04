<template>
  <div class="w-full">
    <div v-if="$slots.header" class="flex items-center justify-between mb-4">
      <slot name="header" />
    </div>

    <div class="rounded-md border">
      <table class="w-full caption-bottom text-sm">
        <thead class="border-b">
          <tr class="border-b transition-colors hover:bg-muted/50">
            <th
              v-for="column in columns"
              :key="column.key"
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
              :class="{ 'cursor-pointer hover:bg-muted/30': column.sortable }"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable" class="flex flex-col">
                  <ArrowUp 
                    class="h-3 w-3 transition-colors"
                    :class="sortBy === column.key && sortOrder === 'asc' ? 'text-primary' : 'text-muted-foreground/50'"
                  />
                  <ArrowDown 
                    class="h-3 w-3 -mt-1 transition-colors"
                    :class="sortBy === column.key && sortOrder === 'desc' ? 'text-primary' : 'text-muted-foreground/50'"
                  />
                </div>
              </div>
            </th>
            <th v-if="$slots.actions" class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="[&_tr:last-child]:border-0">
          <tr
            v-for="(item, index) in data"
            :key="index"
            class="border-b transition-colors hover:bg-muted/50"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="p-4 align-middle"
            >
              <slot :name="`cell-${column.key}`" :item="item">
                {{ getNestedValue(item, column.key) }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="p-4 align-middle">
              <slot name="actions" :item="item" />
            </td>
          </tr>
          <tr v-if="!data.length">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="p-4 text-center text-muted-foreground">
              No hay datos disponibles
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUp, ArrowDown } from 'lucide-vue-next';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

const props = defineProps<{
  columns: Column[];
  data: any[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  sort: [key: string, order: 'asc' | 'desc'];
}>();

const handleSort = (key: string) => {
  let newOrder: 'asc' | 'desc' = 'asc';
  
  if (props.sortBy === key) {
    // Si ya está ordenando por esta columna, cambiar el orden
    newOrder = props.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    // Si es una nueva columna, empezar con ascendente
    newOrder = 'asc';
  }
  
  emit('sort', key, newOrder);
};

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || '-';
};
</script>
