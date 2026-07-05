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
              {{ loading ? 'Enviando...' : 'Enviar código' }}
            </button>
          </form>
        </template>

        <!-- Step 2: OTP -->
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
          </div>
        </template>
</template>



<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { AuthServiceError } from '@/services/auth.service'
import { ShieldCheck, ArrowLeft } from "lucide-vue-next"
import { useRouter } from 'vue-router'

const showOtp = ref(false)

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const loading = ref(false)
const error = ref('')

const otp = ref<string[]>(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])
const otpError = ref('')
const otpLoading = ref(false)



//
async function submitEmail() {
  error.value = ''
  loading.value = true
  try {
    await auth.requestOTP(email.value.trim())
    showOtp.value = true
    nextTick(() => otpRefs.value[0]?.focus())
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

async function verifyOtp() {
  const code = otp.value.join('')
  if (code.length < 6) return

  otpLoading.value = true
  otpError.value = ''

  try {
    await auth.verifyOTP(email.value.trim(), code)
    router.push('/admin')
  } catch (e) {
    if (e instanceof AuthServiceError) {
      otpError.value = e.message
    } else {
      otpError.value = 'Error de red. Intentá de nuevo.'
    }
    otp.value = ['', '', '', '', '', '']
    nextTick(() => otpRefs.value[0]?.focus())
  } finally {
    otpLoading.value = false
  }
}


function goBack() {
  showOtp.value = false
  otp.value = ['', '', '', '', '', '']
  otpError.value = ''
  error.value = ''
}
</script>
