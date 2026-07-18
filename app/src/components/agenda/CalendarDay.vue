<script setup lang="ts">
import { computed } from 'vue'
import type { Appointment } from '@/types'

const props = defineProps<{
  date: string | null
  dayNumber: number | null
  items: Appointment[]
  count: number
  isToday: boolean
  isCurrentMonth: boolean
}>()

const emit = defineEmits<{
  (e: 'select', date: string): void
}>()


const heatBg = computed(() => {
  if (!props.isCurrentMonth || props.count === 0) {
    return ''
  }

  if (props.count <= 3) {
    return 'bg-primary-50'
  }

  if (props.count <= 7) {
    return 'bg-primary-100'
  }

  return 'bg-primary-200'
})


function handleClick() {
  if (!props.date) return

  emit('select', props.date)
}
</script>


<template>

  <button v-if="date"
    class="relative flex flex-col items-center justify-center rounded-lg min-h-[52px] transition-all duration-100 outline-none cursor-pointer"
    :class="[
      heatBg,
      isToday
        ? 'bg-primary-600 text-white shadow-sm'
        : '',
      isCurrentMonth && !heatBg && !isToday
        ? 'hover:bg-slate-50'
        : '',
    ]" @click="handleClick">

    <span class="text-sm font-semibold leading-none" :class="isToday
        ? 'text-white'
        : !isCurrentMonth
          ? 'text-slate-300'
          : 'text-slate-800'
      ">
      {{ dayNumber }}
    </span>


    <span v-if="count" class="text-[10px] font-medium leading-none mt-0.5" :class="isToday
        ? 'text-white/80'
        : 'text-slate-400'
      ">
      {{ count }}
    </span>

  </button>


  <div v-else class="min-h-[44px]" />

</template>