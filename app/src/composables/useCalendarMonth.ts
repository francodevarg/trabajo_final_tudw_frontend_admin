import { computed } from 'vue'
import { groupByDate } from './useGroupedByDate'
import type { AppointmentReadDTO } from '@/types/appointment'

function formatDateLocal(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function useCalendarMonth(
  currentDate: () => Date,
  appointments: () => AppointmentReadDTO[],
) {
  return computed(() => {
    const grouped = groupByDate(appointments())
    const selected = currentDate()

    const year = selected.getFullYear()
    const month = selected.getMonth()

    const todayStr = formatDateLocal(new Date())

    const firstDay = new Date(year, month, 1)
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(year, month, index - startDay + 1)
      const dateStr = formatDateLocal(date)
      const items = grouped[dateStr] ?? []

      return {
        date: dateStr,
        dayNumber: date.getDate(),
        items,
        count: items.length,
        isToday: dateStr === todayStr,
        isCurrentMonth: date.getMonth() === month,
      }
    })
  })
}