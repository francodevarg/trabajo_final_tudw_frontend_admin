<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { HeartPulse } from "lucide-vue-next"
// import { seedIfEmpty } from '@/services/seed.service'
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const email = ref('admin@demo.com')
const password = ref('admin')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

onMounted(() => {
    auth.init()
})

function submit() {
  error.value = ''
  loading.value = true
  setTimeout(() => {
    const res = auth.login(email.value.trim(), password.value)
    loading.value = false
    if (!res.ok) {
      error.value = res.error || 'No se pudo iniciar sesión'
      ui.error(error.value)
      return
    }
    ui.success('Bienvenido de nuevo')
    if (auth.rol === 'ADMIN') router.push('/admin')
    else router.push('/medico/agenda')
  }, 250)
}

function fill(tipo: 'admin' | 'medico') {
  if (tipo === 'admin') {
    email.value = 'admin@demo.com'
    password.value = 'admin'
  } else {
    email.value = 'medico@demo.com'
    password.value = 'medico'
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left brand panel -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 relative overflow-hidden">      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 20% 30%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 35%);"></div>
          <div class="relative z-10 flex flex-col justify-between p-12 text-white">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <HeartPulse class="h-6 w-6 text-primary text-center mb-1" />

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
                Agenda de turnos, historias clínicas, atenciones y reportes en un único panel diseñado para médicos y administradores.
              </p>
              <ul class="mt-6 space-y-2 text-sm text-primary-50">
                <li class="flex items-center gap-2"><AppIcon name="check" class="w-4 h-4" /> Agenda y disponibilidad por médico</li>
                <li class="flex items-center gap-2"><AppIcon name="check" class="w-4 h-4" /> Historial clínico por paciente</li>
                <li class="flex items-center gap-2"><AppIcon name="check" class="w-4 h-4" /> Reportes e indicadores en tiempo real</li>
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
              <HeartPulse class="h-6 w-6"/> 
          </div>
          <p class="text-lg font-semibold text-slate-900">MediCare</p>
        </div>

        <h2 class="text-2xl font-semibold text-slate-900">Iniciar sesión</h2>
        <p class="text-sm text-slate-500 mt-1">Accede con tus credenciales para continuar.</p>

        <form @submit.prevent="submit" class="mt-8 space-y-4">
          <div>
            <label class="label" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="input"
              placeholder="nombre@correo.com"
            />
          </div>
          <div>
            <label class="label" for="password">Contraseña</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="input pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Ocultar' : 'Ver' }}
              </button>
            </div>
          </div>

          <p v-if="error" class="text-sm text-error-600 bg-error-50 border border-error-200 rounded-lg px-3 py-2">
            {{ error }}
          </p>

          <button type="submit" class="btn-primary w-full !py-2.5" :disabled="loading">
            <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

      </div>
    </div>
  </div>
</template>
