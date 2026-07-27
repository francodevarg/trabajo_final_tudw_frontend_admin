<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { History, Inbox } from 'lucide-vue-next'
import { useDoctorAppointmentHistoryStore } from '@/stores/doctor-appointment-history.store'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import AppointmentHistoryHeader from '@/components/doctor/AppointmentHistoryHeader.vue'
import AppointmentHistoryRow from '@/components/doctor/AppointmentHistoryRow.vue'

const router = useRouter()
const store = useDoctorAppointmentHistoryStore()

const DATE_FORMAT = 'yyyy-MM-dd'
const now = new Date()
const dateFrom = ref(format(startOfMonth(now), DATE_FORMAT))
const dateTo = ref(format(endOfMonth(now), DATE_FORMAT))

function fetchAppointments() {
  store.fetchAppointments(dateFrom.value, dateTo.value)
}

function onDateChange(from: string, to: string) {
  if (from) dateFrom.value = from
  if (to) dateTo.value = to
  fetchAppointments()
}

onMounted(() => {
  fetchAppointments()
})

function viewHistory(patientId: number) {
  router.push({ name: 'doctor-paciente-historial', params: { patientId } })
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
        <History class="w-5 h-5 text-primary-600" />
      </div>
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Historial de Turnos</h1>
        <p class="text-xs text-slate-400">Turnos del último mes</p>
      </div>
    </div>

    <AppointmentHistoryHeader
      :patients="store.uniquePatients"
      :patient-id="store.filters.patientId"
      :date-from="dateFrom"
      :date-to="dateTo"
      :total="store.filteredAppointments.length"
      :loading="store.loading"
      @patient-change="store.filters.patientId = $event"
      @date-change="onDateChange"
    />

    <div v-if="store.loading" class="space-y-3 mt-4">
      <div v-for="i in 6" :key="i" class="h-16 bg-slate-100 rounded-xl animate-pulse" />
    </div>

    <div v-else-if="store.filteredAppointments.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Inbox class="w-7 h-7 text-slate-400" />
      </div>
      <p class="text-sm font-medium text-slate-600">No se encontraron turnos</p>
      <p class="text-xs text-slate-400 mt-1">Intentá ajustar los filtros de búsqueda.</p>
    </div>

    <div v-else class="overflow-hidden rounded-xl border border-slate-200 bg-white mt-2">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/80">
            <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Paciente</th>
            <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Médico</th>
            <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">Fecha</th>
            <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">Hora</th>
            <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Estado</th>
            <th class="text-right px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider w-24">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <AppointmentHistoryRow
            v-for="appointment in store.filteredAppointments"
            :key="appointment.id"
            :appointment="appointment"
            @view-history="viewHistory"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
