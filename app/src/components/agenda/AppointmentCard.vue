<script setup lang="ts">
import type { AppointmentReadDTO } from '@/types/appointment'
import { User, CreditCard, Stethoscope } from 'lucide-vue-next'
import { getStatusConfig } from '@/types/appointment'
import AppointmentActions from './AppointmentActions.vue'

const props = defineProps<{
  appt: AppointmentReadDTO
}>()


function formatDni(dni: number): string {
  const s = String(dni).padStart(8, '0')
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5)}`
}
</script>

<template>
  <div>
    <div class="rounded-xl bg-white px-4 py-3 sm:px-5 transition-all duration-150 hover:bg-slate-50 hover:shadow-md">

      <!-- Mobile: stacked layout -->
      <div class="flex flex-col gap-2 sm:hidden">
        <!-- Row 1: Patient + Status -->
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <User class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span class="text-sm font-semibold text-slate-900 truncate">
                {{ appt.patient_detail.first_name }} {{ appt.patient_detail.last_name }}
              </span>
            </div>
            <div class="flex items-center gap-1 text-xs text-slate-400 mt-0.5 pl-5">
              <CreditCard class="w-3 h-3 flex-shrink-0" />
              {{ formatDni(appt.patient_detail.dni) }}
            </div>
          </div>
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap bg-slate-100 text-slate-600 flex-shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {{ displayStatus }}
          </span>
        </div>

        <!-- Row 2: Doctor + Actions -->
        <div class="flex items-center justify-between gap-2 pl-5">
          <div class="flex items-center gap-1.5 min-w-0">
            <Stethoscope class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span class="text-xs text-slate-700 truncate">
              {{ appt.doctor_detail.first_name }} {{ appt.doctor_detail.last_name }}
            </span>
            <span class="text-xs text-slate-400">—</span>
            <span class="text-xs text-slate-400 truncate">
              {{ appt.doctor_detail.specialty.name }}
            </span>
          </div>

          <AppointmentActions :appointment="appt" />
        </div>
      </div>

      <!-- Desktop: horizontal layout -->
      <div class="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4">

        <!-- Patient -->
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <User class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span class="text-sm font-semibold text-slate-900 truncate">
              {{ appt.patient_detail.first_name }} {{ appt.patient_detail.last_name }}
            </span>
          </div>
          <div class="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span class="inline-flex items-center gap-1">
              <CreditCard class="w-3 h-3" />
              {{ formatDni(appt.patient_detail.dni) }}
            </span>
          </div>
        </div>

        <!-- Doctor -->
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <Stethoscope class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span class="text-sm text-slate-700 truncate">
              {{ appt.doctor_detail.first_name }} {{ appt.doctor_detail.last_name }}
            </span>
          </div>
          <div class="text-xs text-slate-400 mt-1 pl-5">
            {{ appt.doctor_detail.specialty.name }}
          </div>
        </div>

        <!-- Status -->
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap justify-self-end"
          :class="getStatusConfig(appt.status).class">

          <component :is="getStatusConfig(appt.status).icon" class="h-5 w-5"></component>

          {{ getStatusConfig(appt.status).label }}
        </span>

        <!-- Actions -->
        <AppointmentActions :appointment="appt" />
      </div>
    </div>
  </div>
</template>
