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
            >
              {{ column.label }}
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
interface Column {
  key: string;
  label: string;
}

defineProps<{
  columns: Column[];
  data: any[];
}>();

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || '-';
};
</script>
