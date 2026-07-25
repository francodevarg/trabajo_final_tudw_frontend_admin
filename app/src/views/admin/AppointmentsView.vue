<script setup lang="ts">
import { computed, onBeforeMount, onMounted, watch } from 'vue'

import AgendaToolbar from '@/components/agenda/AgendaToolbar.vue'
import TodayAgenda from '@/components/agenda/TodayAgenda.vue'
import WeekAgenda from '@/components/agenda/WeekAgenda.vue'
import MonthAgenda from '@/components/agenda/MonthAgenda.vue'
import { useAgendaNavigation } from '@/composables/useAgendaNavigation'
import { useAppointmentsStore } from '@/stores/appointments.store'
import AgendaFilters from '@/components/agenda/AgendaFilters.vue'
import { useSpecialtiesStore } from '@/stores/specialties.store'
import { CalendarDays } from 'lucide-vue-next'
import { useInsurancesStore } from '@/stores/insurances.store'
import { useDoctorsStore } from '@/stores/doctors.store'
import { useAuthStore } from '@/stores/auth.store'
const auth = useAuthStore()
const navigation = useAgendaNavigation()
const appointments = useAppointmentsStore()
const specialties = useSpecialtiesStore()
const insurances = useInsurancesStore()
const doctors = useDoctorsStore()

onMounted(async () => {    
    const { from, to } = navigation.getRange()
  if(auth.userGroup == 'ADMIN'){
    appointments.fetchAppointments(from, to)
    await specialties.fetchAll()
    await insurances.fetchAll()
    await doctors.fetchAll()
  }else{
    appointments.fetchAppointments(from, to)

  }
})

watch(
  [navigation.viewMode, navigation.selectedDate],
  () => {
    const { from, to } = navigation.getRange()
    appointments.fetchAppointments(from, to)
  },
  {
    immediate: true,
  }
)

const currentView = computed(() => {
  switch (navigation.viewMode.value) {
    case navigation.AGENDA_VIEW.MONTH:
      return MonthAgenda

    case navigation.AGENDA_VIEW.DAY:
      return TodayAgenda

    case navigation.AGENDA_VIEW.WEEK:
      return WeekAgenda

    default:
      return TodayAgenda
  }
})
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
        <CalendarDays class="w-5 h-5 text-primary-600" />
      </div>

      <div>
        <h1 class="text-xl font-semibold text-slate-900">Turnos</h1>
        <p class="text-xs text-slate-400">
          {{ appointments.filteredAppointments.length }} turnos
        </p>
      </div>
    </div>
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <AgendaToolbar :view-mode="navigation.viewMode.value" :date-range-label="navigation.dateRangeLabel.value"
        :is-today="navigation.isToday.value" @view-change="navigation.setView" @prev="navigation.goPrev"
        @next="navigation.goNext" @today="navigation.goToday" />

      <AgendaFilters
        :specialties="specialties.items"
        :specialty-id="appointments.filters.specialtyId"
        @specialty-change="appointments.filters.specialtyId = $event"
      />
    </div>

    <div v-if="appointments.appointments.length === 0" class="py-10 text-center">
      <p class="text-sm text-slate-400">
        No hay turnos para el rango seleccionado
      </p>
    </div>
    <Transition name="fade" mode="out-in" >
      <component
        v-if="appointments.appointments.length !==0"
        :is="currentView"
        :key="navigation.viewMode.value"
        :appointments="appointments.filteredAppointments"
        :selected-date="navigation.selectedDate.value"
        @prev="navigation.goPrev"
        @next="navigation.goNext"
      />
    </Transition>
  </div>
</template>