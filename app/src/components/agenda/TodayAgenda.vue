<script setup lang="ts">
import { computed } from 'vue'
import { useGroupedByTime } from '@/composables/useGroupedByTime'
import AppointmentCard from './AppointmentCard.vue'
import type { Appointment } from '@/types'

const props = defineProps<{
  appointments: Appointment[]
}>()

const groupedAppointments = useGroupedByTime(
  computed(() => props.appointments)
)
</script>

<template>
  <div v-if="appointments.length === 0" class="py-10 text-center">
    <p class="text-sm text-slate-400">
      No hay turnos para hoy
    </p>
  </div>

  <div v-else class="relative">

    <!-- timeline line -->
    <div class="absolute left-[65px] top-4 bottom-4 w-px bg-slate-200 pointer-events-none" />

    <div class="space-y-6">

      <div v-for="[time, appts] in groupedAppointments" :key="time" class="relative pl-[82px] min-h-[40px]">

        <!-- time -->
        <span
          class="absolute left-0 top-0 w-[52px] text-right pt-0.5 text-sm font-semibold text-slate-800 tabular-nums">
          {{ time }}
        </span>


        <!-- timeline point -->
        <div class="absolute left-[60px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary-500 z-10" />


        <!-- appointments -->
        <div class="space-y-1">
          <AppointmentCard v-for="appt in appts" :key="appt.id" :appt="appt" />
        </div>

      </div>

    </div>

  </div>
</template>