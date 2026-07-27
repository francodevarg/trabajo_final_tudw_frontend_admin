<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Loader2, Inbox, FileText, Stethoscope, Calendar, Pill } from 'lucide-vue-next'
import { useDoctorAppointmentHistoryStore } from '@/stores/doctor-appointment-history.store'
import { useDateLocale } from '@/composables/useDateLocale'
import type { PatientHistoryItem } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useDoctorAppointmentHistoryStore()
const { formatDate } = useDateLocale()

const patientId = computed(() => Number(route.params.patientId))

const groupedByDate = computed(() => {
  const groups = new Map<string, PatientHistoryItem[]>()
  for (const item of store.patientHistory) {
    const key = item.date
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  }
  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a))
})

onMounted(() => {
  store.fetchPatientHistory(patientId.value)
})

function goBack() {
  router.push({ name: 'doctor-historial' })
}

function formatDayLabel(dateStr: string): string {
  return formatDate(dateStr, "EEEE d 'de' MMMM, yyyy")
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <button
        class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        @click="goBack"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Historia Clínica</h1>
        <p class="text-xs text-slate-400">Evolución clínica del paciente</p>
      </div>
    </div>

    <div v-if="store.historyLoading" class="flex items-center justify-center py-20">
      <Loader2 class="w-6 h-6 text-primary-500 animate-spin" />
    </div>

    <div v-else-if="store.patientHistory.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Inbox class="w-7 h-7 text-slate-400" />
      </div>
      <p class="text-sm font-medium text-slate-600">No hay registros clínicos</p>
      <p class="text-xs text-slate-400 mt-1">Este paciente aún no tiene evoluciones registradas.</p>
    </div>

    <div v-else class="relative">
      <div class="absolute left-[27px] top-4 bottom-4 w-px bg-slate-200 pointer-events-none" />

      <div class="space-y-8">
        <div v-for="[date, items] in groupedByDate" :key="date" class="relative pl-[58px]">
          <div class="absolute left-0 top-0 w-[42px] text-right">
            <div class="w-[54px] h-[54px] rounded-xl bg-primary-50 border-2 border-primary-200 flex items-center justify-center -ml-[1px] z-10 relative">
              <Calendar class="w-5 h-5 text-primary-600" />
            </div>
          </div>

          <div class="pt-1">
            <h3 class="text-sm font-semibold text-slate-900 capitalize mb-4">
              {{ formatDayLabel(date) }}
            </h3>

            <div class="space-y-4">
              <div
                v-for="item in items"
                :key="item.evolution_id"
                class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex items-start gap-3 mb-3">
                  <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Stethoscope class="w-4 h-4 text-blue-600" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-slate-800">
                      {{ item.doctor }} — <span class="text-slate-500">{{ item.specialty }}</span>
                    </p>
                  </div>
                </div>

                <div class="space-y-3 ml-11">
                  <div v-if="item.reason" class="flex items-start gap-2">
                    <FileText class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Motivo de consulta</p>
                      <p class="text-sm text-slate-700 mt-0.5">{{ item.reason }}</p>
                    </div>
                  </div>

                  <div v-if="item.diagnosis" class="flex items-start gap-2">
                    <FileText class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Diagnóstico</p>
                      <p class="text-sm text-slate-700 mt-0.5">{{ item.diagnosis }}</p>
                    </div>
                  </div>

                  <div v-if="item.treatment" class="flex items-start gap-2">
                    <Pill class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Tratamiento</p>
                      <p class="text-sm text-slate-700 mt-0.5 whitespace-pre-line">{{ item.treatment }}</p>
                    </div>
                  </div>

                  <div v-if="item.notes" class="flex items-start gap-2">
                    <FileText class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Notas</p>
                      <p class="text-sm text-slate-700 mt-0.5 whitespace-pre-line">{{ item.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
