<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import CalendarDay from './CalendarDay.vue'
import DayDetailModal from './DayDetailModal.vue'
import { useCalendarMonth } from '@/composables/useCalendarMonth'
import { useDateLocale } from '@/composables/useDateLocale'
import { parseISO } from 'date-fns'
import type { AppointmentReadDTO } from '@/types/appointment/appointment.dto.ts'

const props = defineProps<{
  appointments: AppointmentReadDTO[]
  selectedDate: string
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()

const { formatDate } = useDateLocale()

const weekHeaders = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const selectedDate = ref<string | null>(null)
const showModal = ref(false)

const currentMonth = computed(() => parseISO(props.selectedDate))

const monthDays = useCalendarMonth(
  () => currentMonth.value,
  () => props.appointments,
)

const selectedAppointments = computed(() => {
  if (!selectedDate.value) return []
  return props.appointments.filter(a => a.date === selectedDate.value)
})

const monthLabel = computed(() =>
  formatDate(props.selectedDate, 'MMMM yyyy'),
)

watch(() => props.selectedDate, () => {
  selectedDate.value = null
  showModal.value = false
})

function openDay(date: string) {
  selectedDate.value = date
  showModal.value = true
}
</script>

<template>
  <div>
    <div class="bg-white rounded-xl shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)]">

      <!-- Header con navegación -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button
          class="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          @click="emit('prev')"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <span class="text-sm font-semibold text-slate-800 capitalize">{{ monthLabel }}</span>
        <button
          class="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          @click="emit('next')"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Días de la semana -->
      <div class="grid grid-cols-7 border-b border-slate-100">
        <div
          v-for="day in weekHeaders"
          :key="day"
          class="px-1.5 py-1.5 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
        >
          {{ day }}
        </div>
      </div>

      <!-- Grilla del calendario -->
      <div class="grid grid-cols-7 p-1 gap-px">
        <CalendarDay
          v-for="cell in monthDays"
          :key="cell.date"
          :date="cell.date"
          :day-number="cell.dayNumber"
          :items="cell.items"
          :count="cell.count"
          :is-today="cell.isToday"
          :is-current-month="cell.isCurrentMonth"
          @select="openDay"
        />
      </div>
    </div>

    <DayDetailModal
      v-if="selectedDate"
      :date="selectedDate"
      :appointments="selectedAppointments"
      v-model:open="showModal"
      @close="showModal = false"
    />
  </div>
</template>