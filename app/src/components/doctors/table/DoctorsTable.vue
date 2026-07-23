<script setup lang="ts">
import type { Doctor } from '@/types'
import DoctorsTableEmpty from './DoctorsTableEmpty.vue'
import DoctorTableRow from './DoctorsTableRow.vue'
import DoctorTableHeader from './DoctorsTableHeader.vue'

defineProps<{
  items: Doctor[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'view', item: Doctor): void
  (e: 'edit', item: Doctor): void
  (e: 'delete', item: Doctor): void
  (e: 'toggleActive', item: Doctor): void
}>()

</script>

<template>
  <div v-if="loading" class="space-y-3">
    <div v-for="i in 6" :key="i" class="h-16 bg-slate-100 rounded-xl animate-pulse" />
  </div>

  <DoctorsTableEmpty v-else-if="items.length === 0" />


  <div v-else class="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <table class="w-full text-sm">

      <DoctorTableHeader />

      <tbody class="divide-y divide-slate-100">
        <DoctorTableRow v-for="item in items" :key="item.id" :item="item" @view="emit('view', $event)"
          @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
      </tbody>

    </table>
  </div>
</template>
