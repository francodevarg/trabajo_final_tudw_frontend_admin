import { instance as axios } from '../plugins/axios'
import type { AxiosError } from 'axios'
import type { OtpResponse, OtpTokens } from '@/types'

export class AuthServiceError extends Error {
  status: number
  fields: Record<string, string[]>

  constructor(message: string, status: number, fields: Record<string, string[]> = {}) {
    super(message)
    this.name = 'AuthServiceError'
    this.status = status
    this.fields = fields
  }
}

function parseError(err: unknown): never {
  const axiosErr = err as AxiosError<Record<string, any>>
  const status = axiosErr.response?.status ?? 0
  const data = axiosErr.response?.data

  if (!data) {
    throw new AuthServiceError('Error de red. Verificá tu conexión.', status)
  }

  const detail = data.detail as string | undefined
  const fields: Record<string, string[]> = {}

  for (const [key, val] of Object.entries(data)) {
    if (key === 'detail') continue
    if (Array.isArray(val)) fields[key] = val
  }

  if (status === 400 && detail) {
    if (detail.includes('Invalid credentials')) {
      throw new AuthServiceError('Credenciales inválidas. Verificá tu email.', status, fields)
    }
    if (detail.includes('Invalid or expired OTP')) {
      throw new AuthServiceError('Código inválido o expirado. Solicitá uno nuevo.', status, fields)
    }
    throw new AuthServiceError(detail, status, fields)
  }

  if (status === 404) {
    throw new AuthServiceError('Email no registrado en el sistema.', status, fields)
  }

  const msg = detail || 'Error inesperado del servidor.'
  throw new AuthServiceError(msg, status, fields)
}

export const authService = {
  async requestOTP(email: string): Promise<OtpResponse> {
    try {
      const { data } = await axios.post<OtpResponse>('auth/request-otp', { email: email.trim() })
      return data
    } catch (err) {
      parseError(err)
    }
  },

  async verifyOTP(email: string, otp: string): Promise<OtpTokens> {
    try {
      const { data } = await axios.post<OtpTokens>('auth/verify-otp', {
        email: email.trim(),
        otp,
      })
      return data
    } catch (err) {
      parseError(err)
    }
  },

  async logout(refreshToken: string): Promise<void> {
    try {
      await axios.post('auth/logout', { refresh: refreshToken })
    } catch {
    }
  },
}
