<script setup lang="ts">
import { Inbox, Eye } from 'lucide-vue-next'
import type { Patient } from '@/types'
import PatientAvatar from './PatientAvatar.vue'
import { dateToAge } from '@/helpers/dateFormat.ts';
const props = defineProps<{
  items: Patient[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'view', item: Patient): void
  (e: 'page-change', page: number): void
}>()


function sexLabel(sex: string): string {
  const map: Record<string, string> = {
    M: 'Masculino',
    F: 'Femenino',
    O: 'Otro',
    N: 'No Especificado',
  }

  return map[sex] || sex
}

function sexBadgeClass(sex: string): string {
  const map: Record<string, string> = {
    M: 'bg-primary-50 text-primary-700',
    F: 'bg-rose-50 text-rose-700',
    O: 'bg-violet-50 text-violet-700',
    N: 'bg-slate-100 text-slate-600',
  }

  return map[sex] || 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <!-- Loading skeleton -->
  <div v-if="loading" class="space-y-3">
    <div v-for="i in 6" :key="i" class="h-16 bg-slate-100 rounded-xl animate-pulse" />
  </div>

  <!-- Empty state -->
  <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
    <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <Inbox class="w-7 h-7 text-slate-400" />
    </div>
    <p class="text-sm font-medium text-slate-600">No se encontraron pacientes</p>
    <p class="text-xs text-slate-400 mt-1">Intentá ajustar los filtros de búsqueda.</p>
  </div>

  <!-- Table -->
  <template v-else>
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/80">
            <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Paciente</th>
            <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">DNI</th>
            <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">Edad</th>
            <th class="text-left px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">Sexo</th>
            <th class="text-right px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider w-20">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="item in items"
            :key="item.id"
            class="group hover:bg-slate-50/60 transition-colors cursor-pointer"
            @click="emit('view', item)"
          >
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <PatientAvatar :first-name="item.first_name" :last-name="item.last_name" />
                <div class="min-w-0">
                  <p class="font-medium text-slate-800 text-sm truncate">{{ item.first_name +' ' + item.last_name }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-3.5 hidden md:table-cell">
              <code class="text-xs rounded-md px-2 py-0.5">{{ item.dni }}</code>
            </td>

            <td class="px-5 py-3.5 hidden lg:table-cell">
              <span class="text-sm text-slate-600">{{ dateToAge(item.date_of_birth) }} años</span>
            </td>

            <td class="px-5 py-3.5 hidden lg:table-cell">
              <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium', sexBadgeClass(item.sex)]">
                {{ sexLabel(item.sex) }}
              </span>
            </td>

            <td class="px-5 py-3.5 text-right">
              <button
                class="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                title="Ver detalle"
                @click.stop="emit('view', item)"
              >
                <Eye class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </template>
</template>
