<script setup lang="ts">
import { watch, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import AppModal from '@/components/AppModal.vue'
import type { AppointmentReadDTO } from '@/types/appointment'
import type { EvolutionReadDTO } from '@/types/evolution'
import { useEvolutionsStore } from '@/stores/evolutions.store'
import { ClipboardList, Stethoscope, Pill, StickyNote, Calendar } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  appointment: AppointmentReadDTO
  mode: 'create' | 'view'
  evolution?: EvolutionReadDTO | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const evolutionsStore = useEvolutionsStore()

const schema = yup.object({
  reason: yup.string().trim().required('El motivo de consulta es obligatorio'),
  diagnosis: yup.string().trim().required('El diagnóstico es obligatorio'),
  treatment: yup.string().trim().required('El tratamiento es obligatorio'),
  notes: yup.string().trim().default('')
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    reason: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  }
})

const { value: reason, errorMessage: reasonError } = useField<string>('reason')
const { value: diagnosis, errorMessage: diagnosisError } = useField<string>('diagnosis')
const { value: treatment, errorMessage: treatmentError } = useField<string>('treatment')
const { value: notes } = useField<string>('notes')

const title = computed(() =>
  props.mode === 'create' ? 'Registrar evolución' : 'Evolución clínica'
)

const isSubmitting = computed(() => evolutionsStore.loading)

watch(() => props.open, (open) => {
  if (open && props.mode === 'create') {
    resetForm()
  }
})

const onSubmit = handleSubmit(async (values) => {
  const result = await evolutionsStore.createEvolution({
    appointment: props.appointment.id,
    reason: values.reason,
    diagnosis: values.diagnosis,
    treatment: values.treatment,
    notes: values.notes
  })

  if (result) {
    emit('created')
    emit('close')
  }
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <AppModal :open="open" :title="title" max-width="sm:max-w-lg" @close="emit('close')">
    <div class="space-y-5">

      <!-- Paciente -->
      <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
        <div class="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
          <span class="text-sm font-bold text-primary-700">
            {{ appointment.patient_detail.first_name[0] }}{{ appointment.patient_detail.last_name[0] }}
          </span>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-900">
            {{ appointment.patient_detail.first_name }} {{ appointment.patient_detail.last_name }}
          </p>
          <p class="text-xs text-slate-400">
            DNI {{ appointment.patient_detail.dni }} · {{ appointment.date }} {{ appointment.time }}
          </p>
        </div>
      </div>

      <!-- CREATE MODE -->
      <form v-if="mode === 'create'" @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="label flex items-center gap-1.5">
            <ClipboardList class="w-3.5 h-3.5 text-slate-400" />
            Motivo de consulta
          </label>
          <textarea
            v-model="reason"
            rows="3"
            class="input min-h-[80px] resize-y"
            :class="{ 'border-error-300 ring-1 ring-error-200': reasonError }"
            placeholder="Describa el motivo de la consulta..."
          />
          <p v-if="reasonError" class="mt-1.5 text-xs text-error-600">{{ reasonError }}</p>
        </div>

        <div>
          <label class="label flex items-center gap-1.5">
            <Stethoscope class="w-3.5 h-3.5 text-slate-400" />
            Diagnóstico
          </label>
          <textarea
            v-model="diagnosis"
            rows="2"
            class="input min-h-[60px] resize-y"
            :class="{ 'border-error-300 ring-1 ring-error-200': diagnosisError }"
            placeholder="Diagnóstico del paciente..."
          />
          <p v-if="diagnosisError" class="mt-1.5 text-xs text-error-600">{{ diagnosisError }}</p>
        </div>

        <div>
          <label class="label flex items-center gap-1.5">
            <Pill class="w-3.5 h-3.5 text-slate-400" />
            Tratamiento
          </label>
          <textarea
            v-model="treatment"
            rows="3"
            class="input min-h-[80px] resize-y"
            :class="{ 'border-error-300 ring-1 ring-error-200': treatmentError }"
            placeholder="Tratamiento indicado..."
          />
          <p v-if="treatmentError" class="mt-1.5 text-xs text-error-600">{{ treatmentError }}</p>
        </div>

        <div>
          <label class="label flex items-center gap-1.5">
            <StickyNote class="w-3.5 h-3.5 text-slate-400" />
            Observaciones
          </label>
          <textarea
            v-model="notes"
            rows="2"
            class="input min-h-[60px] resize-y"
            placeholder="Observaciones adicionales (opcional)..."
          />
        </div>
      </form>

      <!-- VIEW MODE -->
      <div v-else-if="mode === 'view' && evolution" class="space-y-4">
        <div class="p-3 rounded-lg bg-slate-50 flex items-start gap-2">
          <Calendar class="w-4 h-4 text-slate-400 mt-0.5" />
          <div>
            <p class="text-[11px] text-slate-400 uppercase tracking-wider">Fecha de registro</p>
            <p class="text-sm text-slate-700">{{ formatDate(evolution.created_at) }}</p>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <ClipboardList class="w-4 h-4 text-slate-500" />
            <h4 class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Motivo de consulta</h4>
          </div>
          <p class="text-sm text-slate-700 leading-relaxed">{{ evolution.reason }}</p>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <Stethoscope class="w-4 h-4 text-slate-500" />
            <h4 class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Diagnóstico</h4>
          </div>
          <p class="text-sm text-slate-700 leading-relaxed">{{ evolution.diagnosis }}</p>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <Pill class="w-4 h-4 text-slate-500" />
            <h4 class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tratamiento</h4>
          </div>
          <p class="text-sm text-slate-700 leading-relaxed">{{ evolution.treatment }}</p>
        </div>

        <div v-if="evolution.notes">
          <div class="flex items-center gap-2 mb-1.5">
            <StickyNote class="w-4 h-4 text-slate-500" />
            <h4 class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Observaciones</h4>
          </div>
          <p class="text-sm text-slate-700 leading-relaxed">{{ evolution.notes }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button class="btn-ghost" @click="emit('close')">
          {{ mode === 'create' ? 'Cancelar' : 'Cerrar' }}
        </button>

        <button
          v-if="mode === 'create'"
          class="btn-primary"
          :disabled="isSubmitting"
          @click="onSubmit"
        >
          <span
            v-if="isSubmitting"
            class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
          />
          Guardar evolución
        </button>
      </div>
    </template>
  </AppModal>
</template>
