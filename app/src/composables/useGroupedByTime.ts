import type { AppointmentReadDTO } from '@/types/appointment'
import { computed, type ComputedRef } from 'vue'

export type TimeGroup = [string, AppointmentReadDTO[]]

export function groupByTime(appointments: AppointmentReadDTO[]): TimeGroup[] {
  const groups = new Map<string, AppointmentReadDTO[]>()
  for (const appt of appointments) {
    const key = appt.time.slice(0, 5)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(appt)
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}

export function useGroupedByTime(
  appointments: ComputedRef<AppointmentReadDTO[]>,
): ComputedRef<TimeGroup[]> {
  return computed(() => groupByTime(appointments.value))
}
