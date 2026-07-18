<script setup lang="ts">
import CalendarDay from './CalendarDay.vue'
import DayDetailModal from './DayDetailModal.vue'
import { useCalendarMonth } from '@/composables/useCalendarMonth'
import type { Appointment } from '@/types'
import { computed, ref } from 'vue';

const props = defineProps<{
    appointments: Appointment[]
}>()


const weekHeaders = [
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb',
    'Dom',
]

const selectedAppointments = computed(() => {
    if (!selectedDate.value) {
        return []
    }

    return props.appointments.filter(
        appointment => appointment.date === selectedDate.value
    )
})

const monthDays = useCalendarMonth(
    () => props.appointments
)
const selectedDate = ref<string | null>(null)
const showModal = ref(false)

function openDay(date: string) {
    selectedDate.value = date
    showModal.value = true
}

</script>

<template>
    <div>

        <div class="bg-white rounded-xl shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)]">

            <div class="grid grid-cols-7 border-b border-slate-100">

                <div v-for="day in weekHeaders" :key="day"
                    class="px-1.5 py-1.5 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {{ day }}
                </div>

            </div>


            <div class="grid grid-cols-7 p-1 gap-px">

                <CalendarDay v-for="cell in monthDays" :key="cell.date" :date="cell.date" :day-number="cell.dayNumber"
                    :items="cell.items" :count="cell.count" :is-today="cell.isToday"
                    :is-current-month="cell.isCurrentMonth" @select="openDay" />

            </div>

        </div>


        <DayDetailModal v-if="selectedDate" :date="selectedDate" :appointments="selectedAppointments"
            v-model:open="showModal" @close="showModal = false" />

    </div>
</template>