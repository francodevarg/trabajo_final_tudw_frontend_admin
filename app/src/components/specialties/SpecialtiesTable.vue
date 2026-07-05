<script setup lang="ts">
import { Pencil, Trash2, Search, Inbox } from 'lucide-vue-next'
import type { Specialty } from '@/types'

defineProps<{
  items: Specialty[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', item: Specialty): void
  (e: 'delete', item: Specialty): void
}>()
</script>

<template>
  <!-- Loading skeleton -->
  <div v-if="loading" class="space-y-3">
    <div v-for="i in 5" :key="i" class="h-14 bg-slate-100 rounded-xl animate-pulse" />
  </div>

  <!-- Empty state -->
  <div
    v-else-if="items.length === 0"
    class="flex flex-col items-center justify-center py-16 text-center"
  >
    <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <Inbox class="w-7 h-7 text-slate-400" />
    </div>
    <p class="text-sm font-medium text-slate-600">No hay especialidades</p>
    <p class="text-xs text-slate-400 mt-1">Agregá la primera haciendo clic en el botón de arriba.</p>
  </div>

  <!-- Table -->
  <div v-else class="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-slate-100 bg-slate-50/80">
          <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Nombre</th>
          <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Slug</th>
          <th class="text-right px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider w-24">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr
          v-for="item in items"
          :key="item.id"
          class="group hover:bg-slate-50/60 transition-colors"
        >
          <td class="px-5 py-3.5">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                {{ item.name.charAt(0).toUpperCase() }}
              </div>
              <span class="font-medium text-slate-800">{{ item.name }}</span>
            </div>
          </td>
          <td class="px-5 py-3.5 hidden sm:table-cell">
            <code class="text-xs text-slate-500 bg-slate-100 rounded-md px-2 py-0.5">{{ item.slug }}</code>
          </td>
          <td class="px-5 py-3.5">
            <div class="flex items-center justify-end gap-1">
              <button
                v-permission="'doctor.change_specialty'"
                class="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                title="Editar"
                @click="emit('edit', item)"
              >
                <Pencil class="w-4 h-4" />
              </button>
              <button
                v-permission="'doctor.delete_specialty'"
                class="p-2 rounded-lg text-slate-400 hover:text-error-600 hover:bg-error-50 transition-colors"
                title="Eliminar"
                @click="emit('delete', item)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
