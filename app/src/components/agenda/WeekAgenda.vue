<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import AppointmentCard from './AppointmentCard.vue'
import { useDateLocale } from '@/composables/useDateLocale'
import { groupByTime } from '@/composables/useGroupedByTime'
import type { Appointment } from '@/types'

type WeekDay = {
  date: string
  isToday: boolean
  items: Appointment[]
}

const props = defineProps<{
  appointments: Appointment[]
}>()

const { formatDayLabel } = useDateLocale()


/**
 * Genera los 7 días de la semana
 * y hace merge con los turnos existentes
 */
const weekDays = computed<WeekDay[]>(() => {
  const grouped = props.appointments.reduce<Record<string, Appointment[]>>(
    (acc, appt) => {
      acc[appt.date] ??= []
      acc[appt.date].push(appt)

      return acc
    },
    {}
  )

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const day = today.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  const monday = new Date(today)
  monday.setDate(today.getDate() + diffToMonday)


  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)

    const dateStr = date.toISOString().split('T')[0]

    return {
      date: dateStr,
      isToday: dateStr === todayStr,
      items: grouped[dateStr] ?? [],
    }
  })
})


const expandedDays = ref<Set<string>>(
  new Set(
    weekDays.value
      .filter(day => day.isToday && day.items.length)
      .map(day => day.date)
  )
)


function toggleDay(date: string) {
  const day = weekDays.value.find(item => item.date === date)

  if (!day?.items.length) {
    return
  }

  const next = new Set(expandedDays.value)

  if (next.has(date)) {
    next.delete(date)
  } else {
    next.add(date)
  }

  expandedDays.value = next
}


function isExpanded(date: string) {
  return expandedDays.value.has(date)
}


function todayLabel(dateStr: string) {
  const formatted = formatDayLabel(dateStr)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
</script>


<template>
  <div class="bg-white rounded-lg shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)] overflow-hidden divide-y divide-slate-100">

    <div v-for="day in weekDays" :key="day.date" class="select-none">

      <!-- DIA CON TURNOS -->
      <button v-if="day.items.length"
        class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
        @click="toggleDay(day.date)">

        <!-- indicador activo -->
        <div class="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0" />


        <div class="flex-1 min-w-0">

          <div class="flex items-center gap-2">

            <span class="text-sm font-semibold" :class="day.isToday
              ? 'text-primary-700'
              : 'text-slate-800'">
              {{ todayLabel(day.date) }}
            </span>


            <span v-if="day.isToday"
              class="text-[10px] font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
              Hoy
            </span>

          </div>


          <p class="text-xs text-slate-500 mt-0.5">
            {{ day.items.length }}
            turno{{ day.items.length !== 1 ? 's' : '' }}
            programado{{ day.items.length !== 1 ? 's' : '' }}
          </p>

        </div>


        <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200"
          :class="isExpanded(day.date) ? 'rotate-180' : ''" />

      </button>



      <!-- DIA SIN TURNOS -->
      <div v-else class="flex items-center gap-3 px-4 py-3 bg-slate-50/50">

        <!-- indicador vacío -->
        <div class="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white shrink-0" />


        <div class="flex-1">

          <div class="flex items-center gap-2">

            <span class="text-sm font-medium text-slate-500">
              {{ todayLabel(day.date) }}
            </span>


            <span v-if="day.isToday"
              class="text-[10px] font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
              Hoy
            </span>

          </div>


          <p class="text-xs text-slate-400 mt-0.5">
            No hay turnos programados
          </p>

        </div>

      </div>



      <!-- TIMELINE -->
      <Transition name="collapse">

        <div v-if="isExpanded(day.date)" class="pb-4 pt-3">

          <div class="relative">

            <div class="absolute left-[65px] top-3 bottom-3 w-px bg-slate-200" />


            <div class="space-y-5">

              <div v-for="[time, appts] in groupByTime(day.items)" :key="time" class="relative pl-[82px] min-h-[36px]">

                <span
                  class="absolute left-0 top-0.5 text-sm font-semibold text-slate-800 tabular-nums w-[52px] text-right">
                  {{ time }}
                </span>


                <div
                  class="absolute left-[60px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary-500 z-10" />


                <div class="space-y-1">

                  <AppointmentCard v-for="appt in appts" :key="appt.id" :appt="appt" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </Transition>

    </div>

  </div>
</template>


<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 5000px;
}
</style>