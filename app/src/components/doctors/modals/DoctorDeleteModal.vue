<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import AppModal from '@/components/AppModal.vue'
import type { DoctorDTO } from '@/types'

defineProps<{
    open: boolean
    doctor: DoctorDTO | null
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
}>()
</script>

<template>
    <AppModal :open="open" title="Eliminar médico" max-width="sm:max-w-md" @close="emit('close')">
        <div class="text-center">
            <div class="w-12 h-12 rounded-2xl bg-error-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle class="w-6 h-6 text-error-600" />
            </div>

            <p class="text-sm text-slate-600">
                ¿Seguro que querés eliminar a
                <span class="font-semibold text-slate-800">
                    {{ doctor?.first_name }} {{ doctor?.last_name }}
                </span>?
            </p>

            <p class="text-xs text-slate-400 mt-1">
                Esta acción no se puede deshacer.
            </p>
        </div>

        <template #footer>
            <div class="flex justify-center gap-2">
                <button class="btn-ghost" @click="emit('close')">
                    Cancelar
                </button>

                <button
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-error-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-error-700 active:bg-error-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="loading" @click="emit('confirm')">
                    <span v-if="loading"
                        class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                    Eliminar
                </button>
            </div>
        </template>
    </AppModal>
</template>