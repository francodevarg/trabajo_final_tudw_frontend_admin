<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  names: string[]
  max?: number
}>()

const visible = computed(() => props.names.slice(0, props.max ?? 2))
const extra = computed(() => Math.max(0, props.names.length - (props.max ?? 2)))
</script>

<template>
  <span v-if="names.length === 0" class="text-xs text-slate-400">—</span>
  <span v-else class="inline-flex items-center gap-1 flex-wrap">
    <span class="text-xs text-slate-600">{{ visible.join(' • ') }}</span>
    <span v-if="extra > 0" class="text-[10px] text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5 font-medium">
      +{{ extra }}
    </span>
  </span>
</template>
