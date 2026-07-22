<script setup lang="ts">
import { X, User, Calendar, Stethoscope } from 'lucide-vue-next'
import type { Patient } from '@/types'
import PatientAvatar from './PatientAvatar.vue'

defineProps<{
  open: boolean
  patient: Patient | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function sexLabel(sex: string): string {
  const map: Record<string, string> = { M: 'Masculino', F: 'Femenino' }
  return map[sex] || sex
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    scheduled: 'Programado',
    completed: 'Completado',
    cancelled: 'Cancelado',
    no_show: 'No asistió',
  }
  return map[status] || status
}

function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    scheduled: 'bg-primary-50 text-primary-700',
    completed: 'bg-success-50 text-success-700',
    cancelled: 'bg-slate-100 text-slate-500',
    no_show: 'bg-warning-50 text-warning-700',
  }
  return map[status] || 'bg-slate-100 text-slate-500'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open && patient"
        class="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
        @click.self="emit('close')"
      >
        <div
          class="dialog bg-white w-full sm:min-w-[500px] sm:max-w-[640px] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden min-h-[200px] h-full sm:h-auto sm:max-h-[90dvh]"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
            <div class="flex items-center gap-4">
              <PatientAvatar
                :first-name="patient.first_name"
                :last-name="patient.last_name"
                size="lg"
              />
              <div>
                <h2 class="text-lg font-semibold text-slate-900">{{ patient.full_name }}</h2>
                <div class="flex items-center gap-3 mt-0.5">
                  <code class="text-xs text-slate-500 bg-slate-100 rounded-md px-2 py-0.5">DNI {{ patient.dni }}</code>
                  <span class="text-xs text-slate-400">{{ patient.age }} años</span>
                  <span class="text-xs text-slate-400">·</span>
                  <span class="text-xs text-slate-400">{{ sexLabel(patient.sex) }}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Cerrar"
              class="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              @click="emit('close')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-5">
            <!-- Personal Information -->
            <div class="rounded-xl border border-slate-200 p-5">
              <h3 class="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User class="w-4 h-4 text-slate-400" />
                Información Personal
              </h3>
              <dl class="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <dt class="text-[11px] text-slate-400 uppercase tracking-wider">Nombre</dt>
                  <dd class="text-sm font-medium text-slate-700">{{ patient.first_name }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400 uppercase tracking-wider">Apellido</dt>
                  <dd class="text-sm font-medium text-slate-700">{{ patient.last_name }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400 uppercase tracking-wider">DNI</dt>
                  <dd class="text-sm font-medium text-slate-700">{{ patient.dni }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400 uppercase tracking-wider">Edad</dt>
                  <dd class="text-sm font-medium text-slate-700">{{ patient.age }} años</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400 uppercase tracking-wider">Sexo</dt>
                  <dd class="text-sm font-medium text-slate-700">{{ sexLabel(patient.sex) }}</dd>
                </div>
              </dl>
            </div>

            <!-- Last Appointment -->
            <div class="rounded-xl border border-slate-200 p-5">
              <h3 class="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-slate-400" />
                Último Turno
              </h3>
              <div v-if="patient.last_appointment" class="flex items-center gap-4">
                <div class="rounded-lg bg-slate-50 px-4 py-3">
                  <p class="text-sm font-medium text-slate-800">{{ formatDate(patient.last_appointment.date) }}</p>
                </div>
                <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium', statusBadgeClass(patient.last_appointment.status)]">
                  {{ statusLabel(patient.last_appointment.status) }}
                </span>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-8 text-center">
                <Stethoscope class="w-8 h-8 text-slate-300 mb-2" />
                <p class="text-xs text-slate-400">Sin turnos registrados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .dialog,
.modal-leave-active .dialog {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .dialog,
.modal-leave-to .dialog {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>
