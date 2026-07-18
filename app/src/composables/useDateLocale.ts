import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function useDateLocale() {
  function formatDate(dateStr: string, fmt: string): string {
    return format(parseISO(dateStr), fmt, { locale: es })
  }

  function formatRelativeDay(dateStr: string): string {
    return formatDate(dateStr, "EEEE d 'de' MMMM")
  }

  function formatDayLabel(dateStr: string): string {
    return formatDate(dateStr, 'EEEE d')
  }

  return { formatDate, formatRelativeDay, formatDayLabel }
}
