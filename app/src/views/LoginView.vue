<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { HeartPulse, CircleCheck } from "lucide-vue-next"
import AuthFormOTP from '../components/auth/AuthFormOTP.vue'
import { insurancesService } from '@/services/insurances.service.ts'
import { specialtiesService } from '@/services/specialties.service.ts'

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  auth.init()
  if (auth.isAuthenticated) {
    router.replace('/admin/turnos')
  }
})

</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left brand panel -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle at 20% 30%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 35%);">
      </div>
      <div class="relative z-10 flex flex-col justify-between p-12 text-white">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <HeartPulse class="h-6 w-6 text-white" />
          </div>
          <div>
            <p class="text-lg font-semibold">MediCare</p>
            <p class="text-xs text-primary-100">Sistema de gestión médica</p>
          </div>
        </div>
        <div class="max-w-md">
          <h1 class="text-3xl font-semibold leading-tight text-white">
            Gestiona tu clínica con eficiencia y claridad
          </h1>
          <p class="mt-4 text-primary-100 leading-relaxed">
            Agenda de turnos, historias clínicas, atenciones y reportes en un único panel diseñado para médicos y
            administradores.
          </p>
          <ul class="mt-6 space-y-2 text-sm text-primary-50">
            <li class="flex items-center gap-2">
              <CircleCheck class="h-4 w-4" /> Agenda y disponibilidad por médico
            </li>
            <li class="flex items-center gap-2">
              <CircleCheck class="h-4 w-4" /> Reportes e indicadores en tiempo real
            </li>
          </ul>
        </div>
        <p class="text-xs text-primary-200">© 2026 MediCare.</p>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div class="w-full max-w-sm">
        <div class="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
          <div class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
            <HeartPulse class="h-5 w-5 text-white" />
          </div>
          <p class="text-lg font-semibold text-slate-900">MediCare</p>
        </div>

        <AuthFormOTP />

      </div>
    </div>
  </div>
</template>
