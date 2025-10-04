<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  end: number
  duration?: number
  start?: number
  separator?: string
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2,
  start: 0,
  separator: ',',
  prefix: '',
  suffix: ''
})

const displayValue = ref(props.prefix + props.start + props.suffix)

const animateValue = () => {
  const startTime = Date.now()
  const startValue = props.start
  const endValue = props.end
  const duration = props.duration * 1000

  const animate = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut)
    
    // Format number with separator
    const formattedValue = currentValue.toLocaleString('es-ES')
    displayValue.value = props.prefix + formattedValue + props.suffix
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // Ensure final value is exact
      const finalValue = props.end.toLocaleString('es-ES')
      displayValue.value = props.prefix + finalValue + props.suffix
    }
  }
  
  requestAnimationFrame(animate)
}

onMounted(() => {
  // Small delay to ensure smooth animation
  setTimeout(animateValue, 100)
})

watch(() => props.end, () => {
  animateValue()
})
</script>
