import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// import { useAuthStore } from '@/stores/auth.store'

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

export default router
