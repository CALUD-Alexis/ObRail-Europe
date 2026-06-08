import axios from 'axios'
import { supabase } from '@/lib/supabase'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

apiClient.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        supabase.auth.signOut()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }

      return Promise.reject({
        status,
        message: data?.message || 'Une erreur est survenue',
        errors: data?.errors || null
      })
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
        errors: null
      })
    }

    return Promise.reject({ status: -1, message: error.message, errors: null })
  }
)

export default apiClient
