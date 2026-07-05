<script setup lang="ts">
import { watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  title: string
  maxWidth?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}

watch(() => props.open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
}, { immediate: true })
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        @keydown="onKeydown"
        @click="onBackdrop"
      >
        <div
          class="bg-white rounded-2xl shadow-xl w-full animate-slide-up"
          :class="maxWidth ?? 'max-w-md'"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 pt-6 pb-0">
            <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
            <button
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              @click="emit('close')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 pb-6 pt-0">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
