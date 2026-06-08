import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store pour gérer les gares
 * (Listes référentielles et Fiches détaillées)
 * Routes suggérées :
 * - /gares (liste référentielle)
 * - /gares/:id (fiche détaillée)
 */
export const useGareStore = defineStore('gare', () => {
  // État
  const gares = ref([])
  const selectedGare = ref(null)
  const gareDetails = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Filtres pour la liste
  const filters = ref({
    searchQuery: '',
    pays: null,
    region: null,
    typeGare: null, // 'Principale', 'Secondaire', 'Arrêt'
    actif: true
  })

  // Getters
  const gareCount = computed(() => gares.value.length)

  const filteredGares = computed(() => {
    let result = gares.value

    // Recherche textuelle
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(g =>
        g.nom?.toLowerCase().includes(query) ||
        g.code?.toLowerCase().includes(query) ||
        g.ville?.toLowerCase().includes(query) ||
        g.pays?.toLowerCase().includes(query)
      )
    }

    // Filtre par pays
    if (filters.value.pays) {
      result = result.filter(g => g.pays === filters.value.pays)
    }

    // Filtre par région
    if (filters.value.region) {
      result = result.filter(g => g.region === filters.value.region)
    }

    // Filtre par type de gare
    if (filters.value.typeGare) {
      result = result.filter(g => g.typeGare === filters.value.typeGare)
    }

    // Filtre actif/inactif
    if (filters.value.actif !== null) {
      result = result.filter(g => g.actif === filters.value.actif)
    }

    return result
  })

  const garesParPays = computed(() => {
    const grouped = {}
    gares.value.forEach(gare => {
      if (!grouped[gare.pays]) {
        grouped[gare.pays] = []
      }
      grouped[gare.pays].push(gare)
    })
    return grouped
  })

  const garesParRegion = computed(() => {
    const grouped = {}
    gares.value.forEach(gare => {
      if (!grouped[gare.region]) {
        grouped[gare.region] = []
      }
      grouped[gare.region].push(gare)
    })
    return grouped
  })

  const sortedGares = computed(() => {
    return [...gares.value].sort((a, b) => a.nom.localeCompare(b.nom))
  })

  const getGareById = computed(() => {
    return (id) => gares.value.find(g => g.id === id)
  })

  const getGaresByCountry = computed(() => {
    return (country) => gares.value.filter(g => g.pays === country)
  })

  // Actions
  async function fetchGares() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/gares')
      const data = await response.json()
      gares.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement gares:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchGareDetails(id) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/gares/${id}/details`)
      const data = await response.json()
      gareDetails.value = data
      // Détails incluent : coordonnées GPS, équipements, horaires, connexions
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement détails gare:', err)
    } finally {
      loading.value = false
    }
  }

  async function searchGares(query) {
    filters.value.searchQuery = query
  }

  function setFilter(filterName, value) {
    if (filters.value.hasOwnProperty(filterName)) {
      filters.value[filterName] = value
    }
  }

  function clearFilters() {
    filters.value = {
      searchQuery: '',
      pays: null,
      region: null,
      typeGare: null,
      actif: true
    }
  }

  async function addGare(gareData) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/gares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gareData)
      })
      const newGare = await response.json()
      gares.value.push(newGare)
      return newGare
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateGare(id, updates) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/gares/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const updatedGare = await response.json()

      const index = gares.value.findIndex(g => g.id === id)
      if (index !== -1) {
        gares.value[index] = updatedGare
      }
      return updatedGare
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteGare(id) {
    loading.value = true
    error.value = null

    try {
      await fetch(`/api/gares/${id}`, { method: 'DELETE' })
      gares.value = gares.value.filter(g => g.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function selectGare(gare) {
    selectedGare.value = gare
  }

  function clearSelection() {
    selectedGare.value = null
    gareDetails.value = null
  }

  function resetStore() {
    gares.value = []
    selectedGare.value = null
    gareDetails.value = null
    loading.value = false
    error.value = null
    clearFilters()
  }

  return {
    // State
    gares,
    selectedGare,
    gareDetails,
    loading,
    error,
    filters,

    // Getters
    gareCount,
    filteredGares,
    garesParPays,
    garesParRegion,
    sortedGares,
    getGareById,
    getGaresByCountry,

    // Actions
    fetchGares,
    fetchGareDetails,
    searchGares,
    setFilter,
    clearFilters,
    addGare,
    updateGare,
    deleteGare,
    selectGare,
    clearSelection,
    resetStore
  }
})