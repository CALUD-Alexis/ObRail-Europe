import axios from 'axios'

// Client HTTP partagé — tous les stores l'importent pour appeler le backend
const apiClient = axios.create({
  // VUE_APP_API_URL est défini dans .env, sinon on utilise le backend local
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3333',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Intercepteur global pour les erreurs HTTP
// Avantage : on n'a pas à gérer les 401 dans chaque store individuellement
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expirée → on déconnecte et on redirige vers le login
      localStorage.removeItem('isAuthenticated')
      window.location.href = '/login'
    }
    // On normalise l'erreur pour que tous les .catch() reçoivent le même format
    return Promise.reject(
      error.response
        ? { status: error.response.status, message: error.response.data?.message || 'Erreur serveur' }
        : { status: 0, message: 'Impossible de contacter le serveur.' }
    )
  }
)

export default apiClient
