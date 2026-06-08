import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store pour gérer le Dashboard avec statistiques et graphiques
 * Route suggérée : /stats/dashboard
 */
export const useDashboardStore = defineStore('dashboard', () => {
  // État
  const stats = ref({
    totalTrajets: 0,
    trajetsActifs: 0,
    totalGares: 0,
    totalOperateurs: 0,
    consommationJour: 0,
    consommationMois: 0,
    consommationAnnee: 0
  })

  const consommationData = ref([])
  const trajetsParMois = ref([])
  const repartitionOperateurs = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const tauxUtilisation = computed(() => {
    if (stats.value.totalTrajets === 0) return 0
    return Math.round((stats.value.trajetsActifs / stats.value.totalTrajets) * 100)
  })

  const consommationMoyenne = computed(() => {
    if (consommationData.value.length === 0) return 0
    const total = consommationData.value.reduce((sum, item) => sum + item.value, 0)
    return (total / consommationData.value.length).toFixed(2)
  })

  // Actions
  async function fetchDashboardStats() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      stats.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement stats:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchConsommationData(period = 'month') {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/dashboard/consommation?period=${period}`)
      const data = await response.json()
      consommationData.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement consommation:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTrajetsParMois() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/dashboard/trajets-par-mois')
      const data = await response.json()
      trajetsParMois.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement trajets par mois:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRepartitionOperateurs() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/dashboard/operateurs-repartition')
      const data = await response.json()
      repartitionOperateurs.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement répartition opérateurs:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadAllDashboardData() {
    await Promise.all([
      fetchDashboardStats(),
      fetchConsommationData(),
      fetchTrajetsParMois(),
      fetchRepartitionOperateurs()
    ])
  }

  function resetStore() {
    stats.value = {
      totalTrajets: 0,
      trajetsActifs: 0,
      totalGares: 0,
      totalOperateurs: 0,
      consommationJour: 0,
      consommationMois: 0,
      consommationAnnee: 0
    }
    consommationData.value = []
    trajetsParMois.value = []
    repartitionOperateurs.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    stats,
    consommationData,
    trajetsParMois,
    repartitionOperateurs,
    loading,
    error,

    // Getters
    tauxUtilisation,
    consommationMoyenne,

    // Actions
    fetchDashboardStats,
    fetchConsommationData,
    fetchTrajetsParMois,
    fetchRepartitionOperateurs,
    loadAllDashboardData,
    resetStore
  }
})