<script setup lang="ts">
import { computed } from 'vue'
import { Mail, CheckCircle, AlertCircle } from 'lucide-vue-next'
import type { EmailStatus } from '@/types'

const props = defineProps<{
  status?: EmailStatus
}>()

const config = computed(() => {
  switch (props.status) {
    case 'sent':
      return { icon: CheckCircle, text: 'Enviado', class: 'bg-success-50 text-success-700' }
    case 'error':
      return { icon: AlertCircle, text: 'Error', class: 'bg-error-50 text-error-700' }
    default:
      return { icon: Mail, text: 'No enviado', class: 'bg-slate-100 text-slate-500' }
  }
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
    :class="config.class"
  >
    <component :is="config.icon" class="w-3 h-3" />
    {{ config.text }}
  </span>
</template>
