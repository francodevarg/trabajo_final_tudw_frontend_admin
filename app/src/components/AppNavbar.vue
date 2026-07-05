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
    admin: 'Dashboard',
    'admin-medicos': 'Médicos',
    'admin-pacientes': 'Pacientes',
    'admin-especialidades': 'Especialidades',
    'admin-usuarios': 'Usuarios',
    'admin-permisos': 'Roles y Permisos',
    'admin-reportes': 'Reportes',
    'medico-agenda': 'Mi Agenda',
    'medico-turnos': 'Turnos',
    'medico-atencion': 'Registrar Atención',
    'medico-historial': 'Historial del Paciente',
  }
  return map[route.name as string] || 'MediCare'
})


const subtitle = computed(() => {
  return auth.userGroup === 'ADMIN' ? 'Panel de administración' : 'Panel del médico'
})


</script>

<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
    <div class="flex items-center gap-3">
      <button class="btn-sm !p-1.5 lg:hidden" @click="onMenu" aria-label="Abrir menú">
        <Menu class="h-6 w-6 text-primary text-center mb-1" />
      </button>
      <div>
        <h1 class="text-base sm:text-lg font-semibold text-slate-900 leading-tight">{{ title }}</h1>
        <p class="text-xs text-slate-400 leading-tight hidden sm:block">{{ subtitle }}</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full">
        <span class="badge" :class="auth.userGroup === 'ADMIN' ? 'badge-info' : 'badge-success'">
          {{ auth.userGroup === 'ADMIN' ? 'Administrador' : 'Médico' }}
        </span>
      </div>
      <div class="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
        {{ auth.userEmail?.charAt(0).toUpperCase() }}
      </div>
    </div>
  </header>
</template>
