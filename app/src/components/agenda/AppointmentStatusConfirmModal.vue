<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import AppModal from '@/components/AppModal.vue'
import type { AppointmentReadDTO } from '@/types/appointment'
import type { AppointmentActionConfig } from '@/types/appointment'

const props = defineProps<{
  open: boolean
  appointment: AppointmentReadDTO | null
  actionConfig: AppointmentActionConfig | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const modalConfig = computed(() => props.actionConfig)
</script>

<template>
  <AppModal :open="open" :title="modalConfig?.confirm?.title ?? ''" max-width="sm:max-w-md" @close="emit('close')">
    <div class="text-center">
      <div v-if="modalConfig" class="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
        :class="[modalConfig.buttonClass]">
        <AlertTriangle class="w-6 h-6" />
      </div>

      <p class="text-sm text-slate-600">
        {{ modalConfig?.confirm?.message }}
      </p>

      <p v-if="actionConfig" class="text-sm text-slate-600 mt-1">
        Turno de
        <span class="font-semibold text-slate-800">
          {{ appointment?.patient_detail.first_name }} {{ appointment?.patient_detail.last_name }}
        </span>
        con <span class="font-semibold text-slate-800">
          {{ appointment?.doctor_detail.first_name }} {{ appointment?.doctor_detail.last_name }} ({{
            appointment?.doctor_detail.specialty.name }})
        </span>
      </p>
    </div>

    <template #footer>
      <div class="flex justify-center gap-2">
        <button class="btn-ghost" @click="emit('close')">
          Volver
        </button>

        <button v-if="modalConfig"
          class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          :class="[modalConfig.buttonClass]" :disabled="loading" @click="emit('confirm')">
          <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          {{ modalConfig.confirm?.confirmLabel }}
        </button>
      </div>
    </template>
  </AppModal>
</template>
