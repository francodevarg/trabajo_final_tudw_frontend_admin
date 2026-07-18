import { computed, ref, type ComputedRef, type Ref } from 'vue'
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  subDays,
  addDays
} from 'date-fns'
import { es } from 'date-fns/locale'

// agenda.ts

const AGENDA_VIEW = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
} as const

const DATE_FORMAT = 'yyyy-MM-dd'

export type ViewMode = (typeof AGENDA_VIEW)[keyof typeof AGENDA_VIEW]

interface DateRange {
  from: string
  to: string
}

export interface UseAgendaNavigation {
  viewMode: Ref<ViewMode>
  selectedDate: Ref<string>
  AGENDA_VIEW: typeof AGENDA_VIEW
  isToday: ComputedRef<boolean>
  dateRangeLabel: ComputedRef<string>

  setView(view: ViewMode): void
  goToday(): void
  goNext(): void
  goPrev(): void

  getRange(): DateRange
}

export function useAgendaNavigation(): UseAgendaNavigation {
  const viewMode = ref<ViewMode>(AGENDA_VIEW.DAY)
  const selectedDate = ref(format(new Date(), DATE_FORMAT))

  // Convierte la fecha en texto legible según el modo de vista seleccionado
  const dateRangeLabel = computed((): string => {
    const date = parseISO(selectedDate.value)

    switch (viewMode.value) {
      case AGENDA_VIEW.DAY:
        return format(date, "EEEE d 'de' MMMM", { locale: es })

      case AGENDA_VIEW.WEEK:
        return `${format(startOfWeek(date, { weekStartsOn: 1 }), 'd MMM', {
          locale: es
        })} - ${format(endOfWeek(date, { weekStartsOn: 1 }), 'd MMM', { locale: es })}`

      case AGENDA_VIEW.MONTH:
        return format(date, 'MMMM yyyy', { locale: es })
    }
  })

  const isToday = computed((): boolean => {
    const today = format(new Date(), DATE_FORMAT)
    return selectedDate.value === today
  })

  function setView(view: ViewMode): void {
    viewMode.value = view
  }

  function goToday(): void {
    selectedDate.value = format(new Date(), DATE_FORMAT)
    viewMode.value = AGENDA_VIEW.DAY
  }

  function goNext(): void {
    const date = parseISO(selectedDate.value)

    switch (viewMode.value) {
      case AGENDA_VIEW.DAY:
        selectedDate.value = format(addDays(date, 1), DATE_FORMAT)
        break

      case AGENDA_VIEW.WEEK:
        selectedDate.value = format(addWeeks(date, 1), DATE_FORMAT)
        break

      case AGENDA_VIEW.MONTH:
        selectedDate.value = format(addMonths(date, 1), DATE_FORMAT)
        break
    }
  }

  function goPrev(): void {
    const date = parseISO(selectedDate.value)

    switch (viewMode.value) {
      case AGENDA_VIEW.DAY:
        selectedDate.value = format(subDays(date, 1), DATE_FORMAT)
        break

      case AGENDA_VIEW.WEEK:
        selectedDate.value = format(subWeeks(date, 1), DATE_FORMAT)
        break

      case AGENDA_VIEW.MONTH:
        selectedDate.value = format(subMonths(date, 1), DATE_FORMAT)
        break
    }
  }

  function getRange(): DateRange {
    const date = parseISO(selectedDate.value)

    switch (viewMode.value) {
      case AGENDA_VIEW.DAY:
        return {
          from: selectedDate.value,
          to: selectedDate.value
        }

      case AGENDA_VIEW.WEEK:
        return {
          from: format(startOfWeek(date, { weekStartsOn: 1 }), DATE_FORMAT),
          to: format(endOfWeek(date, { weekStartsOn: 1 }), DATE_FORMAT)
        }

      case AGENDA_VIEW.MONTH:
        return {
          from: format(startOfMonth(date), DATE_FORMAT),
          to: format(endOfMonth(date), DATE_FORMAT)
        }
    }
  }

  return {
    AGENDA_VIEW,
    viewMode,
    selectedDate,
    dateRangeLabel,
    isToday,

    setView,
    goToday,
    goNext,
    goPrev,

    getRange
  }
}
