<template>
  <router-view/>
  <ToastContainer />
</template>

<script setup lang="ts">
import ToastContainer from '@/components/ui/ToastContainer.vue'
import { useSettings } from '@/composables/useSettings'

// Inicializar configuraciones globales
const { loadSettings, applyDefaultsIfFirstTime } = useSettings()

// Aplicar valores por defecto si es la primera vez
applyDefaultsIfFirstTime()

// Cargar configuraciones
loadSettings()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
