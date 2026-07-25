<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import AppointmentCard from './AppointmentCard.vue'
import { useDateLocale } from '@/composables/useDateLocale'
import { groupByTime } from '@/composables/useGroupedByTime'
import type { AppointmentReadDTO } from '@/types/appointment/appointment.dto.ts'

const props = defineProps<{
  open: boolean
  date: string
  appointments: AppointmentReadDTO[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { formatDayLabel } = useDateLocale()


const title = computed(() => {
  const label = formatDayLabel(props.date)

  return label.charAt(0).toUpperCase() + label.slice(1)
})


const groupedAppointments = computed(() =>
  groupByTime(props.appointments)
)


function close() {
  emit('close')
}
</script>


<template>
  <Transition name="fade">

    <div v-if="open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

      <!-- overlay -->
      <div class="absolute inset-0 bg-black/30" @click="close" />


      <!-- modal -->
      <div class="relative w-full sm:max-w-lg xl:max-w-[720px] bg-white rounded-t-2xl sm:rounded-xl shadow-xl overflow-hidden">

        <!-- header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">

          <div>

            <h2 class="text-base font-semibold text-slate-900">
              {{ title }}
            </h2>

            <p class="text-xs text-slate-400 mt-0.5">
              {{ appointments.length }}
              turno{{ appointments.length !== 1 ? 's' : '' }}
              programado{{ appointments.length !== 1 ? 's' : '' }}
            </p>

          </div>


          <button class="p-2 rounded-lg hover:bg-slate-100 text-slate-400" @click="close">
            <X class="w-5 h-5" />
          </button>

        </div>



        <!-- contenido -->
        <div class="p-5 space-y-5 overflow-y-auto max-h-[70vh]">

          <!-- sin turnos -->
          <div v-if="appointments.length === 0" class="py-8 text-center">

            <p class="text-sm text-slate-400">
              No hay turnos para este día
            </p>

          </div>



          <!-- timeline -->
          <div v-else class="relative">

            <div class="absolute left-[58px] top-3 bottom-3 w-px bg-slate-200" />


            <div class="space-y-6">

              <div v-for="[time, items] in groupedAppointments" :key="time" class="relative pl-[75px]">

                <!-- hora -->
                <span
                  class="absolute left-0 top-1 text-sm font-semibold text-slate-700 w-[45px] text-right tabular-nums">
                  {{ time }}
                </span>


                <!-- punto -->
                <div
                  class="absolute left-[53px] top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary-500 z-10" />


                <div class="space-y-2">

                  <AppointmentCard v-for="appointment in items" :key="appointment.id" :appt="appointment" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </Transition>
</template>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
