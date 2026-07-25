<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { AppointmentReadDTO } from '@/types/appointment'
import { User, CreditCard, Stethoscope, FileText, Eye } from 'lucide-vue-next'
import { getStatusConfig } from '@/types/appointment'
import AppointmentActions from './AppointmentActions.vue'
import ClinicalEvolutionModal from './ClinicalEvolutionModal.vue'
import { useEvolutionsStore } from '@/stores/evolutions.store'

const props = defineProps<{
  appt: AppointmentReadDTO
}>()

const evolutionsStore = useEvolutionsStore()

const showModal = ref(false)
const modalMode = ref<'create' | 'view'>('create')

const isCompleted = computed(() => props.appt.status === 'completed')

const hasEvolution = computed(() => evolutionsStore.hasEvolution(props.appt.id))

const currentEvolution = computed(() => {
  if (hasEvolution.value) {
    return evolutionsStore.currentEvolution?.appointment === props.appt.id
      ? evolutionsStore.currentEvolution
      : null
  }
  return null
})

watch(() => evolutionsStore.currentEvolution, (evo) => {
  if (evo && evo.appointment === props.appt.id) {
    // Already cached via store
  }
})

onMounted(async () => {
  if (isCompleted.value) {
    await evolutionsStore.fetchEvolutionByAppointment(props.appt.id)
  }
})

function openCreate() {
  modalMode.value = 'create'
  showModal.value = true
}

function openView() {
  modalMode.value = 'view'
  showModal.value = true
}

function onCreated() {
  evolutionsStore.fetchEvolutionByAppointment(props.appt.id)
}

function formatDni(dni: number): string {
  const s = String(dni).padStart(8, '0')
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5)}`
}
</script>

<template>
  <div>
    <div class="rounded-xl bg-white px-4 py-3 sm:px-5 transition-all duration-150 hover:bg-slate-50 hover:shadow-md">

      <!-- Mobile: stacked layout -->
      <div class="flex flex-col gap-2 sm:hidden">
        <!-- Row 1: Patient + Status -->
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <User class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span class="text-sm font-semibold text-slate-900 truncate">
                {{ appt.patient_detail.first_name }} {{ appt.patient_detail.last_name }}
              </span>
            </div>
            <div class="flex items-center gap-1 text-xs text-slate-400 mt-0.5 pl-5">
              <CreditCard class="w-3 h-3 flex-shrink-0" />
              {{ formatDni(appt.patient_detail.dni) }}
            </div>
            <div v-if="isCompleted" class="mt-1 pl-5">
              <button
                v-if="!hasEvolution"
                class="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                @click.stop="openCreate"
              >
                <FileText class="w-3 h-3" />
                Registrar evolución
              </button>
              <button
                v-else
                class="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                @click.stop="openView"
              >
                <Eye class="w-3 h-3" />
                Ver evolución
              </button>
            </div>
          </div>
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap bg-slate-100 text-slate-600 flex-shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {{ getStatusConfig(appt.status).label }}
          </span>
        </div>

        <!-- Row 2: Doctor + Actions -->
        <div class="flex items-center justify-between gap-2 pl-5">
          <div class="flex items-center gap-1.5 min-w-0">
            <Stethoscope class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span class="text-xs text-slate-700 truncate">
              {{ appt.doctor_detail.first_name }} {{ appt.doctor_detail.last_name }}
            </span>
            <span class="text-xs text-slate-400">—</span>
            <span class="text-xs text-slate-400 truncate">
              {{ appt.doctor_detail.specialty.name }}
            </span>
          </div>

          <AppointmentActions :appointment="appt" />
        </div>
      </div>

      <!-- Desktop: horizontal layout -->
      <div class="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4">

        <!-- Patient -->
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <User class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span class="text-sm font-semibold text-slate-900 truncate">
              {{ appt.patient_detail.first_name }} {{ appt.patient_detail.last_name }}
            </span>
          </div>
          <div class="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span class="inline-flex items-center gap-1">
              <CreditCard class="w-3 h-3" />
              {{ formatDni(appt.patient_detail.dni) }}
            </span>
            <template v-if="isCompleted">
              <button
                v-if="!hasEvolution"
                class="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                @click.stop="openCreate"
              >
                <FileText class="w-3 h-3" />
                Registrar evolución
              </button>
              <button
                v-else
                class="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition-colors"
                @click.stop="openView"
              >
                <Eye class="w-3 h-3" />
                Ver evolución
              </button>
            </template>
          </div>
        </div>

        <!-- Doctor -->
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <Stethoscope class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span class="text-sm text-slate-700 truncate">
              {{ appt.doctor_detail.first_name }} {{ appt.doctor_detail.last_name }}
            </span>
          </div>
          <div class="text-xs text-slate-400 mt-1 pl-5">
            {{ appt.doctor_detail.specialty.name }}
          </div>
        </div>

        <!-- Status -->
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap justify-self-end"
          :class="getStatusConfig(appt.status).class">

          <component :is="getStatusConfig(appt.status).icon" class="h-5 w-5"></component>

          {{ getStatusConfig(appt.status).label }}
        </span>

        <!-- Actions -->
        <AppointmentActions :appointment="appt" />
      </div>
    </div>
  </div>

  <ClinicalEvolutionModal
    :open="showModal"
    :appointment="appt"
    :mode="modalMode"
    :evolution="currentEvolution"
    @close="showModal = false"
    @created="onCreated"
  />
</template>
