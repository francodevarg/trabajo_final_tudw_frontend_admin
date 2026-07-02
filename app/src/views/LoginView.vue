<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { HeartPulse, ShieldCheck, ArrowLeft } from "lucide-vue-next"
import AppIcon from '@/components/AppIcon.vue'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const email = ref('admin@demo.com')
const loading = ref(false)
const error = ref('')

const showOtp = ref(false)
const otp = ref<string[]>(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])
const otpError = ref('')
const otpLoading = ref(false)

onMounted(() => {
  auth.init()
})

function submitEmail() {
  error.value = ''
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showOtp.value = true
    ui.info('Código de verificación enviado a ' + email.value)
    nextTick(() => otpRefs.value[0]?.focus())
  }, 400)
}

function handleOtpInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '')

  otp.value[index] = val.slice(0, 1)
  otpError.value = ''

  if (val && index < 5) {
    nextTick(() => otpRefs.value[index + 1]?.focus())
  }

  if (otp.value.every(d => d !== '')) {
    verifyOtp()
  }
}

function handleOtpKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otp.value[index - 1] = ''
    nextTick(() => otpRefs.value[index - 1]?.focus())
  }
}

function handleOtpPaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text')?.replace(/\D/g, '') ?? ''
  if (!text) return

  for (let i = 0; i < 6; i++) {
    otp.value[i] = text[i] ?? ''
  }

  const focusIdx = Math.min(text.length, 5)
  nextTick(() => otpRefs.value[focusIdx]?.focus())

  if (otp.value.every(d => d !== '')) {
    verifyOtp()
  }
}

function verifyOtp() {
  const code = otp.value.join('')
  if (code.length < 6) return

  otpLoading.value = true
  otpError.value = ''

  setTimeout(() => {
    otpLoading.value = false

    if (code !== '123456') {
      otpError.value = 'Código incorrecto. Intentá de nuevo.'
      otp.value = ['', '', '', '', '', '']
      nextTick(() => otpRefs.value[0]?.focus())
      return
    }

    const res = auth.login(email.value.trim(), '')
    if (!res.ok) {
      otpError.value = res.error || 'No se pudo iniciar sesión'
      ui.error(otpError.value)
      return
    }

    ui.success('Bienvenido de nuevo')
    if (auth.rol === 'ADMIN') router.push('/admin')
    else router.push('/medico/agenda')
  }, 500)
}

function goBack() {
  showOtp.value = false
  otp.value = ['', '', '', '', '', '']
  otpError.value = ''
  error.value = ''
}

function fill(tipo: 'admin' | 'medico') {
  if (tipo === 'admin') {
    email.value = 'admin@demo.com'
  } else {
    email.value = 'medico@demo.com'
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left brand panel -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 20% 30%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 35%);"></div>
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
            <HeartPulse class="h-5 w-5 text-white"/>
          </div>
          <p class="text-lg font-semibold text-slate-900">MediCare</p>
        </div>

        <!-- Email form -->
        <template v-if="!showOtp">
          <h2 class="text-2xl font-semibold text-slate-900">Iniciar sesión</h2>
          <p class="text-sm text-slate-500 mt-1">Ingresa tu email para recibir un código de verificación.</p>

          <form @submit.prevent="submitEmail" class="mt-8 space-y-4">
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

            <p v-if="error" class="text-sm text-error-600 bg-error-50 border border-error-200 rounded-lg px-3 py-2">
              {{ error }}
            </p>

            <button type="submit" class="btn-primary w-full !py-2.5" :disabled="loading">
              <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Enviando...' : 'Enviar código' }}
            </button>
          </form>
        </template>

        <!-- OTP overlay -->
        <template v-else>
          <div class="animate-fade-in">
            <button
              type="button"
              class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition"
              @click="goBack"
            >
              <ArrowLeft class="w-4 h-4" />
              Volver
            </button>

            <div class="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-5">
              <ShieldCheck class="w-7 h-7 text-primary-600" />
            </div>

            <h2 class="text-2xl font-semibold text-slate-900">Verificar código</h2>
            <p class="text-sm text-slate-500 mt-1">
              Ingresá el código de 6 dígitos enviado a<br />
              <span class="font-medium text-slate-700">{{ email }}</span>
            </p>

            <!-- OTP inputs -->
            <div class="mt-8 flex justify-center gap-2.5">
              <input
                v-for="(_, i) in 6"
                :key="i"
                :ref="el => { if (el) otpRefs[i] = el as HTMLInputElement }"
                type="text"
                inputmode="numeric"
                maxlength="1"
                :value="otp[i]"
                class="w-11 h-12 text-center text-lg font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                :class="{ 'border-error-500 focus:border-error-500 focus:ring-error-500/20': otpError }"
                @input="handleOtpInput(i, $event)"
                @keydown="handleOtpKeydown(i, $event)"
                @paste="handleOtpPaste"
              />
            </div>

            <p v-if="otpError" class="text-sm text-error-600 text-center mt-4">
              {{ otpError }}
            </p>

            <button
              class="btn-primary w-full !py-2.5 mt-6"
              :disabled="otpLoading || otp.some(d => d === '')"
              @click="verifyOtp"
            >
              <span v-if="otpLoading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              {{ otpLoading ? 'Verificando...' : 'Verificar' }}
            </button>

            <p class="text-xs text-slate-400 text-center mt-5">
              Demo: usá el código <span class="font-mono font-medium text-slate-500">123456</span>
            </p>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>
