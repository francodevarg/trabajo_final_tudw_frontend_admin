import type { AppointmentStatus, AppointmentStatusAction } from './appointment.types'

import type { UserRole } from '../auth'

/* ── Action config ── */

export interface AppointmentActionConfig {
  action: AppointmentStatusAction

  label: string

  resultStatus: AppointmentStatus

  buttonClass: string

  confirm?: {
    title: string
    message: string
    confirmLabel: string
  }
}

type BaseActionConfig = Omit<AppointmentActionConfig, 'action'>

export const ACTION_CONFIG: Record<AppointmentStatusAction, BaseActionConfig> = {
  'check-in': {
    label: 'Check-in',

    resultStatus: 'checked_in',

    buttonClass: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100',

    confirm: {
      title: 'Registrar llegada',
      message: '¿Seguro que querés marcar este turno como presente?',
      confirmLabel: 'Check-in'
    }
  },

  cancel: {
    label: 'Cancelar',

    resultStatus: 'cancelled',

    buttonClass: 'bg-red-50 text-red-600 hover:bg-red-100',

    confirm: {
      title: 'Cancelar turno',
      message: '¿Seguro que deseas cancelar este turno?',
      confirmLabel: 'Cancelar'
    }
  },

  start: {
    label: 'Iniciar consulta',

    resultStatus: 'in_progress',

    buttonClass: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
  },

  complete: {
    label: 'Completar consulta',

    resultStatus: 'completed',

    buttonClass: 'bg-green-50 text-green-600 hover:bg-green-100'
  },

  'no-show': {
    label: 'No asistió',

    resultStatus: 'no_show',

    buttonClass: 'bg-orange-50 text-orange-600 hover:bg-orange-100',

    confirm: {
      title: 'Marcar inasistencia',
      message: '¿Confirmar que el paciente no asistió?',
      confirmLabel: 'No asistió'
    }
  }
}

/* ── Permissions ── */

type RoleActions = Partial<Record<AppointmentStatus, AppointmentStatusAction[]>>

export const ROLE_ACTIONS: Partial<Record<UserRole, RoleActions>> = {
  DOCTOR: {
    scheduled: ['check-in', 'cancel', 'no-show'],

    checked_in: ['start'],

    in_progress: ['complete']
  },

  ADMIN: {
    scheduled: ['check-in', 'cancel', 'no-show'],

    checked_in: ['start', 'cancel'],

    in_progress: ['complete']
  }
}

/* ── Available actions ── */

export function getAvailableActions(
  status: AppointmentStatus,
  role: UserRole | null
): AppointmentActionConfig[] {
  if (!role) {
    return []
  }

  const actions = ROLE_ACTIONS[role]?.[status] ?? []

  return actions.map(action => ({
    action,

    ...ACTION_CONFIG[action]
  }))
}
