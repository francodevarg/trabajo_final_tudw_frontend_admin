import type { Appointment } from '@/types'

export function groupByDate(appointments: Appointment[]) {
  return appointments.reduce<Record<string, Appointment[]>>((acc, appointment) => {
    acc[appointment.date] ??= []
    acc[appointment.date].push(appointment)

    return acc
  }, {})
}
