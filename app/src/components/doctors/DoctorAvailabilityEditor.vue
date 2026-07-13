<script setup lang="ts">
import { computed } from 'vue'
import type { DoctorAvailabilityDTO } from '@/types'
import { Plus, Trash2, Clock, Sun, Moon, SunMoon } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: DoctorAvailabilityDTO[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: DoctorAvailabilityDTO[]): void
}>()

const DAYS = [
  { value: 0, label: 'Lunes', short: 'Lun' },
  { value: 1, label: 'Martes', short: 'Mar' },
  { value: 2, label: 'Miércoles', short: 'Mié' },
  { value: 3, label: 'Jueves', short: 'Jue' },
  { value: 4, label: 'Viernes', short: 'Vie' },
  { value: 5, label: 'Sábado', short: 'Sáb' },
  { value: 6, label: 'Domingo', short: 'Dom' },
]

const safeSlots = computed(() => props.modelValue ?? [])

function slotsForDay(d: number) {
  return safeSlots.value.filter(s => s.day_of_week === d)
}

function isActive(d: number) {
  return safeSlots.value.some(s => s.day_of_week === d)
}

function toggleDay(d: number) {
  const next = [...safeSlots.value]
  const existing = next.filter(s => s.day_of_week === d)
  if (existing.length > 0) {
    emit('update:modelValue', next.filter(s => s.day_of_week !== d))
  } else {
    next.push({ day_of_week: d, start_time: '09:00', end_time: '17:00' })
    emit('update:modelValue', next)
  }
}

function setPreset(d: number, preset: 'morning' | 'afternoon' | 'full') {
  const rest = safeSlots.value.filter(s => s.day_of_week !== d)
  const blocks: DoctorAvailabilityDTO[] = []
  if (preset === 'morning' || preset === 'full') {
    blocks.push({ day_of_week: d, start_time: '08:00', end_time: '12:00' })
  }
  if (preset === 'full') {
    blocks.push({ day_of_week: d, start_time: '12:00', end_time: '14:00' })
  }
  if (preset === 'afternoon' || preset === 'full') {
    blocks.push({ day_of_week: d, start_time: '14:00', end_time: '18:00' })
  }
  emit('update:modelValue', [...rest, ...blocks])
}

function addSlot(d: number) {
  const daySlots = slotsForDay(d)
  const last = daySlots[daySlots.length - 1]
  const base = last ? parseInt(last.end_time.replace(':', '')) : 900
  const startH = Math.min(Math.floor(base / 100) + 1, 18)
  const endH = Math.min(startH + 2, 19)
  emit('update:modelValue', [
    ...safeSlots.value,
    { day_of_week: d, start_time: `${String(startH).padStart(2, '0')}:00`, end_time: `${String(endH).padStart(2, '0')}:00` },
  ])
}

function updateSlot(d: number, idx: number, field: 'start_time' | 'end_time', value: string) {
  emit('update:modelValue', safeSlots.value.map(s => {
    if (s.day_of_week === d) {
      const daySlots = safeSlots.value.filter(x => x.day_of_week === d)
      const target = daySlots[idx]
      if (s === target) return { ...s, [field]: value }
    }
    return s
  }))
}

function removeSlot(d: number, idx: number) {
  const daySlots = slotsForDay(d)
  const target = daySlots[idx]
  if (!target) return
  emit('update:modelValue', safeSlots.value.filter(s => s !== target))
}

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function validateDay(d: number) {
  const slots = slotsForDay(d)
  const errors: { index: number; message: string }[] = []

  const sorted = slots.map((s, i) => ({ ...s, index: i })).sort((a, b) => toMin(a.start_time) - toMin(b.start_time))

  for (const s of sorted) {
    if (toMin(s.start_time) >= toMin(s.end_time)) {
      errors.push({ index: s.index, message: 'Inicio debe ser anterior al fin' })
    } else if (toMin(s.end_time) - toMin(s.start_time) < 30) {
      errors.push({ index: s.index, message: 'Mínimo 30 minutos' })
    }
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i]
    const next = sorted[i + 1]
    if (toMin(curr.end_time) > toMin(next.start_time)) {
      if (!errors.some(e => e.index === curr.index && e.message.includes('superpone'))) {
        errors.push({ index: curr.index, message: 'Se superpone con el siguiente' })
      }
      if (!errors.some(e => e.index === next.index && e.message.includes('superpone'))) {
        errors.push({ index: next.index, message: 'Se superpone con el anterior' })
      }
    }
  }

  const totalMin = slots.reduce((sum, s) => {
    if (toMin(s.start_time) >= toMin(s.end_time)) return sum
    return sum + (toMin(s.end_time) - toMin(s.start_time))
  }, 0)
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  const duration = hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`

  return { errors, duration, valid: errors.length === 0 }
}

const daySummaries = computed(() => {
  return DAYS.map(day => ({
    ...day,
    active: isActive(day.value),
    slots: slotsForDay(day.value),
    validation: isActive(day.value) ? validateDay(day.value) : null,
  }))
})

const activeDaysCount = computed(() => DAYS.filter(d => isActive(d.value)).length)

const allValid = computed(() => {
  return DAYS.filter(d => isActive(d.value)).every(d => validateDay(d.value).valid)
})

const totalSummary = computed(() => {
  let total = 0
  for (const s of safeSlots.value) {
    if (toMin(s.start_time) < toMin(s.end_time)) total += toMin(s.end_time) - toMin(s.start_time)
  }
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ''}` : `${m}min`
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <label class="label !mb-0">Días y horarios de atención</label>
        <p v-if="activeDaysCount > 0" class="text-xs text-slate-400 mt-0.5">
          {{ activeDaysCount }} día{{ activeDaysCount !== 1 ? 's' : '' }} · {{ totalSummary }} semanales
        </p>
      </div>
      <div v-if="!allValid && activeDaysCount > 0"
        class="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
        Corregí errores para guardar
      </div>
    </div>

    <!-- Day toggles -->
    <div class="flex flex-wrap gap-1.5 mb-4">
      <button
        v-for="day in daySummaries"
        :key="day.value"
        type="button"
        class="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-150"
        :class="day.active
          ? day.validation?.valid
            ? 'bg-primary-50 text-primary-700 border-primary-300 shadow-sm'
            : 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm'
          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-500'"
        @click="toggleDay(day.value)"
      >
        <div
          class="w-2 h-2 rounded-full transition-colors duration-150"
          :class="day.active
            ? day.validation?.valid ? 'bg-primary-500' : 'bg-amber-500'
            : 'bg-slate-200'"
        />
        <span>{{ day.short }}</span>
        <span
          v-if="day.active"
          class="text-[11px] font-semibold ml-0.5"
          :class="day.validation?.valid ? 'text-primary-400' : 'text-amber-400'"
        >({{ day.slots.length }})</span>
      </button>
    </div>

    <!-- Active day editors -->
    <div v-if="activeDaysCount > 0" class="space-y-3">
      <div
        v-for="day in daySummaries.filter(d => d.active)"
        :key="day.value"
        class="rounded-xl border bg-white overflow-hidden transition-all duration-150"
        :class="day.validation?.valid ? 'border-slate-200' : 'border-amber-200 bg-amber-50/30'"
      >
        <!-- Day header + presets -->
        <div class="flex items-center justify-between px-4 pt-3 pb-2">
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-semibold text-slate-800">{{ day.label }}</h4>
            <span
              v-if="day.validation?.valid"
              class="text-xs text-success-600 bg-success-50 px-2 py-0.5 rounded-full font-medium"
            >{{ day.validation.duration }}</span>
            <span
              v-else
              class="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium"
            >Revisar</span>
          </div>
          <div class="flex gap-1">
            <button
              class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition"
              :class="day.validation?.valid
                ? 'text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                : 'text-slate-300 border-slate-200 cursor-not-allowed'"
              :disabled="!day.validation?.valid"
              @click="setPreset(day.value, 'morning')"
            >
              <Sun class="w-3 h-3" /> Mañana
            </button>
            <button
              class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition"
              :class="day.validation?.valid
                ? 'text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                : 'text-slate-300 border-slate-200 cursor-not-allowed'"
              :disabled="!day.validation?.valid"
              @click="setPreset(day.value, 'afternoon')"
            >
              <Moon class="w-3 h-3" /> Tarde
            </button>
            <button
              class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition"
              :class="day.validation?.valid
                ? 'text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                : 'text-slate-300 border-slate-200 cursor-not-allowed'"
              :disabled="!day.validation?.valid"
              @click="setPreset(day.value, 'full')"
            >
              <SunMoon class="w-3 h-3" /> Completo
            </button>
          </div>
        </div>

        <!-- Slots -->
        <div class="px-4 pb-3 space-y-1.5">
          <div
            v-for="(slot, si) in day.slots"
            :key="si"
            class="flex items-center gap-2 rounded-lg px-3 py-2 border transition"
            :class="day.validation?.errors.find(e => e.index === si)
              ? 'bg-error-50/50 border-error-200'
              : 'bg-slate-50 border-slate-100'"
          >
            <Clock class="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div class="flex items-center gap-1">
              <input
                type="time"
                :value="slot.start_time"
                class="w-[90px] text-sm text-slate-700 bg-white rounded-md border px-2 py-1.5 font-mono outline-none transition"
                :class="day.validation?.errors.find(e => e.index === si)
                  ? 'border-error-300 ring-1 ring-error-200'
                  : 'border-slate-200 focus:border-primary-400'"
                @input="updateSlot(day.value, si, 'start_time', ($event.target as HTMLInputElement).value)"
              />
              <span class="text-slate-300 text-sm">→</span>
              <input
                type="time"
                :value="slot.end_time"
                class="w-[90px] text-sm text-slate-700 bg-white rounded-md border px-2 py-1.5 font-mono outline-none transition"
                :class="day.validation?.errors.find(e => e.index === si)
                  ? 'border-error-300 ring-1 ring-error-200'
                  : 'border-slate-200 focus:border-primary-400'"
                @input="updateSlot(day.value, si, 'end_time', ($event.target as HTMLInputElement).value)"
              />
            </div>
            <button
              class="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-error-600 hover:bg-error-50 transition flex-shrink-0"
              @click="removeSlot(day.value, si)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <!-- Errors -->
          <div v-if="day.validation && day.validation.errors.length > 0" class="space-y-0.5">
            <p
              v-for="(err, ei) in day.validation.errors"
              :key="ei"
              class="flex items-center gap-1 text-xs text-error-600 ml-1"
            >
              <span class="w-1 h-1 rounded-full bg-error-400 flex-shrink-0" />
              Bloque {{ err.index + 1 }}: {{ err.message }}
            </p>
          </div>

          <!-- Add slot -->
          <button
            class="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium border border-dashed transition"
            :class="day.validation?.valid
              ? 'text-slate-400 border-slate-300 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50'
              : 'text-slate-300 border-slate-200 cursor-not-allowed'"
            :disabled="!day.validation?.valid"
            @click="addSlot(day.value)"
          >
            <Plus class="w-3.5 h-3.5" />
            Agregar bloque
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="activeDaysCount === 0"
      class="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200"
    >
      <Clock class="w-8 h-8 mx-auto text-slate-300 mb-2" />
      <p class="text-sm text-slate-400 mb-1">No hay horarios configurados</p>
      <p class="text-xs text-slate-300">Seleccioná los días que atendés arriba</p>
    </div>
  </div>
</template>
