import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store pour gérer les opérateurs ferroviaires
 * (Listes référentielles et Fiches détaillées)
 * Routes suggérées :
 * - /operateurs (liste référentielle)
 * - /operateurs/:id (fiche détaillée)
 */
export const useOperateurStore = defineStore('operateur', () => {
  // État
  const operateurs = ref([])
  const selectedOperateur = ref(null)
  const operateurDetails = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Filtres pour la liste
  const filters = ref({
    searchQuery: '',
    pays: null,
    typeService: null, // 'TGV', 'Intercités', 'Régional', etc.
    actif: true
  })

  // Getters
  const operateurCount = computed(() => operateurs.value.length)

  const filteredOperateurs = computed(() => {
    let result = operateurs.value

    // Recherche textuelle
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(o =>
        o.nom?.toLowerCase().includes(query) ||
        o.code?.toLowerCase().includes(query) ||
        o.pays?.toLowerCase().includes(query)
      )
    }

    // Filtre par pays
    if (filters.value.pays) {
      result = result.filter(o => o.pays === filters.value.pays)
    }

    // Filtre par type de service
    if (filters.value.typeService) {
      result = result.filter(o => o.typeService === filters.value.typeService)
    }

    // Filtre actif/inactif
    if (filters.value.actif !== null) {
      result = result.filter(o => o.actif === filters.value.actif)
    }

    return result
  })

  const operateursParPays = computed(() => {
    const grouped = {}
    operateurs.value.forEach(op => {
      if (!grouped[op.pays]) {
        grouped[op.pays] = []
      }
      grouped[op.pays].push(op)
    })
    return grouped
  })

  const getOperateurById = computed(() => {
    return (id) => operateurs.value.find(o => o.id === id)
  })

  // Actions
  async function fetchOperateurs() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/operateurs')
      const data = await response.json()
      operateurs.value = data
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement opérateurs:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchOperateurDetails(id) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/operateurs/${id}/details`)
      const data = await response.json()
      operateurDetails.value = data
      // Détails incluent : infos complètes, historique, statistiques, contacts
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement détails opérateur:', err)
    } finally {
      loading.value = false
    }
  }

  async function searchOperateurs(query) {
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
      typeService: null,
      actif: true
    }
  }

  async function addOperateur(operateurData) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/operateurs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operateurData)
      })
      const newOperateur = await response.json()
      operateurs.value.push(newOperateur)
      return newOperateur
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateOperateur(id, updates) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/operateurs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const updatedOperateur = await response.json()

      const index = operateurs.value.findIndex(o => o.id === id)
      if (index !== -1) {
        operateurs.value[index] = updatedOperateur
      }
      return updatedOperateur
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteOperateur(id) {
    loading.value = true
    error.value = null

    try {
      await fetch(`/api/operateurs/${id}`, { method: 'DELETE' })
      operateurs.value = operateurs.value.filter(o => o.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function selectOperateur(operateur) {
    selectedOperateur.value = operateur
  }

  function clearSelection() {
    selectedOperateur.value = null
    operateurDetails.value = null
  }

  function resetStore() {
    operateurs.value = []
    selectedOperateur.value = null
    operateurDetails.value = null
    loading.value = false
    error.value = null
    clearFilters()
  }

  return {
    // State
    operateurs,
    selectedOperateur,
    operateurDetails,
    loading,
    error,
    filters,

    // Getters
    operateurCount,
    filteredOperateurs,
    operateursParPays,
    getOperateurById,

    // Actions
    fetchOperateurs,
    fetchOperateurDetails,
    searchOperateurs,
    setFilter,
    clearFilters,
    addOperateur,
    updateOperateur,
    deleteOperateur,
    selectOperateur,
    clearSelection,
    resetStore
  }
})