<template>
  <Teleport to="body">
    <div v-if="isOpen" class="confirm-dialog-overlay" @click="cancel">
      <div class="confirm-dialog" @click.stop>
        <div class="confirm-dialog-header">
          <AlertTriangle class="h-6 w-6 text-red-500" />
          <h3 class="confirm-dialog-title">{{ title }}</h3>
        </div>
        
        <div class="confirm-dialog-content">
          <p class="confirm-dialog-message">{{ message }}</p>
          <p v-if="details" class="confirm-dialog-details">{{ details }}</p>
        </div>
        
        <div class="confirm-dialog-actions">
          <Button variant="outline" @click="cancel">
            Cancelar
          </Button>
          <Button variant="destructive" @click="confirm">
            {{ confirmText }}
          </Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from './Button.vue'
import { AlertTriangle } from 'lucide-vue-next'

interface Props {
  title?: string
  message: string
  details?: string
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar acción',
  confirmText: 'Sí, continuar'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const confirm = () => {
  emit('confirm')
  close()
}

const cancel = () => {
  emit('cancel')
  close()
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;
}

.confirm-dialog {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 28rem;
  width: 90%;
  padding: 1.5rem;
  animation: slideUp 0.3s ease-out;
}

.dark .confirm-dialog {
  background: #1f2937;
}

.confirm-dialog-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.confirm-dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.dark .confirm-dialog-title {
  color: #f9fafb;
}

.confirm-dialog-content {
  margin-bottom: 1.5rem;
}

.confirm-dialog-message {
  color: #374151;
  line-height: 1.5;
}

.dark .confirm-dialog-message {
  color: #d1d5db;
}

.confirm-dialog-details {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .confirm-dialog-details {
  color: #9ca3af;
}

.confirm-dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

