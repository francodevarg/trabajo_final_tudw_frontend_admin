<script setup lang="ts">
import { ref, computed } from 'vue'
import AppModal from '@/components/AppModal.vue'
import DoctorsFormWizard from '../DoctorsFormWizard.vue'
import type { DoctorDTO } from '@/types'

const props = defineProps<{
    open: boolean
    mode: 'create' | 'edit' | 'self-edit'
    doctor: DoctorDTO | null
    loading?: boolean
    emailError?: string | null
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'create', payload: any): void
    (e: 'update', payload: any): void
}>()

const formRef = ref<InstanceType<typeof DoctorsFormWizard> | null>(null)

const title = computed(() => {
    if (props.mode === 'self-edit') return 'Editar mi perfil'
    return props.mode === 'create' ? 'Nuevo médico' : 'Editar médico'
})

const buttonText = computed(() => {
    if (props.mode === 'self-edit') return 'Guardar perfil'
    return props.mode === 'create' ? 'Crear médico' : 'Guardar cambios'
})

function triggerSubmit() {
    formRef.value?.submit()
}

function handleSubmit(payload: any) {
    if (props.mode === 'create') {
        emit('create', payload)
    } else {
        emit('update', payload)
    }
}
</script>

<template>
    <AppModal :open="open" :title="title" max-width="max-w-xl" @close="emit('close')">
        <DoctorsFormWizard ref="formRef" :initial="doctor" :email-error="emailError" :mode="mode" @submit="handleSubmit" />

        <template #footer>
            <div class="flex justify-end gap-2">
                <button class="btn-ghost" @click="emit('close')">
                    Cancelar
                </button>

                <button class="btn-primary" :disabled="loading" @click="triggerSubmit">
                    <span v-if="loading"
                        class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                    {{ buttonText }}
                </button>
            </div>
        </template>
    </AppModal>
</template>