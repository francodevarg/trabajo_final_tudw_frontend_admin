import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const ACCESS_KEY = 'medicare_access'

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
        path: 'admin/medicos',
        name: 'admin-medicos',
        component: () => import('@/views/admin/DoctorsView.vue')
      },
      {
        path: 'admin/especialidades',
        name: 'admin-especialidades',
        component: () => import('@/views/admin/SpecialtiesView.vue')
      },
      {
        path: 'admin/obras-sociales',
        name: 'admin-obras-sociales',
        component: () => import('@/views/admin/InsurancesView.vue')
      },
      {
        path: 'admin/pacientes',
        name: 'admin-pacientes',
        component: () => import('@/views/admin/PatientsView.vue')
      },
      {
        path: 'admin/turnos',
        name: 'admin-turnos',
        component: () => import('@/views/admin/AppointmentsView.vue')
      }
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
  if (!to.meta.public && !token) {
    return { name: 'login' }
  }
  if (to.name === 'login' && token) {
    return { path: '/admin' }
  }
})

export default router
