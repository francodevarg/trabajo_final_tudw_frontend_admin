import { computed } from 'vue'
import type { Appointment } from '@/types'
import { groupByDate } from './useGroupedByDate'

export function useCalendarMonth(appointments: () => Appointment[]) {
  return computed(() => {
    const grouped = groupByDate(appointments())

    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const year = today.getFullYear()
    const month = today.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

    const totalDays = 42

    return Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(year, month, index - startDay + 1)

      const dateStr = date.toISOString().split('T')[0]

      const items = grouped[dateStr] ?? []

      return {
        date: dateStr,
        dayNumber: date.getDate(),
        items,
        count: items.length,
        isToday: dateStr === todayStr,
        isCurrentMonth: date.getMonth() === month
      }
    })
  })
}
