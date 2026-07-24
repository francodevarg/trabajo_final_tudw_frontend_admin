<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  CalendarDays,
  Stethoscope,
  Users,
  ShieldPlus,
  ChartColumn,
  HeartPulse,
  LogOut,
  ChevronRight,
  Clock,
} from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const menuItems = [
  { name: 'Turnos', to: '/admin/turnos', icon: CalendarDays },
  { name: 'Médicos', to: '/admin/medicos', icon: Stethoscope },
  { name: 'Pacientes', to: '/admin/pacientes', icon: Users },
  { name: 'Especialidades', to: '/admin/especialidades', icon: HeartPulse },
  { name: 'Obras Sociales', to: '/admin/obras-sociales', icon: ShieldPlus },
]

const medicoItems = [
  { name: 'Mi Agenda', to: '/admin/turnos', icon: CalendarDays },
  { name: 'Historial', to: '/admin/historial', icon: ChartColumn },
  { name: 'Mis Horarios', to: '/admin/horarios/', icon: Clock},
]

const items = computed(() => (auth.userGroup === 'ADMIN' ? menuItems : medicoItems))

function isActive(to: string) {
  if (to === '/admin/turnos') return route.path === '/admin/turnos'
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

const userInitial = computed(() => auth.userEmail?.charAt(0).toUpperCase() ?? 'U')
const sectionLabel = computed(() => auth.userGroup === 'ADMIN' ? 'Administración' : 'Médico')
</script>

<template>
  <Teleport to="body">
    <Transition name="sidebar-backdrop">
      <div v-if="props.open" class="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden"
        @click="emit('update:open', false)" />
    </Transition>
  </Teleport>

  <aside
    class="fixed lg:static inset-y-0 left-0 z-40 w-60 bg-white flex flex-col transition-transform duration-250 ease-out"
    :class="props.open ? 'translate-x-0 shadow-[4px_0_24px_-4px_rgb(0_0_0_/_0.08)]' : '-translate-x-full lg:translate-x-0 lg:shadow-[1px_0_0_0_rgb(0_0_0_/_0.04)]'">
    <!-- Brand -->
    <div class="h-14 flex items-center gap-2.5 px-5">
      <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm">
        <HeartPulse class="h-4.5 w-4.5 text-white" />
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-900 leading-tight">MediCare</p>
        <p class="text-[11px] text-slate-400 leading-tight">Gestión clínica</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto sidebar-scroll px-3 py-5 space-y-1">
      <p class="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {{ sectionLabel }}
      </p>
      <button v-for="item in items" :key="item.to + item.name" @click="navigate(item.to)"
        class="group relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
        :class="isActive(item.to)
          ? 'text-primary-700 bg-primary-50'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'">
        <component :is="item.icon" class="w-4.5 h-4.5 flex-shrink-0" />
        <span>{{ item.name }}</span>
        <ChevronRight v-if="isActive(item.to)" class="w-3.5 h-3.5 ml-auto text-primary-400 flex-shrink-0" />
      </button>
    </nav>

    <!-- User -->
    <div class="px-3 py-3 border-t border-slate-100">
      <div class="flex items-center gap-3 px-1">
        <div
          class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-semibold text-xs shadow-sm flex-shrink-0">
          {{ userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-800 truncate leading-tight">{{ auth.userFirstName }} {{
            auth.userLastName }}</p>
          <p class="text-[11px] text-slate-400 truncate leading-tight">{{ auth.userEmail }}</p>
        </div>
        <button
          class="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          @click="logout" title="Cerrar sesión">
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-backdrop-enter-active,
.sidebar-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.sidebar-backdrop-enter-from,
.sidebar-backdrop-leave-to {
  opacity: 0;
}
</style>
