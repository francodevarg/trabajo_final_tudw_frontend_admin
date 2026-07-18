<script setup lang="ts">
import type { Appointment } from '@/types'
import { User, CreditCard, Phone, Stethoscope } from 'lucide-vue-next'

defineProps<{
  appt: Appointment
}>()

function formatDni(dni: number): string {
  const s = String(dni).padStart(8, '0')
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5)}`
}
</script>

<template>
  <div
    class="rounded-xl bg-white px-5 py-3 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer">
    <div class="flex items-start gap-4">

      <!-- Patient -->
      <div class="min-w-0 flex-[3]">
        <div class="flex items-center gap-1.5">
          <User class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

          <span class="text-sm font-semibold text-slate-900 truncate">
            {{ appt.patient_name }}
          </span>
        </div>

        <div class="flex items-center gap-3 text-xs text-slate-400 mt-1">
          <span class="inline-flex items-center gap-1">
            <CreditCard class="w-3 h-3" />
            {{ formatDni(appt.patientDni) }}
          </span>

          <span v-if="appt.phone" class="inline-flex items-center gap-1">
            <Phone class="w-3 h-3" />
            {{ appt.phone }}
          </span>
        </div>
      </div>


      <!-- Doctor -->
      <div class="min-w-0 flex-[2.5] max-sm:hidden">
        <div class="flex items-center gap-1.5">
          <Stethoscope class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

          <span class="text-sm text-slate-700 truncate">
            {{ appt.doctor_name }}
          </span>
        </div>

        <div class="text-xs text-slate-400 mt-1 pl-5">
          {{ appt.specialty_name }}
        </div>
      </div>


      <!-- Insurance -->
      <div v-if="appt.insurance_name" class="min-w-0 flex-[1.5] max-md:hidden">
        <div class="text-sm text-slate-600 truncate">
          {{ appt.insurance_name }}
        </div>
      </div>


      <!-- Status -->
      <div class="flex-shrink-0">
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap bg-slate-100 text-slate-600">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {{ appt.status }}
        </span>
      </div>

    </div>
  </div>
</template>