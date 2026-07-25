import { getRoleFromToken } from '@/helpers/jwt'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const ACCESS_KEY = 'medicare_access'

import type { RouteMeta } from 'vue-router'
import type { UserRole } from '@/types'

const ADMIN_ROUTE = {
  requiresAuth: true,
  roles: ['ADMIN']
} as RouteMeta & {
  roles: UserRole[]
}

const DOCTOR_ROUTE = {
  requiresAuth: true,
  roles: ['DOCTOR']
} as RouteMeta & {
  roles: UserRole[]
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'admin/turnos',
        name: 'admin-turnos',
        component: () => import('@/views/admin/AppointmentsView.vue'),
        meta: ADMIN_ROUTE

      },
      {
        path: 'admin/medicos',
        name: 'admin-medicos',
        component: () => import('@/views/admin/DoctorsView.vue'),
        meta: ADMIN_ROUTE

      },
      {
        path: 'admin/pacientes',
        name: 'admin-pacientes',
        component: () => import('@/views/admin/PatientsView.vue'),
                meta: ADMIN_ROUTE

      },
      {
        path: 'admin/especialidades',
        name: 'admin-especialidades',
        component: () => import('@/views/admin/SpecialtiesView.vue'),
                meta: ADMIN_ROUTE

      },
      {
        path: 'admin/obras-sociales',
        name: 'admin-obras-sociales',
        component: () => import('@/views/admin/InsurancesView.vue'),
                meta: ADMIN_ROUTE

      },
      {
        path: 'doctor/turnos',
        name: 'doctor-turnos',
        component: () => import('@/views/admin/AppointmentsView.vue'),
        meta:DOCTOR_ROUTE
      },
      {
        path: 'doctor/historial',
        name: 'doctor-appointments-history',
        component: () => import('@/views/doctor/AppointmentHistoryView.vue'),
        meta:DOCTOR_ROUTE
      },
      {
        path: 'doctor/mi-perfil',
        name: 'doctor-mi-perfil',
        component: () => import('@/views/doctor/DoctorEditProfileView.vue'),
        meta:DOCTOR_ROUTE
      },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(to => {

  const token = localStorage.getItem(ACCESS_KEY)

  // Requiere autenticación
  if (!to.meta.public && !token) {
    return { name: 'login' }
  }


  // Si ya está logueado no volver al login
  if (to.name === 'login' && token) {
    return { path: '/' }
  }


  // Validación por roles
  const allowedRoles = to.meta.roles as UserRole[] | undefined

  if (allowedRoles && token) {

    const role = getRoleFromToken(token)

    if (!role || !allowedRoles.includes(role)) {
      return { path: '/' }
    }
  }

})

export default router
