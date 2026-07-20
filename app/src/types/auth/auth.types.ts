export type UserRole = 'ADMIN' | 'DOCTOR'

export interface JwtPayload {
  token_type: string
  exp: number
  iat: number
  jti: string
  user_id: number
  group: UserRole
  permissions: string[]
  email: string
  first_name: string
  last_name: string
}

export interface OtpTokens {
  access: string
  refresh: string
}
