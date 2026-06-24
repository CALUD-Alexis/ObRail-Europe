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
  async getAll(params = {}) {
    const response = await apiClient.get('/trajets', { params })
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
 * Service des gares
 */
export const gareService = {
  async getAll(params = {}) {
    const response = await apiClient.get('/gares', { params })
    return response.data
  },
  async getById(id) {
    const response = await apiClient.get(`/gares/${id}`)
    return response.data
  },
  async create(data) {
    const response = await apiClient.post('/gares', data)
    return response.data
  },
  async update(id, data) {
    const response = await apiClient.put(`/gares/${id}`, data)
    return response.data
  },
  async delete(id) {
    await apiClient.delete(`/gares/${id}`)
  }
}

/**
 * Service des opérateurs
 */
export const operateurService = {
  async getAll(params = {}) {
    const response = await apiClient.get('/operateurs', { params })
    return response.data
  },
  async getById(id) {
    const response = await apiClient.get(`/operateurs/${id}`)
    return response.data
  },
  async create(data) {
    const response = await apiClient.post('/operateurs', data)
    return response.data
  },
  async update(id, data) {
    const response = await apiClient.put(`/operateurs/${id}`, data)
    return response.data
  },
  async delete(id) {
    await apiClient.delete(`/operateurs/${id}`)
  }
}

/**
 * Service d'administration
 */
export const adminService = {
  async getUsers(params = {}) {
    const response = await apiClient.get('/admin/users', { params })
    return response.data
  },
  async createUser(data) {
    const response = await apiClient.post('/admin/users', data)
    return response.data
  },
  async updateUser(id, data) {
    const response = await apiClient.put(`/admin/users/${id}`, data)
    return response.data
  },
  async deleteUser(id) {
    await apiClient.delete(`/admin/users/${id}`)
  },
  async getSystemStatus() {
    const response = await apiClient.get('/admin/monitoring/status')
    return response.data
  },
  async getLogs(params = {}) {
    const response = await apiClient.get('/admin/monitoring/logs', { params })
    return response.data
  },
  async getMetrics(params = {}) {
    const response = await apiClient.get('/admin/monitoring/metrics', { params })
    return response.data
  },
  async getAlerts() {
    const response = await apiClient.get('/admin/monitoring/alerts')
    return response.data
  },
  async resolveAlert(id) {
    await apiClient.post(`/admin/monitoring/alerts/${id}/resolve`)
  }
}

/**
 * Service des statistiques
 */
export const statsService = {
  async getVolumes() {
    const response = await apiClient.get('/stats/volumes')
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
