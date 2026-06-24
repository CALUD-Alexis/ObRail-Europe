import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { trajetService } from '@/api/services'

export const useTrajetStore = defineStore('trajet', () => {
  const trajets = ref([])
  const selectedTrajet = ref(null)
  const trajetDetails = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Pagination
  const pagination = ref({ total: 0, perPage: 20, currentPage: 1, lastPage: 1 })

  const filters = ref({
    searchQuery: '',
    gareDepart: null,
    gareArrivee: null,
    operateur: null,
    dateDebut: null,
    dateFin: null,
    statut: 'tous',
    service: 'tous'
  })

  const trajetCount = computed(() => pagination.value.total || trajets.value.length)

  const filteredTrajets = computed(() => {
    let result = trajets.value

    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(t =>
        t.train_number?.toLowerCase().includes(query) ||
        t.departure_station?.toLowerCase().includes(query) ||
        t.arrival_station?.toLowerCase().includes(query) ||
        t.operator?.toLowerCase().includes(query)
      )
    }

    if (filters.value.service !== 'tous') {
      const typeMap = { jour: 'day', nuit: 'night' }
      result = result.filter(t => t.train_type === typeMap[filters.value.service])
    }

    if (filters.value.operateur) {
      result = result.filter(t => t.operator === filters.value.operateur)
    }

    return result
  })

  const trajetsActifs = computed(() => trajets.value.filter(t => t.active))

  const getTrajetById = computed(() => (id) => trajets.value.find(t => t.id === id))

  function normalizeTrajetsDetails(trajet) {
    const durationH = Math.floor((trajet.duration_minutes || 0) / 60)
    const durationM = (trajet.duration_minutes || 0) % 60
    return {
      ...trajet,
      numero: trajet.train_number || `#${trajet.id}`,
      statut: trajet.active ? 'actif' : 'inactif',
      gareDepart: trajet.departure_station,
      gareArrivee: trajet.arrival_station,
      operateur: trajet.operator,
      heureDepart: trajet.departure_time,
      heureArrivee: trajet.arrival_time,
      duree: durationH > 0 ? `${durationH}h ${durationM}m` : `${durationM}m`,
      typeTrain: trajet.train_type === 'night' ? 'Nuit' : 'Jour',
      arrets: []
    }
  }

  async function fetchTrajets(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await trajetService.getAll(params)
      // Lucid paginator : { meta: {...}, data: [...] }
      if (response.data) {
        trajets.value = response.data
        pagination.value = {
          total: response.meta?.total || response.data.length,
          perPage: response.meta?.perPage || 20,
          currentPage: response.meta?.currentPage || 1,
          lastPage: response.meta?.lastPage || 1
        }
      } else {
        trajets.value = Array.isArray(response) ? response : []
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des trajets'
      console.error('Erreur chargement trajets:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTrajetDetails(id) {
    loading.value = true
    error.value = null
    try {
      const trajet = await trajetService.getById(id)
      trajetDetails.value = normalizeTrajetsDetails(trajet)
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des détails du trajet'
      console.error('Erreur chargement détails trajet:', err)
    } finally {
      loading.value = false
    }
  }

  async function searchTrajets(query) {
    filters.value.searchQuery = query
  }

  function setFilter(filterName, value) {
    if (Object.prototype.hasOwnProperty.call(filters.value, filterName)) {
      filters.value[filterName] = value
    }
  }

  function clearFilters() {
    filters.value = {
      searchQuery: '',
      gareDepart: null,
      gareArrivee: null,
      operateur: null,
      dateDebut: null,
      dateFin: null,
      statut: 'tous',
      service: 'tous'
    }
  }

  async function addTrajet(trajetData) {
    loading.value = true
    error.value = null
    try {
      const newTrajet = await trajetService.create(trajetData)
      trajets.value.push(newTrajet)
      return newTrajet
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTrajet(id, updates) {
    loading.value = true
    error.value = null
    try {
      const updatedTrajet = await trajetService.update(id, updates)
      const index = trajets.value.findIndex(t => t.id === id)
      if (index !== -1) trajets.value[index] = updatedTrajet
      return updatedTrajet
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTrajet(id) {
    loading.value = true
    error.value = null
    try {
      await trajetService.delete(id)
      trajets.value = trajets.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function selectTrajet(trajet) {
    selectedTrajet.value = trajet
  }

  function clearSelection() {
    selectedTrajet.value = null
    trajetDetails.value = null
  }

  function resetStore() {
    trajets.value = []
    selectedTrajet.value = null
    trajetDetails.value = null
    loading.value = false
    error.value = null
    pagination.value = { total: 0, perPage: 20, currentPage: 1, lastPage: 1 }
    clearFilters()
  }

  return {
    trajets,
    selectedTrajet,
    trajetDetails,
    loading,
    error,
    filters,
    pagination,
    trajetCount,
    filteredTrajets,
    trajetsActifs,
    getTrajetById,
    fetchTrajets,
    fetchTrajetDetails,
    searchTrajets,
    setFilter,
    clearFilters,
    addTrajet,
    updateTrajet,
    deleteTrajet,
    selectTrajet,
    clearSelection,
    resetStore
  }
})
