import { computed, type ComputedRef } from 'vue'
import type { Appointment } from '@/types'

export type TimeGroup = [string, Appointment[]]

export function groupByTime(appointments: Appointment[]): TimeGroup[] {
  const groups = new Map<string, Appointment[]>()
  for (const appt of appointments) {
    const key = appt.time.slice(0, 5)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(appt)
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}

export function useGroupedByTime(
  appointments: ComputedRef<Appointment[]>,
): ComputedRef<TimeGroup[]> {
  return computed(() => groupByTime(appointments.value))
}
