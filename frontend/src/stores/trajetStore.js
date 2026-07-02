import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/axios'

export const useTrajetStore = defineStore('trajet', () => {
  const trajets = ref([])           // Liste des trajets de la page courante
  const selectedTrajet = ref(null)  // Trajet affiché sur la page de détail
  const loading = ref(false)
  const error = ref(null)

  // Métadonnées de pagination retournées par l'API
  const pagination = ref({ total: 0, perPage: 50, currentPage: 1, lastPage: 1 })

  // Filtres actifs — ils sont envoyés comme paramètres à l'API (filtrage côté serveur)
  const filters = ref({
    searchQuery: '',
    serviceType: 'tous',
  })

  // Charge une page de trajets en appliquant les filtres actifs
  async function fetchTrajets(page = 1) {
    loading.value = true
    error.value = null
    try {
      const params = { page, limit: 50 }
      if (filters.value.serviceType !== 'tous') params.serviceType = filters.value.serviceType
      if (filters.value.searchQuery) params.search = filters.value.searchQuery

      const response = await apiClient.get('/trajets', { params })
      trajets.value = response.data.data   // tableau de trajets
      pagination.value = response.data.meta // { total, perPage, currentPage, lastPage }
    } catch (err) {
      error.value = 'Erreur lors du chargement des trajets'
    } finally {
      loading.value = false
    }
  }

  // Charge le détail complet d'un trajet (page /trajets/:id)
  async function fetchTrajetDetails(id) {
    loading.value = true
    error.value = null
    selectedTrajet.value = null
    try {
      const response = await apiClient.get(`/trajets/${id}`)
      selectedTrajet.value = response.data
    } catch (err) {
      error.value = err.status === 404 ? 'Trajet introuvable' : 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  // Lance une recherche textuelle (appelée avec debounce depuis la vue)
  function searchTrajets(query) {
    filters.value.searchQuery = query
    fetchTrajets()
  }

  // Modifie un filtre et recharge la liste (ex: setFilter('serviceType', 'Nuit'))
  function setFilter(key, value) {
    if (key in filters.value) filters.value[key] = value
    fetchTrajets()
  }

  // Remet tous les filtres à zéro et recharge
  function clearFilters() {
    filters.value = { searchQuery: '', serviceType: 'tous' }
    fetchTrajets()
  }

  return {
    trajets, selectedTrajet, loading, error, pagination, filters,
    fetchTrajets, fetchTrajetDetails, searchTrajets, setFilter, clearFilters,
  }
})
