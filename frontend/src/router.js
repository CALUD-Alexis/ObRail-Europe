import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Login from './views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    // Guard de navigation - exemple de protection de route
    beforeEnter: (to, from, next) => {
      // Vérifie si l'utilisateur est authentifié
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      if (isAuthenticated) {
        next() // Continue vers la route
      } else {
        next('/login') // Redirige vers login si non authentifié
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navigation global - s'exécute avant chaque changement de route
router.beforeEach((to, from, next) => {
  console.log(`Navigation de ${from.path} vers ${to.path}`)
  // Tu peux ajouter ici une logique globale (ex: vérifier l'auth, analytics, etc.)
  next()
})

export default router