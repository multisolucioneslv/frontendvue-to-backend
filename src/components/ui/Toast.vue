<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      :class="{
        'border-l-4 border-green-400 bg-green-50': type === 'success',
        'border-l-4 border-red-400 bg-red-50': type === 'error',
        'border-l-4 border-blue-400 bg-blue-50': type === 'info'
      }"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <CheckCircle v-if="type === 'success'" class="h-6 w-6 text-green-400" />
            <XCircle v-else-if="type === 'error'" class="h-6 w-6 text-red-400" />
            <Info v-else class="h-6 w-6 text-blue-400" />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              {{ title }}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              @click="close"
              class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">Cerrar</span>
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'

interface Props {
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 5000
})

const emit = defineEmits<{
  close: []
}>()

const show = ref(false)

const close = () => {
  show.value = false
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  show.value = true
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>
