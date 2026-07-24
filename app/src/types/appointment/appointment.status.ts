import type { Component } from 'vue'
import type { AppointmentStatus } from './appointment.types'

import {
  CalendarClock,
  UserCheck,
  Stethoscope,
  ClipboardCheck,
  CalendarX,
  UserX
} from 'lucide-vue-next'

/* =========================
   STATUS
========================= */

interface StatusConfig {
  label: string
  icon: Component
  class: string
}

export const STATUS_CONFIG: Record<AppointmentStatus, StatusConfig> = {
  scheduled: {
    label: 'Agendado',
    icon: CalendarClock,
    class: 'bg-blue-50 text-blue-700'
  },

  checked_in: {
    label: 'Presente',
    icon: UserCheck,
    class: 'bg-cyan-50 text-cyan-700'
  },

  in_progress: {
    label: 'En Consultorio',
    icon: Stethoscope,
    class: 'bg-yellow-50 text-yellow-700'
  },

  completed: {
    label: 'Atendido',
    icon: ClipboardCheck,
    class: 'bg-green-50 text-green-700'
  },

  cancelled: {
    label: 'Cancelado',
    icon: CalendarX,
    class: 'bg-red-50 text-red-700'
  },

  no_show: {
    label: 'Ausente',
    icon: UserX,
    class: 'bg-orange-100 text-orange-600'
  }
}

export function getStatusConfig(status: AppointmentStatus) {
  return STATUS_CONFIG[status]
}
