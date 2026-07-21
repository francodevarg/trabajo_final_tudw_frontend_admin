<template>
  <!-- Step 1: Email -->
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

      <button type="submit" class="btn-primary w-full !py-2.5" :disabled="loading || !email.trim()">
        <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
        {{ loading ? 'Iniciando...' : 'Iniciar sesión' }}
      </button>
    </form>
  </template>

  <!-- Step 2: OTP -->
  <template v-else>
    <div class="animate-fade-in">
      <button type="button" class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition" @click="goBack">
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

      <button class="btn-primary w-full !py-2.5 mt-6" :disabled="otpLoading || otp.some(d => d === '')" @click="verifyOtp">
        <span v-if="otpLoading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
        {{ otpLoading ? 'Verificando...' : 'Verificar' }}
      </button>

      <div class="mt-5 text-center">
        <p class="text-sm text-slate-500">
          ¿No recibiste el código?
        </p>

        <button
          type="button"
          @click="handleResend"
          :disabled="!canResend"
          class="mt-1 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:text-slate-400 disabled:cursor-not-allowed transition"
        >
          <template v-if="resendLoading">
            Reenviando...
          </template>
          <template v-else-if="!canResend">
            Reenviar código en {{ formattedCooldown }}
          </template>
          <template v-else>
            Reenviar código
          </template>
        </button>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ShieldCheck } from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth.store'
import { AuthServiceError } from '@/services/auth.service'
import { useOtpAuth } from '@/composables/auth/useOtpAuth' // Ajusta la ruta si es necesario

import { insurancesService } from '@/services/insurances.service'
import { specialtiesService } from '@/services/specialties.service'

const auth = useAuthStore()
const router = useRouter()

const showOtp = ref(false)
const email = ref('')
const loading = ref(false)
const error = ref('')

// Inicializamos el composable
const {
  otp,
  otpRefs,
  otpError,
  otpLoading,
  resendLoading,
  resendCooldown,
  canResend,
  startCooldown,
  verify,
  resend,
  reset,
  focusFirst
} = useOtpAuth(auth.requestOTP, auth.verifyOTP)

const formattedCooldown = computed(() => {
  const minutes = Math.floor(resendCooldown.value / 60)
  const seconds = resendCooldown.value % 60
  // padStart(2, '0') asegura que 5 segundos se vea como "05" y no "5"
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
})

// --- Lógica del Step 1 ---
async function submitEmail() {
  error.value = ''
  loading.value = true
  reset() // Limpiamos cualquier estado previo de OTP

  try {
    // Usamos el store directamente para el primer envío (para mantener el texto "Iniciando...")
    await auth.requestOTP(email.value.trim())
    showOtp.value = true
    
    // Iniciamos el cooldown y enfocamos el primer input
    startCooldown()
    focusFirst()

  } catch (e) {
    if (e instanceof AuthServiceError) {
      error.value = e.message
    } else {
      error.value = 'Error de red. Verificá tu conexión.'
    }
  } finally {
    loading.value = false
  }
}

// --- Lógica del Step 2 (OTP) ---
async function verifyOtp() {
  const ok = await verify(email.value.trim())

  if (!ok) return

  // Si la verificación es exitosa, precargamos datos necesarios
  await Promise.all([
    insurancesService.getAll(),
    specialtiesService.getAll()
  ])

  router.push('/admin/turnos')
}

// Wrapper para pasar el email correctamente al composable
async function handleResend() {
  await resend(email.value.trim())
}

function goBack() {
  showOtp.value = false
  error.value = ''
  reset() // Limpiamos el estado del composable (timer, inputs, errores)
}

// --- Manejadores de eventos del DOM para los inputs del OTP ---
function handleOtpInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value

  // Solo permitir números
  if (!/^\d*$/.test(value)) {
    otp.value[index] = ''
    return
  }

  // Guardar solo el último carácter ingresado
  otp.value[index] = value.slice(-1)

  // Mover el foco al siguiente input si se ingresó un valor y no es el último
  if (value && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }

  // ✨ AUTO-VERIFICAR: Si los 6 dígitos están completos, enviar automáticamente
  if (otp.value.every(d => d !== '')) {
    verifyOtp()
  }
}

function handleOtpKeydown(index: number, event: KeyboardEvent) {
  // Si se presiona Backspace y el input está vacío, mover el foco al anterior
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}

function handleOtpPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').trim()
  
  // Validar que sean exactamente 6 dígitos numéricos
  if (!pastedData || !/^\d{6}$/.test(pastedData)) return

  const digits = pastedData.split('')
  digits.forEach((digit, i) => {
    if (i < 6) {
      otp.value[i] = digit
    }
  })

  // Enfocar el último input (o el primero si fallara algo, pero el 5 es el estándar)
  otpRefs.value[5]?.focus()

  // AUTO-VERIFICAR: Al pegar un código válido de 6 dígitos, enviar automáticamente
  if (otp.value.every(d => d !== '')) {
    verifyOtp()
  }
}
</script>