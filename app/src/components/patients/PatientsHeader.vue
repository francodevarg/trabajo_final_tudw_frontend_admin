<script setup lang="ts">
import { Search, Users, RefreshCw, X, ArrowUpDown } from 'lucide-vue-next'

defineProps<{
  total: number
  loading: boolean
  search: string
  ordering: string
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:ordering', value: string): void
  (e: 'refresh'): void
}>()

const SEX_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
]

const ORDER_OPTIONS = [
  { value: '', label: 'Por defecto' },
  { value: 'last_name', label: 'Apellido ↑' },
  { value: '-last_name', label: 'Apellido ↓' },
  { value: '-last_appointment', label: 'Último turno' },
  { value: '-created_at', label: 'Más recientes' },
]

function onSearchInput(e: Event) {
  emit('update:search', (e.target as HTMLInputElement).value)
}
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
          <p class="text-xs text-slate-400">Gestioná pacientes y consultá su historial médico</p>
        </div>
      </div>

      <div class="sm:ml-auto flex items-center gap-2 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-80 lg:w-96">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            :value="search"
            placeholder="Buscar por nombre o DNI..."
            class="input h-9 w-full !pl-10 pr-9 text-sm"
            @input="onSearchInput"
          />
          <button
            v-if="search"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            @click="emit('update:search', '')"
          >
            <X class="size-4" />
          </button>
        </div>

        <button
          class="btn-ghost btn-sm flex-shrink-0"
          title="Actualizar"
          @click="emit('refresh')"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2 flex-wrap">
      <div class="relative">
        <ArrowUpDown class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <select
          :value="ordering"
          class="input !w-auto text-xs h-10 pl-8 pr-7"
          @change="emit('update:ordering', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="opt in ORDER_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <span class="ml-auto text-xs text-slate-400">{{ total }} registros</span>
    </div>
  </div>
</template>
