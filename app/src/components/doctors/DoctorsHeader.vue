<script setup lang="ts">
import { Search, Plus, Stethoscope, X } from 'lucide-vue-next'
import { useSpecialtiesStore } from '@/stores/specialties.store'
import { useInsurancesStore } from '@/stores/insurances.store'

const specialtiesStore = useSpecialtiesStore()
const insurancesStore = useInsurancesStore()

defineProps<{
  total: number
  hasFilters: boolean
}>()

defineEmits<{
  create: []
  clearFilters: []
}>()

const filters = defineModel<{
  search: string
  specialty: string
  insurance: string
}>('filters', {
  required: true,
})
</script>

<template>
  <div class="mb-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <Stethoscope class="w-5 h-5 text-primary-600" />
        </div>

        <div>
          <h1 class="text-xl font-semibold text-slate-900">
            Médicos
          </h1>
          <p class="text-xs text-slate-400">
            Administrá los profesionales de la clínica
          </p>
        </div>
      </div>

      <div class="sm:ml-auto w-full sm:w-auto">
        <div class="relative w-full sm:w-80 lg:w-96">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
          />

          <input
            v-model="filters.search"
            type="text"
            placeholder="Buscar por nombre, email o matrícula..."
            class="input h-9 w-full !pl-10 pr-9 text-sm"
          />

          <button
            v-if="filters.search"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            @click="filters.search = ''"
          >
            <X class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-2 flex-wrap">
      <select
        v-model="filters.specialty"
        class="input !w-auto text-xs h-10 pr-7"
      >
        <option value="">Todas las especialidades</option>

        <option
          v-for="s in specialtiesStore.items"
          :key="s.id"
          :value="s.name"
        >
          {{ s.name }}
        </option>
      </select>

      <select
        v-model="filters.insurance"
        class="input !w-auto text-xs h-10 pr-7"
      >
        <option value="">Todas las obras sociales</option>

        <option
          v-for="ins in insurancesStore.items"
          :key="ins.id"
          :value="ins.name"
        >
          {{ ins.name }}
        </option>
      </select>

      <button
        v-permission="'doctor.add_doctor'"
        class="btn btn-primary"
        @click="$emit('create')"
      >
        <Plus class="size-4 mr-1" />
        Nuevo Médico
      </button>

      <button
        v-if="hasFilters"
        class="text-xs text-slate-400 hover:text-slate-600 transition px-2 py-1"
        @click="$emit('clearFilters')"
      >
        X Limpiar filtros
      </button>

      <span class="ml-auto text-xs text-slate-400">
        {{ total }} registros
      </span>
    </div>
  </div>
</template>