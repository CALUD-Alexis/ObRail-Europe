import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// État
authStore.user          // Utilisateur connecté
authStore.token         // Token d'authentification
authStore.isAuthenticated  // Boolean

// Actions
await authStore.login({ email, password })
await authStore.logout()
await authStore.fetchCurrentUser()