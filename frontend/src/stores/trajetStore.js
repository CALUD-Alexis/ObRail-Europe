import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store pour gérer les trajets ferroviaires
 * Routes suggérées :
 * - /trajets (liste avec recherche et filtres)
 * - /trajets/:id (détail avec fiche technique + carte)
 */
export const useTrajetStore = defineStore('trajet', () => {
  // État
  const trajets = ref([])
  const selectedTrajet = ref(null)
  const trajetDetails = ref(null) // Détails complets avec infos techniques
  const loading = ref(false)
  const error = ref(null)

  // Filtres
  const filters = ref({
    searchQuery: '',
    gareDepart: null,
    gareArrivee: null,
    operateur: null,
    dateDebut: null,
    dateFin: null,
    statut: 'tous' // 'tous', 'actif', 'termine', 'annule'
  })

  // Getters
  const trajetCount = computed(() => trajets.value.length)

  const filteredTrajets = computed(() => {
    let result = trajets.value

    // Recherche textuelle
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(t => 
        t.numero?.toLowerCase().includes(query) ||
        t.gareDepart?.toLowerCase().includes(query) ||
        t.gareArrivee?.toLowerCase().includes(query) ||
        t.operateur?.toLowerCase().includes(query)
      )
    }

    // Filtre par gare de départ
    if (filters.value.gareDepart) {
      result = result.filter(t => t.gareDepartId === filters.value.gareDepart)
    }

    // Filtre par gare d'arrivée
    if (filters.value.gareArrivee) {
      result = result.filter(t => t.gareArriveeId === filters.value.gareArrivee)
    }

    // Filtre par opérateur
    if (filters.value.operateur) {
      result = result.filter(t => t.operateurId === filters.value.operateur)
    }

    // Filtre par statut
    if (filters.value.statut !== 'tous') {
      result = result.filter(t => t.statut === filters.value.statut)
    }

    // Filtre par date
    if (filters.value.dateDebut) {
      result = result.filter(t => new Date(t.dateDepart) >= new Date(filters.value.dateDebut))
    }

    if (filters.value.dateFin) {
      result = result.filter(t => new Date(t.dateDepart) <= new Date(filters.value.dateFin))
    }

    return result
  })

  const trajetsActifs = computed(() => 
    trajets.value.filter(t => t.statut === 'actif')
  )

  const getTrajetById = computed(() => {
    return (id) => trajets.value.find(t => t.id === id)
  })

  // Actions
  async function fetchTrajets() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/trajets')
      const data = await response.json()
      trajets.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement trajets:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTrajetDetails(id) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/trajets/${id}/details`)
      const data = await response.json()
      trajetDetails.value = data
      // Les détails incluent : fiche technique, coordonnées GPS, horaires, arrêts intermédiaires
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement détails trajet:', err)
    } finally {
      loading.value = false
    }
  }

  async function searchTrajets(query) {
    filters.value.searchQuery = query
    // La recherche est gérée par le computed filteredTrajets
  }

  function setFilter(filterName, value) {
    if (filters.value.hasOwnProperty(filterName)) {
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
      statut: 'tous'
    }
  }

  async function addTrajet(trajetData) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/trajets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trajetData)
      })
      const newTrajet = await response.json()
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
      const response = await fetch(`/api/trajets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const updatedTrajet = await response.json()

      const index = trajets.value.findIndex(t => t.id === id)
      if (index !== -1) {
        trajets.value[index] = updatedTrajet
      }
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
      await fetch(`/api/trajets/${id}`, { method: 'DELETE' })
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
    clearFilters()
  }

  return {
    // State
    trajets,
    selectedTrajet,
    trajetDetails,
    loading,
    error,
    filters,

    // Getters
    trajetCount,
    filteredTrajets,
    trajetsActifs,
    getTrajetById,

    // Actions
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