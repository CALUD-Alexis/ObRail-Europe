import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import trajetsMock from '@/mocks/trajets.json'

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
        t.trip_id?.toLowerCase().includes(query) ||
        t.origin_station?.toLowerCase().includes(query) ||
        t.destination_station?.toLowerCase().includes(query) ||
        t.agency_id?.toLowerCase().includes(query) ||
        t.route_name?.toLowerCase().includes(query)
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
      // On simule l'attente du réseau (500ms)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // On charge nos fausses données !
      trajets.value = trajetsMock
    } catch (err) {
      error.value = "Erreur lors du chargement des trajets"
      console.error('Erreur chargement trajets:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTrajetDetails(id) {
    loading.value = true
    error.value = null

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // On cherche d'abord les détails basiques depuis les mock existants
      // l'id est un "trip_id" du coup (ex: "TR-1045")
      const baseTrajet = trajets.value.find(t => t.trip_id === id) || {}

      // On crée un mock pour les détails techniques
      trajetDetails.value = {
        ...baseTrajet,
        numero: baseTrajet.route_name,
        statut: baseTrajet.status,
        gareDepart: baseTrajet.origin_station,
        gareArrivee: baseTrajet.destination_station,
        operateur: baseTrajet.agency_id,
        heureDepart: baseTrajet.departure_time || "2026-03-17T08:30:00Z",
        heureArrivee: baseTrajet.arrival_time || "2026-03-17T11:45:00Z",
        duree: "3h 15m",
        typeTrain: baseTrajet.train_type || "TGV Duplex",
        nombreVoitures: 8,
        capacite: 510,
        distance: baseTrajet.distance || 450,
        vitesseMoyenne: 220,
        consommation: 1250,
        arrets: [
          { gare: baseTrajet.origin_station || "Départ", heureArrivee: "08:15", heureDepart: "08:30", dureeArret: 15 },
          { gare: "Gare Intermédiaire", heureArrivee: "10:00", heureDepart: "10:10", dureeArret: 10 },
          { gare: baseTrajet.destination_station || "Arrivée", heureArrivee: "11:45", heureDepart: "12:00", dureeArret: 15 }
        ],
        coordonneesDepart: { lat: 48.8566, lng: 2.3522 },
        coordonneesArrivee: { lat: 45.7640, lng: 4.8357 }
      }
    } catch (err) {
      error.value = "Erreur lors du chargement des détails du trajet"
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