import apiClient from './axios'

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  /**
   * Inscription utilisateur
   * @param {Object} userData - { email, password, name }
   */
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  /**
   * Récupérer les infos de l'utilisateur connecté
   */
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  /**
   * Déconnexion
   */
  async logout() {
    const response = await apiClient.post('/auth/logout')
    return response.data
  }
}

/**
 * Service des trajets
 */
export const trajetService = {
  /**
   * Récupérer tous les trajets
   */
  async getAll() {
    const response = await apiClient.get('/trajets')
    return response.data
  },

  /**
   * Récupérer un trajet par ID
   * @param {number} id
   */
  async getById(id) {
    const response = await apiClient.get(`/trajets/${id}`)
    return response.data
  },

  /**
   * Rechercher des trajets
   * @param {Object} params - { departure, arrival, date, type }
   */
  async search(params) {
    const response = await apiClient.get('/trajets/search', { params })
    return response.data
  },

  /**
   * Créer un trajet
   * @param {Object} trajetData
   */
  async create(trajetData) {
    const response = await apiClient.post('/trajets', trajetData)
    return response.data
  },

  /**
   * Mettre à jour un trajet
   * @param {number} id
   * @param {Object} trajetData
   */
  async update(id, trajetData) {
    const response = await apiClient.put(`/trajets/${id}`, trajetData)
    return response.data
  },

  /**
   * Supprimer un trajet
   * @param {number} id
   */
  async delete(id) {
    const response = await apiClient.delete(`/trajets/${id}`)
    return response.data
  }
}

/**
 * Service des gares
 */
export const stationService = {
  /**
   * Récupérer toutes les gares
   */
  async getAll() {
    const response = await apiClient.get('/stations')
    return response.data
  },

  /**
   * Récupérer une gare par ID
   * @param {number} id
   */
  async getById(id) {
    const response = await apiClient.get(`/stations/${id}`)
    return response.data
  },

  /**
   * Rechercher des gares par nom
   * @param {string} query
   */
  async search(query) {
    const response = await apiClient.get('/stations/search', { params: { q: query } })
    return response.data
  }
}

/**
 * Service des réservations
 */
export const reservationService = {
  /**
   * Récupérer toutes les réservations de l'utilisateur
   */
  async getMyReservations() {
    const response = await apiClient.get('/reservations/me')
    return response.data
  },

  /**
   * Créer une réservation
   * @param {Object} reservationData
   */
  async create(reservationData) {
    const response = await apiClient.post('/reservations', reservationData)
    return response.data
  },

  /**
   * Annuler une réservation
   * @param {number} id
   */
  async cancel(id) {
    const response = await apiClient.delete(`/reservations/${id}`)
    return response.data
  }
}
