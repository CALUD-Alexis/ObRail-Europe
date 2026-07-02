import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/axios'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function loadAllDashboardData() {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/stats/volumes')
      stats.value = response.data
    } catch (err) {
      error.value = 'Impossible de charger les statistiques'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  function resetStore() {
    stats.value = null
    loading.value = false
    error.value = null
  }

  return { stats, loading, error, loadAllDashboardData, resetStore }
})
