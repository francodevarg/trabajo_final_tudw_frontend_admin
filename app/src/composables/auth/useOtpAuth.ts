// composables/useOtpAuth.ts

import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import { AuthServiceError } from '@/services/auth.service'

export function useOtpAuth(
  requestOTP: (email: string) => Promise<void>,
verifyOTP: (email: string, code: string) => Promise<boolean>,
) {
  const otp = ref<string[]>(['', '', '', '', '', ''])
  const otpRefs = ref<HTMLInputElement[]>([])

  const otpError = ref('')
  const otpLoading = ref(false)

  const resendLoading = ref(false)
  const resendCooldown = ref(300)

  let timer: number | null = null

  const canResend = computed(() =>
    resendCooldown.value === 0 && !resendLoading.value
  )

  function clearOtp() {
    otp.value = ['', '', '', '', '', '']
  }

  function focusFirst() {
    nextTick(() => otpRefs.value[0]?.focus())
  }

  function startCooldown(seconds = 300) {
    if (timer) clearInterval(timer)

    resendCooldown.value = seconds

    timer = window.setInterval(() => {
      resendCooldown.value--

      if (resendCooldown.value <= 0) {
        clearInterval(timer!)
        timer = null
      }
    }, 1000)
  }

  async function resend(email: string) {
    resendLoading.value = true

    try {
      await requestOTP(email)

      clearOtp()
      otpError.value = ''

      startCooldown()

      focusFirst()
    } catch (e) {
      if (e instanceof AuthServiceError) {
        otpError.value = e.message
      } else {
        otpError.value = 'No fue posible reenviar el código.'
      }
    } finally {
      resendLoading.value = false
    }
  }

  async function verify(email: string) {
    const code = otp.value.join('')

    if (code.length !== 6) return false

    otpLoading.value = true
    otpError.value = ''

    try {
      await verifyOTP(email, code)
      return true
    } catch (e) {
      
      if (e instanceof AuthServiceError) {
        otpError.value = e.message
      } else {
        otpError.value = "El código es inválido o expiró."
      }

      clearOtp()
      focusFirst()

      return false
    } finally {
      otpLoading.value = false
    }
  }

  function reset() {
    clearOtp()
    otpError.value = ''

    if (timer) {
      clearInterval(timer)
      timer = null
    }

    resendCooldown.value = 300
  }

  onBeforeUnmount(reset)

  return {
    otp,
    otpRefs,
    otpError,
    otpLoading,

    resendLoading,
    resendCooldown,
    canResend,

    verify,
    resend,
    reset,
    clearOtp,
    focusFirst,
    startCooldown
  }
}