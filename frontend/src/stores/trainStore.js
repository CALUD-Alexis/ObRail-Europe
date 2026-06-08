import { useTrainStore } from '@/stores/trainStore'

const trainStore = useTrainStore()

// État
trainStore.trains       // Liste des trains
trainStore.selectedTrain // Train sélectionné
trainStore.loading      // État de chargement
trainStore.trainCount   // Nombre total de trains
trainStore.activTrains  // Trains actifs uniquement

// Actions
await trainStore.fetchTrains()
await trainStore.addTrain(trainData)
await trainStore.updateTrain(id, updates)
await trainStore.deleteTrain(id)
trainStore.selectTrain(train)
trainStore.clearSelection()