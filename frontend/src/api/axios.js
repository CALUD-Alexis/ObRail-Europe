import axios from 'axios'

// Configuration de la base URL (à adapter selon l'environnement)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api'

// Création de l'instance Axios
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Intercepteur de requête (Request Interceptor)
apiClient.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log de la requête en développement
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', config.method.toUpperCase(), config.url)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Intercepteur de réponse (Response Interceptor)
apiClient.interceptors.response.use(
  (response) => {
    // Log de la réponse en développement
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.status, response.config.url)
    }
    
    return response
  },
  (error) => {
    // Gestion des erreurs globales
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Non authentifié - rediriger vers login
          console.error('🔒 Non authentifié - Redirection vers login')
          localStorage.removeItem('token')
          localStorage.removeItem('isAuthenticated')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
          
        case 403:
          // Accès interdit
          console.error('🚫 Accès interdit')
          break
          
        case 404:
          // Ressource non trouvée
          console.error('🔍 Ressource non trouvée')
          break
          
        case 500:
          // Erreur serveur
          console.error('⚠️ Erreur serveur interne')
          break
          
        default:
          console.error(`❌ Erreur ${status}:`, data?.message || 'Une erreur est survenue')
      }
      
      // Retourner un objet d'erreur formaté
      return Promise.reject({
        status,
        message: data?.message || 'Une erreur est survenue',
        errors: data?.errors || null
      })
    } else if (error.request) {
      // La requête a été envoyée mais pas de réponse
      console.error('📡 Aucune réponse du serveur')
      return Promise.reject({
        status: 0,
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
        errors: null
      })
    } else {
      // Erreur lors de la configuration de la requête
      console.error('⚙️ Erreur de configuration:', error.message)
      return Promise.reject({
        status: -1,
        message: error.message,
        errors: null
      })
    }
  }
)

export default apiClient
