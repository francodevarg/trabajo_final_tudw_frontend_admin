<script setup lang="ts">
import { User, CreditCard, Stethoscope, History } from 'lucide-vue-next'
import { getStatusConfig } from '@/types/appointment'
import type { AppointmentReadDTO } from '@/types/appointment'

defineProps<{
  appointment: AppointmentReadDTO
}>()

const emit = defineEmits<{
  (e: 'view-history', patientId: number): void
}>()

function formatDni(dni: number): string {
  const s = String(dni).padStart(8, '0')
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5)}`
}
</script>

<template>
  <tr class="group hover:bg-slate-50/60 transition-colors">
    <td class="px-5 py-3.5">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <User class="w-4 h-4 text-primary-600" />
        </div>
        <div class="min-w-0">
          <p class="font-medium text-slate-800 text-sm truncate">
            {{ appointment.patient_detail.first_name }} {{ appointment.patient_detail.last_name }}
          </p>
          <div class="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
            <CreditCard class="w-3 h-3 flex-shrink-0" />
            {{ formatDni(appointment.patient_detail.dni) }}
          </div>
        </div>
      </div>
    </td>

    <td class="px-5 py-3.5 hidden md:table-cell">
      <div class="flex items-center gap-1.5">
        <Stethoscope class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span class="text-sm text-slate-700 truncate">
          {{ appointment.doctor_detail.first_name }} {{ appointment.doctor_detail.last_name }}
        </span>
      </div>
      <p class="text-xs text-slate-400 mt-0.5 pl-5">
        {{ appointment.doctor_detail.specialty.name }}
      </p>
    </td>

    <td class="px-5 py-3.5 hidden lg:table-cell">
      <span class="text-sm text-slate-700">{{ appointment.date }}</span>
    </td>

    <td class="px-5 py-3.5 hidden lg:table-cell">
      <span class="text-sm text-slate-700 tabular-nums">{{ appointment.time?.slice(0, 5) }}</span>
    </td>

    <td class="px-5 py-3.5 hidden md:table-cell">
      <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
        :class="getStatusConfig(appointment.status).class"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-current" />
        {{ getStatusConfig(appointment.status).label }}
      </span>
    </td>

    <td class="px-5 py-3.5 text-right">
      <button
        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
        @click="emit('view-history', appointment.patient_detail.id)"
      >
        <History class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">Ver Historia Clínica</span>
      </button>
    </td>
  </tr>
</template>
