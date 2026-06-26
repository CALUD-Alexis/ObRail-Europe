<template>
  <div class="page-container">
    <button @click="goBack" class="btn btn-secondary mb-2" data-cy="btn-back">
      ← Retour à la liste
    </button>

    <div v-if="trajetStore.loading" class="alert alert-info" data-cy="loading">
      Chargement des détails...
    </div>

    <div v-if="trajetStore.error" class="alert alert-error" data-cy="error">
      {{ trajetStore.error }}
    </div>

    <div v-if="trajetStore.selectedTrajet" data-cy="trajet-detail">
      <div class="page-header">
        <h1>Trajet {{ trajetStore.selectedTrajet.tripId }}</h1>
        <span :class="['badge', trajetStore.selectedTrajet.serviceType === 'Nuit' ? 'badge-night' : 'badge-day']">
          {{ trajetStore.selectedTrajet.serviceType || 'Jour' }}
        </span>
      </div>

      <div class="grid-2 mb-2">
        <div class="card">
          <h3 class="text-muted">Itinéraire</h3>
          <p class="text-xl font-bold" data-cy="route-origin">
            {{ trajetStore.selectedTrajet.originCity }}
            <span class="text-muted">({{ trajetStore.selectedTrajet.originCountry }})</span>
          </p>
          <p class="text-muted">→</p>
          <p class="text-xl font-bold" data-cy="route-destination">
            {{ trajetStore.selectedTrajet.destinationCity }}
            <span class="text-muted">({{ trajetStore.selectedTrajet.destinationCountry }})</span>
          </p>
        </div>

        <div class="card">
          <h3 class="text-muted">Opérateur</h3>
          <p class="text-xl font-bold" data-cy="agency">{{ trajetStore.selectedTrajet.agencyId }}</p>
          <h3 class="text-muted mt-1">Type de train</h3>
          <p class="font-bold">{{ trajetStore.selectedTrajet.trainType || '—' }}</p>
        </div>
      </div>

      <div class="card">
        <h3>Fiche technique</h3>
        <div class="grid-4 mt-2">
          <div>
            <p class="text-muted">Départ</p>
            <p class="font-bold" data-cy="departure-time">{{ trajetStore.selectedTrajet.departureTime || '—' }}</p>
          </div>
          <div>
            <p class="text-muted">Arrivée</p>
            <p class="font-bold">{{ trajetStore.selectedTrajet.arrivalTime || '—' }}</p>
          </div>
          <div>
            <p class="text-muted">Distance</p>
            <p class="font-bold">{{ trajetStore.selectedTrajet.distanceKm ? trajetStore.selectedTrajet.distanceKm + ' km' : '—' }}</p>
          </div>
          <div>
            <p class="text-muted">Fréquence / semaine</p>
            <p class="font-bold">{{ trajetStore.selectedTrajet.frequencyPerWeek || '—' }}</p>
          </div>
          <div>
            <p class="text-muted">Émissions CO2</p>
            <p class="font-bold text-success">{{ trajetStore.selectedTrajet.carbonEmissionKg ? trajetStore.selectedTrajet.carbonEmissionKg + ' kg' : '—' }}</p>
          </div>
          <div>
            <p class="text-muted">Source des données</p>
            <p class="font-bold">{{ trajetStore.selectedTrajet.dataSource }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTrajetStore } from '@/stores/trajetStore'

const route = useRoute()
const router = useRouter()
const trajetStore = useTrajetStore()

onMounted(() => {
  trajetStore.fetchTrajetDetails(route.params.id)
})

function goBack() {
  router.push('/trajets')
}
</script>
