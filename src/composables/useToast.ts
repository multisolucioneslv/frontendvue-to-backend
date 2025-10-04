import { ref } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    toasts.value.push({
      id,
      ...toast
    })
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, message: string, duration = 5000) => {
    addToast({ type: 'success', title, message, duration })
  }

  const error = (title: string, message: string, duration = 5000) => {
    addToast({ type: 'error', title, message, duration })
  }

  const info = (title: string, message: string, duration = 5000) => {
    addToast({ type: 'info', title, message, duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info
  }
}
