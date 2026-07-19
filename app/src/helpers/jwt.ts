import type { JwtPayload, UserRole } from '@/types'

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )

    return JSON.parse(jsonPayload) as JwtPayload
  } catch {
    return null
  }
}

export function getPermissionsFromToken(token: string): string[] {
  const payload = decodeJwt(token)
  return payload?.permissions ?? []
}

export function getEmailFromToken(token: string): string | null {
  const payload = decodeJwt(token)
  return payload?.email ?? null
}

export function getUserNameFromToken(token: string): { firstName: string; lastName: string } | null {
  const payload = decodeJwt(token)
  if (!payload?.first_name && !payload?.last_name) return null
  return {
    firstName: payload.first_name ?? '',
    lastName: payload.last_name ?? '',
  }
}

export function getRoleFromToken(token: string): UserRole | null {
  const payload = decodeJwt(token)
  return payload?.group ?? null
}
