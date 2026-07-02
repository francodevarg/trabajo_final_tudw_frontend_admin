export type Rol = 'ADMIN' | 'MEDICO'

export type EstadoTurno = 'PENDIENTE' | 'ATENDIDO' | 'CANCELADO'

export interface Usuario {
  id: string
  nombre: string
  email: string
  password: string
  rol: Rol
  activo: boolean
}

export interface Disponibilidad {
  id: string
  dia: string
  horaInicio: string
  horaFin: string
}

export interface Medico {
  id: string
  nombre: string
  apellido: string
  matricula: string
  especialidadId: string
  email: string
  telefono: string
  disponibilidad: Disponibilidad[]
  usuarioId?: string
}

export interface EntradaHistorial {
  id: string
  fecha: string
  medicoId: string
  diagnostico: string
  tratamiento: string
  observaciones: string
}

export interface Paciente {
  id: string
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: string
  telefono: string
  email: string
  historialClinico: EntradaHistorial[]
}

export interface Especialidad {
  id: string
  nombre: string
  descripcion: string
}

export interface Turno {
  id: string
  medicoId: string
  pacienteId: string
  fecha: string
  hora: string
  estado: EstadoTurno
  motivo: string
}

export interface Atencion {
  id: string
  turnoId: string
  medicoId: string
  pacienteId: string
  diagnostico: string
  observaciones: string
  tratamiento: string
  fecha: string
}

export interface RolPermisos {
  rol: Rol
  permisos: string[]
}

export interface AuthState {
  usuario: Usuario | null
  medico: Medico | null
}
