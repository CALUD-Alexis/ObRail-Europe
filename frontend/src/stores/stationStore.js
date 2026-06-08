import { useStationStore } from '@/stores/stationStore'

const stationStore = useStationStore()

// État
stationStore.stations   // Liste des gares
stationStore.stationCount // Nombre de gares

// Getters
stationStore.getStationsByCountry('France')
stationStore.sortedStations

// Actions
await stationStore.fetchStations()
await stationStore.addStation(stationData)