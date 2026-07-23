export interface Patient {
  id: number
  first_name: string
  last_name: string
  dni: number
  sex: 'M' | 'F'
  date_of_birth: string
  email: string
}
