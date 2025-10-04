<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="onClose"
      >
        <div class="fixed inset-0 bg-black/80" @click="onClose" />
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="open" class="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
            <div class="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 class="text-lg font-semibold leading-none tracking-tight">
                <slot name="title">{{ title }}</slot>
              </h2>
              <p v-if="description" class="text-sm text-muted-foreground">
                {{ description }}
              </p>
            </div>
            <div class="flex-1">
              <slot />
            </div>
            <div v-if="$slots.footer" class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  title?: string;
  description?: string;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const onClose = () => {
  emit('update:open', false);
};
</script>
