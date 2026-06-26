import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Dashboard from './views/dashboardPage.vue'
import Trajets from './views/trajetsPage.vue'
import TrajetDetail from './views/trajetDetailPage.vue'
import Supervision from './views/supervisionPage.vue'

const routes = [
  { path: '/login',         name: 'Login',       component: Login },
  { path: '/',              name: 'Dashboard',   component: Dashboard,    meta: { requiresAuth: true } },
  { path: '/trajets',       name: 'Trajets',     component: Trajets,      meta: { requiresAuth: true } },
  { path: '/trajets/:id',   name: 'TrajetDetail', component: TrajetDetail, meta: { requiresAuth: true } },
  { path: '/supervision',   name: 'Supervision', component: Supervision,  meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navigation : s'exécute avant chaque changement de page
router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (requiresAuth && !isAuthenticated) {
    // Page protégée + utilisateur non connecté → redirection login
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Déjà connecté et tente d'accéder au login → redirection dashboard
    next('/')
  } else {
    next()
  }
})

export default router
