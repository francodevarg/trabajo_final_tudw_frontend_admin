import type { AppointmentReadDTO } from "@/types/appointment"


export function groupByDate(appointments: AppointmentReadDTO[]) {
  return appointments.reduce<Record<string, AppointmentReadDTO[]>>((acc, appointment) => {
    acc[appointment.date] ??= []
    acc[appointment.date].push(appointment)

    return acc
  }, {})
}
