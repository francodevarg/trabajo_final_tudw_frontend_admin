<script setup lang="ts">
import type { Specialty } from '@/types'

defineProps<{
  specialties: Specialty[]
  specialtyId: number | null
}>()

const emit = defineEmits<{
  (e: 'specialty-change', value: number | null): void
}>()

function onSpecialtyChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  console.log('onSpecialtyChange', value)

  emit(
    'specialty-change',
    value ? Number(value) : null
  )
}
</script>

<template>
  <div class="flex items-center gap-3 py-3">
    <select
      :value="specialtyId ?? ''"
      class="w-full sm:w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      @change="onSpecialtyChange"
    >
      <option value="">
        Todas las especialidades
      </option>

      <option
        v-for="specialty in specialties"
        :key="specialty.id"
        :value="specialty.id"
      >
        {{ specialty.name }}
      </option>
    </select>
  </div>
</template>