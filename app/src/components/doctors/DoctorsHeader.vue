<script setup lang="ts">
import { computed } from 'vue'
import { Search, Plus, UserRound, X } from 'lucide-vue-next'
import { useSpecialtiesStore } from '@/stores/specialties.store'
import { useInsurancesStore } from '@/stores/insurances.store'

const specialtiesStore = useSpecialtiesStore()
const insurancesStore = useInsurancesStore()

const props = defineProps<{
  total: number
}>()

const emit = defineEmits<{
  (e: 'create'): void
}>()

const search = defineModel<string>('search', { default: '' })
const specialtyFilter = defineModel<string>('specialty', { default: '' })
const statusFilter = defineModel<string>('status', { default: '' })
const insuranceFilter = defineModel<string>('insurance', { default: '' })

const hasFilters = computed(() => search.value || specialtyFilter.value || statusFilter.value || insuranceFilter.value)

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
]

function clearFilters() {
  search.value = ''
  specialtyFilter.value = ''
  statusFilter.value = ''
  insuranceFilter.value = ''
}
</script>

<template>
  <div class="mb-6">
    <!-- Top row: icon + title + search + new button -->
<div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
  <!-- Left -->
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
      <UserRound class="w-5 h-5 text-primary-600" />
    </div>

    <div>
      <h1 class="text-xl font-semibold text-slate-900">Médicos</h1>
      <p class="text-xs text-slate-400">
        Administrá los profesionales de la clínica
      </p>
    </div>
  </div>

  <!-- Right -->
  <div class="sm:ml-auto w-full sm:w-auto">
    <div class="relative w-full sm:w-80 lg:w-96">
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
      />

      <input
        v-model="search"
        type="text"
        placeholder="Buscar por nombre, email o matrícula..."
        class="input h-9 w-full !pl-10 pr-9 text-sm"
      />

      <button
        v-if="search"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        @click="search = ''"
      >
        <X class="size-4" />
      </button>
    </div>
  </div>
</div>
    <!-- Filters row -->
    <div class="flex items-center gap-2 flex-wrap">
      <select v-model="specialtyFilter" class="input !w-auto text-xs h-8 pr-7">
        <option value="">Todas las especialidades</option>
        <option v-for="s in specialtiesStore.items" :key="s.id" :value="s.name">{{ s.name }}</option>
      </select>

      <select v-model="statusFilter" class="input !w-auto text-xs h-8 pr-7">
        <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>

      <select v-model="insuranceFilter" class="input !w-auto text-xs h-8 pr-7">
        <option value="">Todas las obras sociales</option>
        <option v-for="ins in insurancesStore.items" :key="ins.id" :value="ins.name">{{ ins.name }}</option>
      </select>

      <button
        v-if="hasFilters"
        class="text-xs text-slate-400 hover:text-slate-600 transition px-2 py-1"
        @click="clearFilters"
      >
        Limpiar filtros
      </button>

      <span class="ml-auto text-xs text-slate-400">{{ total }} registros</span>
    </div>
  </div>
</template>
