<script setup lang="ts">
import { Users, RefreshCw } from 'lucide-vue-next'

defineProps<{
  total: number
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()


</script>

<template>
  <div class="mb-6">
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <Users class="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Pacientes</h1>
          <p class="text-xs text-slate-400">{{ total }} registros</p>
        </div>
      </div>

      <div class="sm:ml-auto flex items-center gap-2 w-full sm:w-auto">

        <button
          class="btn-ghost btn-sm flex-shrink-0"
          title="Actualizar"
          @click="emit('refresh')"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>
  </div>
</template>
