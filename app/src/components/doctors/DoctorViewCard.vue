<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Mail, Phone, Stethoscope, IdCard, DollarSign, Send, CheckCircle, AlertCircle, ChevronDown, X,
} from 'lucide-vue-next'
import type { DoctorDTO, DoctorAvailabilityDTO } from '@/types'
import DoctorAvatar from './DoctorAvatar.vue'
import AppClipboard from '../AppClipboard.vue'

const props = defineProps<{
  doctor: DoctorDTO
}>()


const showFullDescription = ref(false)

const emailStatusConfig = computed(() => {
  switch (props.doctor.email_status) {
    case 'sent':
      return { icon: CheckCircle, text: 'Email de bienvenida enviado', class: 'text-success-600 bg-success-50 border-success-200' }
    case 'error':
      return { icon: AlertCircle, text: 'Error al enviar email', class: 'text-error-600 bg-error-50 border-error-200' }
    default:
      return { icon: Send, text: 'Enviar email de bienvenida', class: 'text-primary-600 bg-primary-50 border-primary-200 hover:bg-primary-100' }
  }
})

function extractSpecialtyName(s: unknown): string {
  if (!s) return '—'
  if (typeof s === 'string') return s
  if (typeof s === 'object' && s !== null && 'name' in s) return (s as { name: string }).name
  return '—'
}

function extractInsuranceNames(arr: unknown): string[] {
  if (!Array.isArray(arr)) return []
  return arr.map(i => {
    if (typeof i === 'string') return i
    if (typeof i === 'object' && i !== null && 'name' in i) return (i as { name: string }).name
    return ''
  }).filter(Boolean)
}

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const insuranceNames = computed(() => extractInsuranceNames(props.doctor.insurances))

const availabilityTable = computed(() => {
  const map = new Map<number, DoctorAvailabilityDTO[]>()
  for (const a of props.doctor.availabilities) {
    const arr = map.get(a.day_of_week) ?? []
    arr.push(a)
    map.set(a.day_of_week, arr)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([day, slots]) => {
      const sorted = [...slots].sort((a, b) => a.start_time.localeCompare(b.start_time))
      const classify = (s: DoctorAvailabilityDTO) => {
        const hour = parseInt(s.start_time.split(':')[0], 10)
        if (hour < 12) return 'morning' as const
        if (hour < 18) return 'afternoon' as const
        return 'night' as const
      }
      const format = (list: DoctorAvailabilityDTO[]) =>
        list.map(s => `${s.start_time}–${s.end_time}`).join(', ') || '—'
      return {
        day,
        label: DAY_LABELS[day],
        morning: format(sorted.filter(s => classify(s) === 'morning')),
        afternoon: format(sorted.filter(s => classify(s) === 'afternoon')),
        night: format(sorted.filter(s => classify(s) === 'night')),
      }
    })
})

const hasLongDescription = computed(() =>
  (props.doctor.description?.length ?? 0) > 120
)
</script>

<template>
  <div class="divide-y divide-slate-200">
    <!-- Row 1: Profile header — cols 1-2 avatar | 3-8 name+specialty | 9-12 status+actions -->
    <div class="grid grid-cols-[auto_1fr_auto] items-start gap-x-4 py-4">
      <DoctorAvatar :first-name="doctor.first_name" :last-name="doctor.last_name" size="md" />
      <div class="min-w-0">
        <h2 class="text-xl font-semibold text-slate-900">
          {{ doctor.first_name }} {{ doctor.last_name }}
        </h2>
        <p class="text-base text-slate-500 mt-0.5">
          <Stethoscope class="w-3.5 h-3.5 inline mr-1" />
          {{ extractSpecialtyName(doctor.specialty) }}
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium" :class="doctor.is_active !== false
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'">
          <span class="w-1.5 h-1.5 rounded-full"
            :class="doctor.is_active !== false ? 'bg-emerald-500' : 'bg-slate-400'" />
          {{ doctor.is_active !== false ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
    </div>

    <!-- Row 2: Description — full width -->
    <div v-if="doctor.description" class="py-4">
      <p class="text-base text-slate-600 leading-relaxed"
        :class="{ 'line-clamp-2': !showFullDescription && hasLongDescription }">
        {{ doctor.description }}
      </p>
      <button v-if="hasLongDescription"
        class="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1 inline-flex items-center gap-0.5"
        @click="showFullDescription = !showFullDescription">
        {{ showFullDescription ? 'Ver menos' : 'Ver más' }}
        <ChevronDown class="w-3 h-3 transition-transform duration-200"
          :class="showFullDescription ? 'rotate-180' : ''" />
      </button>
    </div>

    <!-- Row 3: Contact & admin info — 4-column grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 py-4">
      <div class="flex items-center gap-3 min-w-0 group">
        <Mail class="w-4 h-4 text-slate-400 shrink-0" />
        <div class="min-w-0 flex-1">
          <span class="text-sm text-slate-400 block">Email</span>
          <span class="text-base text-slate-900 truncate block">{{ doctor.email }}</span>
        </div>
        <AppClipboard v-if="doctor.email" :text="doctor.email" />
      </div>
      <div class="flex items-center gap-3 min-w-0 group">
        <Phone class="w-4 h-4 text-slate-400 shrink-0" />
        <div class="min-w-0 flex-1">
          <span class="text-sm text-slate-400 block">Teléfono</span>
          <span class="text-base text-slate-900 truncate block">{{ doctor.phone || '—' }}</span>
        </div>
        <AppClipboard v-if="doctor.phone" :text="doctor.phone" />
      </div>
      <div class="flex items-center gap-3 min-w-0">
        <IdCard class="w-4 h-4 text-slate-400 shrink-0" />
        <div class="min-w-0">
          <span class="text-sm text-slate-400 block">Matrícula</span>
          <span class="text-base text-slate-900 font-mono truncate block">{{ doctor.license_number || '—' }}</span>
        </div>
      </div>
      <div class="flex items-center gap-3 min-w-0">
        <DollarSign class="w-4 h-4 text-slate-400 shrink-0" />
        <div class="min-w-0">
          <span class="text-sm text-slate-400 block">Honorarios</span>
          <span class="text-base text-slate-900 truncate block">{{ doctor.consultation_fee ?
            `$${doctor.consultation_fee}` : '—' }}</span>
        </div>
      </div>
    </div>

    <!-- Row 4: Insurance chips — full width -->
    <div v-if="insuranceNames.length > 0" class="py-4">
      <div class="flex flex-wrap gap-1.5">
        <span v-for="name in insuranceNames" :key="name"
          class="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-slate-100 text-slate-700">
          {{ name }}
        </span>
      </div>
    </div>

    <!-- Row 5: Availability table — full width -->
    <div v-if="availabilityTable.length > 0" class="py-4">
      <table class="w-full text-base">
        <thead>
          <tr>
            <th class="py-1.5 pr-4 text-left text-sm font-medium text-slate-400 uppercase tracking-wider w-12" />
            <th class="py-1.5 pr-4 text-left text-sm font-medium text-slate-400 uppercase tracking-wider">Mañana</th>
            <th class="py-1.5 pr-4 text-left text-sm font-medium text-slate-400 uppercase tracking-wider">Tarde</th>
            <th class="py-1.5 text-left text-sm font-medium text-slate-400 uppercase tracking-wider">Noche</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in availabilityTable" :key="row.day" class="border-t border-slate-100">
            <td class="py-2 pr-4 text-base font-medium text-slate-700">{{ row.label }}</td>
            <td class="py-2 pr-4 text-base text-slate-600 font-mono">{{ row.morning }}</td>
            <td class="py-2 pr-4 text-base text-slate-600 font-mono">{{ row.afternoon }}</td>
            <td class="py-2 text-base text-slate-600 font-mono">{{ row.night }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
