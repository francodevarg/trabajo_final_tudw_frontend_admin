export interface OtpRequest {
  email: string
}

export interface OtpResponse {
  detail: string
}

export interface OtpVerify {
  email: string
  otp: string
}

export interface AuthError {
  detail?: string
  email?: string[]
  otp?: string[]
}
