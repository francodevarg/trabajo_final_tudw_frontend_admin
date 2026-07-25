<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { DoctorDTO, DoctorWriteDTO, DoctorAvailabilityDTO } from '@/types'
import { useInsurancesStore } from '@/stores/insurances.store'
import { useSpecialtiesStore } from '@/stores/specialties.store'
import DoctorAvailabilityEditor from './DoctorAvailabilityEditor.vue'
import StepIndicator from '@/components/StepIndicator.vue'

const props = defineProps<{
  initial?: DoctorDTO | null
  emailError?: string | null
  mode?: 'create' | 'edit' | 'self-edit'
}>()

const emit = defineEmits<{
  (e: 'submit', payload: DoctorWriteDTO): void
}>()

const insurancesStore = useInsurancesStore()
const specialtiesStore = useSpecialtiesStore()

onMounted(() => {
  insurancesStore.fetchAll()
  specialtiesStore.fetchAll()
})

/* ── Yup schemas per step ── */

const personalSchema = yup.object({
  first_name: yup.string().trim().required('El nombre es obligatorio'),
  last_name: yup.string().trim().required('El apellido es obligatorio'),
  email: yup.string().trim().required('El email es obligatorio').email('Email inválido'),
  phone: yup.string().trim().default(''),
})

const professionalSchema = yup.object({
  specialty_id: yup.number().required('Seleccioná una especialidad'),
  license_number: yup.string().trim().required('La matrícula es obligatoria'),
  consultation_fee: yup.string().trim().default(''),
  description: yup.string().trim().default(''),
})

const insuranceSchema = yup.object({
  insurance_ids: yup.array().of(yup.number().required()).min(1, 'Seleccioná al menos una obra social').required(),
})

const availabilitySchema = yup.object({
  availabilities: yup.array().of(
    yup.object({
      day_of_week: yup.number().required(),
      start_time: yup.string().required(),
      end_time: yup.string().required(),
    })
  ).min(1, 'Agregá al menos un horario').required(),
})

/* ── Form ── */

const { handleSubmit, values, setFieldError, setFieldValue, resetForm, validate } = useForm<DoctorWriteDTO>({
  validationSchema: personalSchema,
  initialValues: {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialty_id: undefined,
    license_number: '',
    consultation_fee: 0,
    description: '',
    insurance_ids: [],
    availabilities: [],
  },
})

const { value: firstName, errorMessage: firstNameError } = useField<string>('first_name')
const { value: lastName, errorMessage: lastNameError } = useField<string>('last_name')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: phone } = useField<string>('phone')
const { value: specialtyId, errorMessage: specialtyIdError } = useField<number | undefined>('specialty_id')
const { value: licenseNumber, errorMessage: licenseNumberError } = useField<string>('license_number')
const { value: consultationFee } = useField<string>('consultation_fee')
const { value: description } = useField<string>('description')
const { value: insuranceIds } = useField<number[]>('insurance_ids')
const { value: availabilities } = useField<DoctorAvailabilityDTO[]>('availabilities')

/* ── Mode helpers ── */

const isSelfEdit = computed(() => props.mode === 'self-edit')
const isEmailDisabled = computed(() => !!props.initial || isSelfEdit.value)

/* ── Server-side email error ── */

watch(() => props.emailError, (err) => {
  if (err) setFieldError('email', err)
})

/* ── Populate from initial (edit mode) ── */

/* ── Step state ── */

const STEP_LABELS = ['Personal', 'Profesional', 'Obras sociales', 'Disponibilidad']
const STEP_SCHEMAS = [personalSchema, professionalSchema, insuranceSchema, availabilitySchema]
const currentStep = ref(0)
const stepErrors = ref<string[]>([])

watch(() => props.initial, (v) => {
  if (v) {
    const specId = Number(v.specialty.id)
    resetForm({
      values: {
        first_name: v.first_name ?? '',
        last_name: v.last_name ?? '',
        email: v.email ?? '',
        phone: v.phone ?? '',
        specialty_id: specId,
        license_number: v.license_number ?? '',
        consultation_fee: Number(v.consultation_fee) ?? 0,
        description: v.description ?? '',
        insurance_ids: v.insurances?.map(i => i.id).filter((id): id is number => id != null) ?? [],
        availabilities: v.availabilities?.map(a => ({ ...a })) ?? [],
      },
    })
    nextTick(() => {
      setFieldValue('specialty_id', specId)
    })
  } else {
    resetForm()
    currentStep.value = 0
  }
}, { immediate: true })



async function validateCurrentStep(): Promise<boolean> {
  stepErrors.value = []
  try {
    await STEP_SCHEMAS[currentStep.value].validate(values, { abortEarly: false })
    return true
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      stepErrors.value = err.errors
    }
    return false
  }
}

async function nextStep() {
  const valid = await validateCurrentStep()
  if (valid && currentStep.value < STEP_LABELS.length - 1) {
    currentStep.value++
    stepErrors.value = []
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
    stepErrors.value = []
  }
}

/* ── Insurance toggle ── */

function toggleInsurance(id: number) {
  const idx = insuranceIds.value.indexOf(id)
  if (idx === -1) {
    insuranceIds.value.push(id)
  } else {
    insuranceIds.value = insuranceIds.value.filter(i => i !== id)
  }
}

function isInsuranceSelected(id: number) {
  return insuranceIds.value.includes(id)
}

/* ── Submit ── */

const onSubmit = handleSubmit((formValues) => {
  const payload: DoctorWriteDTO = {
    first_name: formValues.first_name?.trim() || undefined,
    last_name: formValues.last_name?.trim() || undefined,
    email: isSelfEdit.value ? undefined : formValues.email?.trim() || undefined,
    specialty_id: formValues.specialty_id || undefined,
    insurance_ids: formValues.insurance_ids?.length ? formValues.insurance_ids : undefined,
    license_number: formValues.license_number?.trim() || undefined,
    phone: formValues.phone?.trim() || undefined,
    description: formValues.description?.trim() || undefined,
    consultation_fee: formValues.consultation_fee || undefined,
    availabilities: formValues.availabilities?.length ? formValues.availabilities : undefined,
  }
  emit('submit', payload)
})

async function submit() {
  const allValid = await validate()
  if (!allValid.valid) {
    currentStep.value = 0
    return
  }
  onSubmit()
}

defineExpose({ submit })
</script>

<template>
  <div class="space-y-5">
    <StepIndicator :steps="STEP_LABELS" :current="currentStep" />

    <!-- Step 1: Personal info -->
    <div v-if="currentStep === 0" class="space-y-4 animate-fade-in">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="label" for="wiz-first-name">Nombre</label>
          <input id="wiz-first-name" v-model="firstName" type="text" class="input"
            :class="{ 'border-error-300 ring-1 ring-error-200': firstNameError }" placeholder="Ej: Franco" />
          <p v-if="firstNameError" class="mt-1.5 text-xs text-error-600">{{ firstNameError }}</p>
        </div>
        <div>
          <label class="label" for="wiz-last-name">Apellido</label>
          <input id="wiz-last-name" v-model="lastName" type="text" class="input"
            :class="{ 'border-error-300 ring-1 ring-error-200': lastNameError }" placeholder="Ej: Dev" />
          <p v-if="lastNameError" class="mt-1.5 text-xs text-error-600">{{ lastNameError }}</p>
        </div>
      </div>
      <div>
        <label class="label" for="wiz-email">Email</label>
        <input id="wiz-email" v-model="email" type="email" class="input" :class="{
          'opacity-60 cursor-not-allowed': isEmailDisabled,
          'border-error-300 ring-1 ring-error-200': emailError,
        }" :disabled="isEmailDisabled" placeholder="medico@correo.com" />
        <p v-if="emailError" class="mt-1.5 text-xs text-error-600">{{ emailError }}</p>
      </div>
      <div>
        <label class="label" for="wiz-phone">Teléfono</label>
        <input id="wiz-phone" v-model="phone" type="tel" class="input" placeholder="+54 11 1234-5678" />
      </div>
    </div>

    <!-- Step 2: Professional info -->
    <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="label" for="wiz-specialty">Especialidad</label>
          <select id="wiz-specialty" v-model="specialtyId" class="input"
            :class="{ 'border-error-300 ring-1 ring-error-200': specialtyIdError }">
            <option :value="undefined" disabled>Seleccionar</option>
            <option v-for="s in specialtiesStore.items" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
          <p v-if="specialtyIdError" class="mt-1.5 text-xs text-error-600">{{ specialtyIdError }}</p>
        </div>
        <div>
          <label class="label" for="wiz-license">Matrícula</label>
          <input id="wiz-license" v-model="licenseNumber" type="text" class="input"
            :class="{ 'border-error-300 ring-1 ring-error-200': licenseNumberError }" placeholder="MP-12345" />
          <p v-if="licenseNumberError" class="mt-1.5 text-xs text-error-600">{{ licenseNumberError }}</p>
        </div>
      </div>
      <div>
        <label class="label" for="wiz-fee">Honorarios de consulta</label>
        <input id="wiz-fee" v-model="consultationFee" type="text" class="input" placeholder="$ 15000" />
      </div>
      <div>
        <label class="label" for="wiz-desc">Descripción</label>
        <textarea id="wiz-desc" v-model="description" class="input min-h-[80px] resize-y"
          placeholder="Breve descripción profesional..." />
      </div>
    </div>

    <!-- Step 3: Insurances -->
    <div v-if="currentStep === 2" class="space-y-4 animate-fade-in">
      <label class="label">Obras sociales</label>
      <div v-if="insurancesStore.loading" class="text-xs text-slate-400">Cargando...</div>
      <div v-else-if="insurancesStore.items.length === 0" class="text-xs text-slate-400">Sin obras sociales disponibles.
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <button v-for="ins in insurancesStore.items" :key="ins.id" type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-medium border transition" :class="isInsuranceSelected(ins.id)
            ? 'bg-primary-50 text-primary-700 border-primary-200'
            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'" @click="toggleInsurance(ins.id)">
          {{ ins.name }}
        </button>
      </div>
    </div>

    <!-- Step 4: Availability -->
    <div v-if="currentStep === 3" class="space-y-4 animate-fade-in">
      <DoctorAvailabilityEditor v-model="availabilities" />
    </div>

    <!-- Step errors -->
    <div v-if="stepErrors.length > 0" class="flex flex-col gap-1">
      <p v-for="(err, i) in stepErrors" :key="i" class="text-xs text-error-600 flex items-center gap-1">
        {{ err }}
      </p>
    </div>

    <!-- Navigation -->
    <div class="flex items-center justify-between pt-2 border-t border-slate-100">
      <button v-if="currentStep > 0" class="btn-ghost" @click="prevStep">
        Anterior
      </button>
      <div v-else />
      <div class="flex gap-2">
        <button v-if="currentStep < STEP_LABELS.length - 1" class="btn-primary" @click="nextStep">
          Siguiente
        </button>
        <button v-else class="btn-primary" @click="submit">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>
