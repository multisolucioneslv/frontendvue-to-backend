<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      Mostrando {{ from }} a {{ to }} de {{ total }} resultados
    </div>
    <div class="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === 1"
        @click="$emit('change', currentPage - 1)"
      >
        Anterior
      </Button>

      <div class="flex items-center gap-1">
        <Button
          v-for="page in displayPages"
          :key="page"
          :variant="page === currentPage ? 'default' : 'outline'"
          size="sm"
          @click="page !== '...' && $emit('change', page)"
          :disabled="page === '...'"
          class="min-w-[40px]"
        >
          {{ page }}
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === lastPage"
        @click="$emit('change', currentPage + 1)"
      >
        Siguiente
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from './Button.vue';

const props = defineProps<{
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
}>();

defineEmits<{
  (e: 'change', page: number): void;
}>();

const displayPages = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisible = 5;

  if (props.lastPage <= maxVisible) {
    for (let i = 1; i <= props.lastPage; i++) {
      pages.push(i);
    }
  } else {
    if (props.currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(props.lastPage);
    } else if (props.currentPage >= props.lastPage - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = props.lastPage - 3; i <= props.lastPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = props.currentPage - 1; i <= props.currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(props.lastPage);
    }
  }

  return pages;
});
</script>
