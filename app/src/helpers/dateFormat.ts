export function dateToAge(date_of_birth: string): number | null {
  if (!date_of_birth) return null

  const birthDate = new Date(date_of_birth)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()

  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}