import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

import Login from './views/Login.vue'
import Register from './views/Register.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ResetPassword from './views/ResetPassword.vue'
import Dashboard from './views/dashboardPage.vue'
import Trajets from './views/trajetsPage.vue'
import TrajetDetail from './views/trajetDetailPage.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login, meta: { public: true } },
  { path: '/register', name: 'Register', component: Register, meta: { public: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { public: true } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { public: true } },
  { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/trajets', name: 'Trajets', component: Trajets, meta: { requiresAuth: true } },
  { path: '/trajets/:id', name: 'TrajetDetail', component: TrajetDetail, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' }
  }

  if (to.meta.public && isAuthenticated && to.name !== 'ResetPassword') {
    return { name: 'Dashboard' }
  }
})

export default router
