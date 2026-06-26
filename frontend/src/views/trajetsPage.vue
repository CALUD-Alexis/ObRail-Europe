<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Trajets Ferroviaires</h1>
    </div>

    <!-- Filtres de recherche -->
    <div class="card mb-2" role="search" aria-label="Filtres de recherche des trajets">
      <div class="grid-4">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="search"
          placeholder="Rechercher (ville, opérateur…)"
          class="form-input"
          aria-label="Rechercher un trajet par ville ou opérateur"
          data-cy="search-input"
        />
        <select
          v-model="selectedServiceType"
          @change="applyServiceFilter"
          class="form-select"
          aria-label="Filtrer par type de service"
          data-cy="filter-service"
        >
          <option value="tous">Tous les services</option>
          <option value="Jour">Trains de Jour</option>
          <option value="Nuit">Trains de Nuit</option>
        </select>
        <button
          @click="resetFilters"
          class="btn btn-secondary"
          aria-label="Effacer tous les filtres de recherche"
          data-cy="clear-filters"
        >
          Effacer les filtres
        </button>
      </div>
    </div>

    <!-- RGAA 7.3 : aria-busy indique que le contenu se charge -->
    <div
      v-if="trajetStore.loading"
      class="alert alert-info"
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-cy="loading"
    >
      Chargement…
    </div>

    <div v-if="trajetStore.error" class="alert alert-error" role="alert" data-cy="error">
      {{ trajetStore.error }}
    </div>

    <!-- Tableau des trajets -->
    <div class="card p-0" v-if="!trajetStore.loading && trajetStore.trajets.length > 0">
      <table
        class="data-table"
        aria-label="Liste des trajets ferroviaires"
        data-cy="trajets-table"
      >
        <thead>
          <tr>
            <th scope="col">ID Trajet</th>
            <th scope="col">Service</th>
            <th scope="col">Départ</th>
            <th scope="col">Arrivée</th>
            <th scope="col">Opérateur</th>
            <th scope="col">Distance (km)</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trajet in trajetStore.trajets" :key="trajet.tripId" data-cy="trajet-row">
            <td class="font-bold text-primary">{{ trajet.tripId }}</td>
            <td>
              <span :class="['badge', trajet.serviceType === 'Nuit' ? 'badge-night' : 'badge-day']">
                {{ trajet.serviceType || 'Jour' }}
              </span>
            </td>
            <td>{{ trajet.originCity }} ({{ trajet.originCountry }})</td>
            <td>{{ trajet.destinationCity }} ({{ trajet.destinationCountry }})</td>
            <td>{{ trajet.agencyId }}</td>
            <td>{{ trajet.distanceKm }}</td>
            <td>
              <button
                @click="viewDetails(trajet.tripId)"
                class="btn btn-secondary btn-sm"
                :aria-label="`Voir les détails du trajet ${trajet.tripId}`"
                data-cy="btn-details"
              >
                Détails
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="card p-2 text-muted">
        Page {{ trajetStore.pagination.currentPage }} / {{ trajetStore.pagination.lastPage }}
        — {{ trajetStore.pagination.total }} trajets au total
        <button
          v-if="trajetStore.pagination.currentPage < trajetStore.pagination.lastPage"
          @click="loadMore"
          class="btn btn-secondary btn-sm"
          style="margin-left: 1rem;"
          aria-label="Charger la page suivante"
          data-cy="btn-load-more"
        >
          Page suivante
        </button>
      </div>
    </div>

    <div
      v-if="!trajetStore.loading && trajetStore.trajets.length === 0"
      class="alert alert-info"
      role="status"
    >
      Aucun trajet trouvé.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTrajetStore } from '@/stores/trajetStore'

const router = useRouter()
const trajetStore = useTrajetStore()
const searchQuery = ref('')
const selectedServiceType = ref('tous')

onMounted(() => trajetStore.fetchTrajets())

// Debounce de 300ms pour ne pas déclencher une requête à chaque touche
let searchTimeout
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => trajetStore.searchTrajets(searchQuery.value), 300)
}

function applyServiceFilter() {
  trajetStore.setFilter('serviceType', selectedServiceType.value)
}

function resetFilters() {
  searchQuery.value = ''
  selectedServiceType.value = 'tous'
  trajetStore.clearFilters()
}

function viewDetails(id) {
  router.push(`/trajets/${id}`)
}

function loadMore() {
  trajetStore.fetchTrajets(trajetStore.pagination.currentPage + 1)
}
</script>
