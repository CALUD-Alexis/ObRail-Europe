import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { statsService } from '@/api/services'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    totalTrajets: 0,
    trajetsActifs: 0,
    totalGares: 0,
    totalOperateurs: 0,
    durationAvgMinutes: 0,
    priceAvg: null
  })

  const repartitionOperateurs = ref([])
  const repartitionTypes = ref([])
  const repartitionPays = ref([])
  const loading = ref(false)
  const error = ref(null)

  const tauxUtilisation = computed(() => {
    if (stats.value.totalTrajets === 0) return 0
    return Math.round((stats.value.trajetsActifs / stats.value.totalTrajets) * 100)
  })

  async function fetchDashboardStats() {
    loading.value = true
    error.value = null
    try {
      const data = await statsService.getVolumes()
      stats.value = {
        totalTrajets: data.total,
        trajetsActifs: data.total,
        totalGares: 0,
        totalOperateurs: data.byOperator?.length || 0,
        durationAvgMinutes: data.averages?.durationMinutes || 0,
        priceAvg: data.averages?.price || null
      }
      repartitionOperateurs.value = data.byOperator || []
      repartitionTypes.value = data.byTrainType || []
      repartitionPays.value = data.byDepartureCountry || []
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des statistiques'
      console.error('Erreur chargement stats:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadAllDashboardData() {
    await fetchDashboardStats()
  }

  function resetStore() {
    stats.value = {
      totalTrajets: 0,
      trajetsActifs: 0,
      totalGares: 0,
      totalOperateurs: 0,
      durationAvgMinutes: 0,
      priceAvg: null
    }
    repartitionOperateurs.value = []
    repartitionTypes.value = []
    repartitionPays.value = []
    loading.value = false
    error.value = null
  }

  return {
    stats,
    repartitionOperateurs,
    repartitionTypes,
    repartitionPays,
    loading,
    error,
    tauxUtilisation,
    fetchDashboardStats,
    loadAllDashboardData,
    resetStore
  }
})
