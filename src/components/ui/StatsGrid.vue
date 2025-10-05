<template>
  <div class="stats-grid">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// No props needed, just a layout component
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

