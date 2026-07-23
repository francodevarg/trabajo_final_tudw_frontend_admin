import { computed, ref, type Ref } from 'vue'
import type { Doctor } from '@/types'

export function useDoctorsFilters(items: Ref<Doctor[]>) {
  const filters = ref({
    search: '',
    specialty: '',
    insurance: '',
  })

  function getSpecialtyName(doctor: Doctor): string {
    if (!doctor.specialty) return ''

    return typeof doctor.specialty === 'string'
      ? doctor.specialty
      : doctor.specialty.name
  }

  function getInsuranceNames(doctor: Doctor): string[] {
    if (!Array.isArray(doctor.insurances)) return []

    return doctor.insurances.map(i =>
      typeof i === 'string'
        ? i
        : i.name
    )
  }

  function matchesSearch(doctor: Doctor): boolean {
    const q = filters.value.search.trim().toLowerCase()

    if (!q) return true

    return [
      doctor.first_name,
      doctor.last_name,
      doctor.email,
      doctor.phone,
      doctor.license_number,
    ]
      .filter(Boolean)
      .some(value => value!.toLowerCase().includes(q))
  }

  function matchesFilters(doctor: Doctor): boolean {
    if (!matchesSearch(doctor)) return false

    if (
      filters.value.specialty &&
      getSpecialtyName(doctor) !== filters.value.specialty
    ) {
      return false
    }

    if (
      filters.value.insurance &&
      !getInsuranceNames(doctor).includes(filters.value.insurance)
    ) {
      return false
    }

    return true
  }

  const filteredItems = computed(() =>
    items.value.filter(matchesFilters)
  )

  function clearFilters() {
    filters.value.search = ''
    filters.value.specialty = ''
    filters.value.insurance = ''
  }

  const hasFilters = computed(() =>
    Object.values(filters.value).some(Boolean)
  )

  return {
    filters,
    filteredItems,
    clearFilters,
    hasFilters,
  }
}