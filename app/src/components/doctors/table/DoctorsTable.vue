<script setup lang="ts">
import type { DoctorDTO } from '@/types'
import DoctorsTableEmpty from './DoctorsTableEmpty.vue'
import DoctorTableRow from './DoctorsTableRow.vue'
import DoctorTableHeader from './DoctorsTableHeader.vue'

defineProps<{
  items: DoctorDTO[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'view', item: DoctorDTO): void
  (e: 'edit', item: DoctorDTO): void
  (e: 'delete', item: DoctorDTO): void
  (e: 'sendWelcomeEmail', item: DoctorDTO): void
  (e: 'toggleActive', item: DoctorDTO): void
}>()

</script>

<template>
  <div v-if="loading" class="space-y-3">
    <div v-for="i in 6" :key="i" class="h-16 bg-slate-100 rounded-xl animate-pulse" />
  </div>

  <DoctorsTableEmpty v-else-if="items.length === 0" />

  <table v-else class="w-full text-sm">

    <DoctorTableHeader />

    <tbody class="divide-y divide-slate-100">
      <DoctorTableRow v-for="item in items" :key="item.id" :item="item" @view="emit('view', $event)"
        @edit="emit('edit', $event)" @delete="emit('delete', $event)"
        @sendWelcomeEmail="emit('sendWelcomeEmail', $event)" />
    </tbody>

  </table>
</template>
