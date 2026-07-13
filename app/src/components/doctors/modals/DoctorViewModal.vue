<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import DoctorViewCard from '../DoctorViewCard.vue'
import type { DoctorDTO } from '@/types'

defineProps<{
    open: boolean
    doctor: DoctorDTO | null
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'sendWelcomeEmail', doctor: DoctorDTO): void
}>()
</script>

<template>
    <AppModal :open="open" title="Detalle del médico" max-width="sm:max-w-4xl" @close="emit('close')">
        <DoctorViewCard v-if="doctor" :key="doctor.id + (doctor.email_status ?? '')" :doctor="doctor"
            @send-welcome-email="emit('sendWelcomeEmail', doctor)" @close="emit('close')" />
    </AppModal>
</template>