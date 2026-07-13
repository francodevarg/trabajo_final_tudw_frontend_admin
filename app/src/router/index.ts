import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const ACCESS_KEY = 'medicare_access'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
        {
          path: 'admin/medicos',
          name: 'admin-medicos',
          component: () => import('@/views/admin/DoctorsView.vue'),
          meta: { rol: 'ADMIN' },
        },
        {
          path: 'admin/especialidades',
          name: 'admin-especialidades',
          component: () => import('@/views/admin/SpecialtiesView.vue'),
          meta: { rol: 'ADMIN' },
        },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem(ACCESS_KEY)
  if (!to.meta.public && !token) {
    return { name: 'login' }
  }
  if (to.name === 'login' && token) {
    return { path: '/admin' }
  }
})

export default router
