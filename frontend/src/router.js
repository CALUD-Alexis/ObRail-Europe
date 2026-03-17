import { createRouter, createWebHistory } from 'vue-router'

// 1. Import de tes vues (Assure-toi de les avoir déplacées dans le dossier /views)
import Login from './views/Login.vue'
import Dashboard from './views/dashboardPage.vue'
import Trajets from './views/trajetsPage.vue'
import TrajetDetail from './views/trajetDetailPage.vue'
// Tu pourras ajouter la page de monitoring plus tard :
// import Monitoring from './views/monitoringPage.vue'

// 2. Définition des routes
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
    // Pas de meta requiresAuth ici, car c'est une page publique
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Tag pour indiquer que la page est protégée
  },
  {
    path: '/trajets',
    name: 'Trajets',
    component: Trajets,
    meta: { requiresAuth: true }
  },
  {
    path: '/trajets/:id', // Le ":id" permet de faire une route dynamique (ex: /trajets/TRIP_123)
    name: 'TrajetDetail',
    component: TrajetDetail,
    meta: { requiresAuth: true }
  }
]

// 3. Création du routeur
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 4. Guard de navigation global (Le vigile à l'entrée du site)
router.beforeEach((to, from, next) => {
  // On vérifie si la route où l'utilisateur veut aller nécessite d'être connecté
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Simulation de l'authentification (à relier plus tard à ton authStore.js)
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  if (requiresAuth && !isAuthenticated) {
    // S'il n'est pas connecté et que la page est protégée -> retour au Login
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // S'il est DÉJÀ connecté et essaie d'aller sur /login -> on l'envoie sur le Dashboard
    next('/')
  } else {
    // Dans tous les autres cas, on le laisse passer
    next()
  }
})

export default router