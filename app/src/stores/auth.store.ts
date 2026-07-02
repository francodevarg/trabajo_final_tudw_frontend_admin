import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Usuario, Medico } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>({
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    rol: 'MEDICO',
  } as Usuario)

  const medico = ref<Medico | null>({
    id: 1,
    usuario_id: 1,
    matricula: 'MP-12345',
    especialidad: 'Clínica Médica',
  } as Medico)

  const initialized = ref(true)

  const isAuthenticated = computed(() => !!usuario.value)
  const rol = computed(() => usuario.value?.rol ?? null)

  function init() {
    // No-op
  }

  function login(_email: string, _password: string) {
    return { ok: true }
  }

  function logout() {
    usuario.value = null
    medico.value = null
  }

  return {
    usuario,
    medico,
    initialized,
    isAuthenticated,
    rol,
    init,
    login,
    logout,
  }
})