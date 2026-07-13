<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store'
import {
  CircleCheck,
  TriangleAlert,
  Info,
  X,
} from 'lucide-vue-next'

const icons: any = {
  check: CircleCheck,
  warning: TriangleAlert,
  info: Info,
  close: X,
}



const ui = useUiStore()

const styles: Record<string, { bg: string; icon: string; iconColor: string }> = {
  success: { bg: 'bg-success-50 border-success-200', icon: 'check', iconColor: 'text-success-600' },
  error: { bg: 'bg-error-50 border-error-200', icon: 'warning', iconColor: 'text-error-600' },
  warning: { bg: 'bg-warning-50 border-warning-200', icon: 'warning', iconColor: 'text-warning-600' },
  info: { bg: 'bg-primary-50 border-primary-200', icon: 'info', iconColor: 'text-primary-600' },
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      <TransitionGroup name="toast">
        <div v-for="t in ui.toasts" :key="t.id"
          class="flex items-start gap-3 p-3 rounded-lg border shadow-soft animate-slide-up" :class="styles[t.type].bg">
          <component :is="icons[styles[t.type].icon]" :class="styles[t.type].iconColor" class="w-5 h-5 mt-0.5" />
          <p class="text-sm text-slate-700 flex-1">{{ t.message }}</p>
          <button class="text-slate-400 hover:text-slate-600" @click="ui.dismiss(t.id)">
            <component :is="icons.close" class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
