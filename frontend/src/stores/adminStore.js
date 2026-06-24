import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminService } from '@/api/services'

/**
 * Store pour l'administration
 * Gestion des utilisateurs et supervision technique (Monitoring)
 * Route suggérée : /admin
 */
export const useAdminStore = defineStore('admin', () => {
  // État - Gestion des utilisateurs
  const users = ref([])
  const selectedUser = ref(null)
  const userLoading = ref(false)
  const userError = ref(null)

  // État - Monitoring système
  const systemStatus = ref({
    apiStatus: 'unknown', // 'online', 'offline', 'degraded'
    databaseStatus: 'unknown',
    lastUpdate: null,
    activeUsers: 0,
    requestsPerMinute: 0,
    errorRate: 0
  })

  const logs = ref([])
  const metrics = ref([])
  const alerts = ref([])
  const monitoringLoading = ref(false)
  const monitoringError = ref(null)

  // Filtres utilisateurs
  const userFilters = ref({
    searchQuery: '',
    role: null, // 'admin', 'operateur', 'lecteur'
    status: 'tous', // 'tous', 'actif', 'inactif', 'bloque'
    dateInscription: null
  })

  // Getters - Utilisateurs
  const userCount = computed(() => users.value.length)

  const filteredUsers = computed(() => {
    let result = users.value

    // Recherche textuelle
    if (userFilters.value.searchQuery) {
      const query = userFilters.value.searchQuery.toLowerCase()
      result = result.filter(u =>
        u.nom?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.username?.toLowerCase().includes(query)
      )
    }

    // Filtre par rôle
    if (userFilters.value.role) {
      result = result.filter(u => u.role === userFilters.value.role)
    }

    // Filtre par statut
    if (userFilters.value.status !== 'tous') {
      result = result.filter(u => u.status === userFilters.value.status)
    }

    return result
  })

  const usersByRole = computed(() => {
    const grouped = {}
    users.value.forEach(user => {
      if (!grouped[user.role]) {
        grouped[user.role] = []
      }
      grouped[user.role].push(user)
    })
    return grouped
  })

  const activeUsersCount = computed(() => 
    users.value.filter(u => u.status === 'actif').length
  )

  // Getters - Monitoring
  const isSystemHealthy = computed(() => {
    return systemStatus.value.apiStatus === 'online' &&
           systemStatus.value.databaseStatus === 'online' &&
           systemStatus.value.errorRate < 5
  })

  const criticalAlerts = computed(() =>
    alerts.value.filter(a => a.severity === 'critical' && !a.resolved)
  )

  const recentLogs = computed(() =>
    logs.value.slice(0, 100)
  )

  // Actions - Gestion des utilisateurs
  async function fetchUsers() {
    userLoading.value = true
    userError.value = null
    try {
      const data = await adminService.getUsers()
      users.value = Array.isArray(data) ? data : (data.data ?? [])
    } catch (err) {
      userError.value = err.message || 'Erreur lors du chargement des utilisateurs'
      console.error('Erreur chargement utilisateurs:', err)
    } finally {
      userLoading.value = false
    }
  }

  async function addUser(userData) {
    userLoading.value = true
    userError.value = null
    try {
      const newUser = await adminService.createUser(userData)
      users.value.push(newUser)
      return newUser
    } catch (err) {
      userError.value = err.message
      throw err
    } finally {
      userLoading.value = false
    }
  }

  async function updateUser(id, updates) {
    userLoading.value = true
    userError.value = null
    try {
      const updatedUser = await adminService.updateUser(id, updates)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) users.value[index] = updatedUser
      return updatedUser
    } catch (err) {
      userError.value = err.message
      throw err
    } finally {
      userLoading.value = false
    }
  }

  async function deleteUser(id) {
    userLoading.value = true
    userError.value = null
    try {
      await adminService.deleteUser(id)
      users.value = users.value.filter(u => u.id !== id)
    } catch (err) {
      userError.value = err.message
      throw err
    } finally {
      userLoading.value = false
    }
  }

  async function toggleUserStatus(id, newStatus) {
    return await updateUser(id, { status: newStatus })
  }

  async function changeUserRole(id, newRole) {
    return await updateUser(id, { role: newRole })
  }

  function searchUsers(query) {
    userFilters.value.searchQuery = query
  }

  function setUserFilter(filterName, value) {
    if (userFilters.value.hasOwnProperty(filterName)) {
      userFilters.value[filterName] = value
    }
  }

  function clearUserFilters() {
    userFilters.value = {
      searchQuery: '',
      role: null,
      status: 'tous',
      dateInscription: null
    }
  }

  // Actions - Monitoring
  async function fetchSystemStatus() {
    monitoringLoading.value = true
    monitoringError.value = null
    try {
      systemStatus.value = await adminService.getSystemStatus()
    } catch (err) {
      monitoringError.value = err.message || 'Erreur chargement statut système'
      console.error('Erreur chargement status système:', err)
    } finally {
      monitoringLoading.value = false
    }
  }

  async function fetchLogs(limit = 100, level = null) {
    monitoringLoading.value = true
    monitoringError.value = null
    try {
      logs.value = await adminService.getLogs({ limit, ...(level ? { level } : {}) })
    } catch (err) {
      monitoringError.value = err.message || 'Erreur chargement logs'
      console.error('Erreur chargement logs:', err)
    } finally {
      monitoringLoading.value = false
    }
  }

  async function fetchMetrics(period = '24h') {
    monitoringLoading.value = true
    monitoringError.value = null
    try {
      metrics.value = await adminService.getMetrics({ period })
    } catch (err) {
      monitoringError.value = err.message || 'Erreur chargement métriques'
      console.error('Erreur chargement métriques:', err)
    } finally {
      monitoringLoading.value = false
    }
  }

  async function fetchAlerts() {
    monitoringLoading.value = true
    monitoringError.value = null
    try {
      alerts.value = await adminService.getAlerts()
    } catch (err) {
      monitoringError.value = err.message || 'Erreur chargement alertes'
      console.error('Erreur chargement alertes:', err)
    } finally {
      monitoringLoading.value = false
    }
  }

  async function resolveAlert(alertId) {
    monitoringLoading.value = true
    monitoringError.value = null
    try {
      await adminService.resolveAlert(alertId)
      const index = alerts.value.findIndex(a => a.id === alertId)
      if (index !== -1) {
        alerts.value[index].resolved = true
        alerts.value[index].resolvedAt = new Date().toISOString()
      }
    } catch (err) {
      monitoringError.value = err.message
      throw err
    } finally {
      monitoringLoading.value = false
    }
  }

  async function loadAllMonitoringData() {
    await Promise.all([
      fetchSystemStatus(),
      fetchLogs(),
      fetchMetrics(),
      fetchAlerts()
    ])
  }

  function resetStore() {
    users.value = []
    selectedUser.value = null
    userLoading.value = false
    userError.value = null
    clearUserFilters()

    systemStatus.value = {
      apiStatus: 'unknown',
      databaseStatus: 'unknown',
      lastUpdate: null,
      activeUsers: 0,
      requestsPerMinute: 0,
      errorRate: 0
    }
    logs.value = []
    metrics.value = []
    alerts.value = []
    monitoringLoading.value = false
    monitoringError.value = null
  }

  return {
    // State - Users
    users,
    selectedUser,
    userLoading,
    userError,
    userFilters,

    // State - Monitoring
    systemStatus,
    logs,
    metrics,
    alerts,
    monitoringLoading,
    monitoringError,

    // Getters - Users
    userCount,
    filteredUsers,
    usersByRole,
    activeUsersCount,

    // Getters - Monitoring
    isSystemHealthy,
    criticalAlerts,
    recentLogs,

    // Actions - Users
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    changeUserRole,
    searchUsers,
    setUserFilter,
    clearUserFilters,

    // Actions - Monitoring
    fetchSystemStatus,
    fetchLogs,
    fetchMetrics,
    fetchAlerts,
    resolveAlert,
    loadAllMonitoringData,

    resetStore
  }
})