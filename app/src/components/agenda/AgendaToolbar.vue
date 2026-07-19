<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { ViewMode } from '@/types'

defineProps<{
  viewMode: ViewMode
  dateRangeLabel: string
  isToday: boolean
}>()

const emit = defineEmits<{
  (e: 'view-change', view: ViewMode): void
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'today'): void
}>()

const views = [
  { key: 'day' as const, label: 'Día' },
  { key: 'week' as const, label: 'Semana' },
  { key: 'month' as const, label: 'Mes' },
]
</script>

<template>
  <div class="py-3">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">

      <!-- Selector de vista -->
      <div class="flex justify-center sm:justify-start">
        <div class="inline-flex items-center bg-slate-100 rounded-md p-0.5 w-full sm:w-auto">
          <button v-for="v in views" :key="v.key"
            class="flex-1 sm:flex-none px-3 py-1 text-sm font-medium rounded-md transition-all duration-150" :class="viewMode === v.key
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
              " @click="emit('view-change', v.key)">
            {{ v.label }}
          </button>
        </div>
      </div>


      <!-- Navegación fecha -->
      <div class="flex items-center justify-center gap-1 sm:justify-end">

        <button class="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100" @click="emit('prev')">
          <ChevronLeft class="w-4 h-4" />
        </button>


        <span
          class="text-sm sm:text-base font-semibold text-slate-800 capitalize text-center truncate max-w-[180px] sm:max-w-none">
          {{ dateRangeLabel }}
        </span>


        <button class="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100" @click="emit('next')">
          <ChevronRight class="w-4 h-4" />
        </button>


        <button class="ml-1 px-2 py-1 rounded-md text-xs font-medium transition-all" :class="isToday && viewMode === 'day'
          ? 'border border-primary-500 text-primary-600 bg-primary-50'
          : 'text-primary-600 hover:bg-primary-50'
          " @click="emit('today')">
          Hoy
        </button>

      </div>

    </div>
  </div>
</template>