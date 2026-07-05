<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppIcon from './AppIcon.vue'
import { HeartPulse } from 'lucide-vue-next';

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

interface NavItem {
  name: string
  to: string
  icon: string
}

const adminItems: NavItem[] = [
  { name: 'Dashboard', to: '/admin', icon: 'dashboard' },
  { name: 'Médicos', to: '/admin/medicos', icon: 'medicos' },
  { name: 'Pacientes', to: '/admin/pacientes', icon: 'pacientes' },
  { name: 'Especialidades', to: '/admin/especialidades', icon: 'especialidades' },
  { name: 'Usuarios', to: '/admin/usuarios', icon: 'usuarios' },
  { name: 'Roles y Permisos', to: '/admin/permisos', icon: 'permisos' },
  { name: 'Reportes', to: '/admin/reportes', icon: 'reportes' },
]

const medicoItems: NavItem[] = [
  { name: 'Mi Agenda', to: '/medico/agenda', icon: 'agenda' },
  { name: 'Turnos', to: '/medico/turnos', icon: 'turnos' },
  { name: 'Atención', to: '/medico/turnos', icon: 'atencion' },
  { name: 'Historial', to: '/medico/turnos', icon: 'historial' },
]

const items = computed(() => (auth.userGroup === 'ADMIN' ? adminItems : medicoItems))


function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

function navigate(to: string) {
  router.push(to)
  emit('update:open', false)
}

async function logout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <!-- Mobile backdrop -->
  <div
    v-if="props.open"
    class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
    @click="emit('update:open', false)"
  />

  <aside
    class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200"
    :class="props.open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Brand -->
    <div class="h-16 flex items-center gap-2.5 px-5 border-b border-slate-200">
      <div class="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
        <HeartPulse class="h-5 w-5 text-white"/>
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-900 leading-tight">MediCare</p>
        <p class="text-xs text-slate-400 leading-tight">Gestión clínica</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <p class="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {{ auth.userGroup === 'ADMIN' ? 'Administración' : 'Médico' }}
      </p>
      <button
        v-for="item in items"
        :key="item.to + item.name"
        @click="navigate(item.to)"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-primary-50 text-primary-700'
          : 'text-slate-600 hover:bg-slate-100'"
      >
        <AppIcon :name="item.icon" class="w-5 h-5" />
        <span>{{ item.name }}</span>
      </button>
    </nav>

    <!-- User -->
    <div class="p-3 border-t border-slate-200">
      <div class="flex items-center gap-3 px-2 py-2">
        <div class="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
          {{ auth.userEmail?.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-800 truncate"> {{ auth.userFirstName }} {{ auth.userLastName }}</p>
          <p class="text-xs text-slate-400 truncate">{{ auth.userEmail }}</p>
        </div>
        <button class="btn-ghost btn-sm !p-1.5" @click="logout" title="Cerrar sesión">
          <AppIcon name="logout" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </aside>
</template>
