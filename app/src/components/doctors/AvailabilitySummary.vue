<script setup lang="ts">
import { computed } from 'vue'
import type { DoctorAvailability } from '@/types'

const props = defineProps<{
  availabilities: DoctorAvailability[]
  full?: boolean
}>()

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const grouped = computed(() => {
  const map = new Map<number, DoctorAvailability[]>()
  for (const a of props.availabilities) {
    const arr = map.get(a.day_of_week) ?? []
    arr.push(a)
    map.set(a.day_of_week, arr)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([day, slots]) => ({
      day,
      label: DAY_LABELS[day],
      slots: slots.sort((a, b) => a.start_time.localeCompare(b.start_time)),
    }))
})

const short = computed(() => {
  if (grouped.value.length <= 2) {
    return grouped.value.map(g => g.label).join(', ')
  }
  return `${grouped.value.length} días`
})
</script>

<template>
  <span v-if="availabilities.length === 0" class="text-xs text-slate-400">—</span>
  <div v-else-if="full" class="space-y-2">
    <div
      v-for="g in grouped"
      :key="g.day"
      class="flex items-start gap-3"
    >
      <span class="text-xs font-semibold text-slate-600 w-8 flex-shrink-0 mt-0.5">{{ g.label }}</span>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="(slot, si) in g.slots"
          :key="si"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono"
        >
          {{ slot.start_time }} – {{ slot.end_time }}
        </span>
      </div>
    </div>
  </div>
  <span v-else class="text-xs text-slate-500">{{ short }}</span>
</template>
