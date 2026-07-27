<script setup lang="ts">
import { Search, CalendarDays } from 'lucide-vue-next'

defineProps<{
  patients: { id: number; first_name: string; last_name: string }[]
  patientId: number | null
  dateFrom: string
  dateTo: string
  total: number
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'patient-change', value: number | null): void
  (e: 'date-change', from: string, to: string): void
}>()

function onPatientChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('patient-change', value ? Number(value) : null)
}

function onDateFromChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('date-change', value, '')
}

function onDateToChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('date-change', '', value)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 py-3">
    <div class="relative sm:w-64">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <select
        :value="patientId ?? ''"
        class="w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        @change="onPatientChange"
      >
        <option value="">Todos los pacientes</option>
        <option
          v-for="patient in patients"
          :key="patient.id"
          :value="patient.id"
        >
          {{ patient.last_name }}, {{ patient.first_name }}
        </option>
      </select>
    </div>

    <div class="flex items-center gap-2">
      <div class="relative">
        <CalendarDays class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="date"
          :value="dateFrom"
          class="rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @change="onDateFromChange"
        />
      </div>
      <span class="text-xs text-slate-400">a</span>
      <div class="relative">
        <CalendarDays class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="date"
          :value="dateTo"
          class="rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @change="onDateToChange"
        />
      </div>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
        {{ total }}
        <span class="font-normal text-primary-600">turno{{ total !== 1 ? 's' : '' }}</span>
      </span>
    </div>
  </div>
</template>
