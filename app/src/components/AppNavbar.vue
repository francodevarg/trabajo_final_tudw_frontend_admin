<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { Menu } from "lucide-vue-next"

defineProps<{ onMenu: () => void }>()

const route = useRoute()
const auth = useAuthStore()

const title = computed(() => {
  const map: Record<string, string> = {
    'admin-turnos': 'Turnos',
    'admin-medicos': 'Médicos',
    'admin-pacientes': 'Pacientes',
    'admin-especialidades': 'Especialidades',
    'admin-obras-sociales': 'Obras Sociales',
    'admin-usuarios': 'Usuarios',
    'admin-permisos': 'Roles y Permisos',
    'admin-reportes': 'Reportes',
    'medico-agenda': 'Mi Agenda',
    'doctor-turnos': 'Turnos',
    'doctor-historial': 'Historial',
    'doctor-mi-perfil': 'Editar Perfil',
    'doctor-paciente-historial': 'Historia Clínica'
  }
  return map[route.name as string] || 'MediCare'
})

const subtitle = computed(() => {
  return auth.userGroup === 'ADMIN' ? 'Panel de administración' : 'Panel del médico'
})

const userInitial = computed(() => auth.userEmail?.charAt(0).toUpperCase() ?? 'U')
</script>

<template>
  <header class="h-14 bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
    <div class="flex items-center gap-3">
      <button class="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden -ml-1.5" @click="onMenu" aria-label="Abrir menú">
        <Menu class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center lg:hidden">
          <span class="text-primary-600 text-xs font-bold">M</span>
        </div>
        <h1 class="text-base font-semibold text-slate-900">{{ title }}</h1>
        <span class="hidden sm:inline text-xs text-slate-300">·</span>
        <p class="hidden sm:block text-xs text-slate-400">{{ subtitle }}</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div class="hidden sm:flex items-center">
        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-500">
          {{ auth.userGroup === 'ADMIN' ? 'Admin' : 'Médico' }}
        </span>
      </div>
      <div
        class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-semibold text-xs shadow-sm"
      >
        {{ userInitial }}
      </div>
    </div>
  </header>
</template>
