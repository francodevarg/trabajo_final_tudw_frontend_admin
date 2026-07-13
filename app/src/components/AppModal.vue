<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    maxWidth?: string
  }>(),
  {
    maxWidth: 'sm:max-w-md',
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

let previousOverflow = ''

function close() {
  emit('close')
}

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    close()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    close()
  }
}

watch(
  () => props.open,
  open => {
    if (open) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousOverflow
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = previousOverflow
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
        @click="onBackdrop"
      >
        <div
          class="dialog bg-white w-full sm:w-auto min-w-[320px] sm:min-w-[400px] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden min-h-[200px] h-full sm:h-auto sm:max-h-[90dvh]"
          :class="maxWidth"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <!-- Header -->
          <div
            v-if="title"
            class="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-0 flex-shrink-0"
          >
            <h3
              id="modal-title"
              class="text-base font-semibold text-slate-900"
            >
              {{ title }}
            </h3>

            <button
              type="button"
              aria-label="Cerrar"
              class="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              @click="close"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-5">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 flex-shrink-0"
          >
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

.modal-enter-active .dialog,
.modal-leave-active .dialog {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .dialog,
.modal-leave-to .dialog {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>