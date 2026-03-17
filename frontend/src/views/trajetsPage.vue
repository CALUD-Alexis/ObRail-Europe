<template>
  <div class="page-container">
    <div class="page-header">
      <h1>🚂 Trajets Ferroviaires</h1>
      <button @click="addNewTrajet" class="btn btn-primary">➕ Nouveau Trajet</button>
    </div>

    <div class="card mb-2">
      <div class="grid-4">
        <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="🔍 Rechercher..." class="form-input" />
        <select v-model="trajetStore.filters.service" class="form-select">
          <option value="tous">Tous les services</option>
          <option value="jour">☀️ Trains de Jour</option>
          <option value="nuit">🌙 Trains de Nuit</option>
        </select>
        <select v-model="trajetStore.filters.statut" class="form-select">
          <option value="tous">Tous les statuts</option>
          <option value="actif">Actif</option>
        </select>
        <button @click="trajetStore.clearFilters()" class="btn btn-secondary">🗑️ Effacer</button>
      </div>
    </div>

    <div v-if="trajetStore.loading" class="alert alert-info">Chargement...</div>

    <div class="card p-0" v-if="!trajetStore.loading && trajetStore.filteredTrajets.length > 0">
      <table class="data-table">
        <thead>
          <tr>
            <th>N° Trajet</th>
            <th>Type</th>
            <th>Départ</th>
            <th>Arrivée</th>
            <th>Opérateur</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trajet in trajetStore.filteredTrajets" :key="trajet.trip_id">
            <td class="font-bold text-primary">{{ trajet.trip_id }} ({{ trajet.route_name }})</td>
            <td>
               <span :class="['badge', trajet.service_type?.toLowerCase() === 'nuit' ? 'badge-night' : 'badge-day']">
                 {{ trajet.service_type || 'Jour' }}
               </span>
            </td>
            <td>{{ trajet.origin_station }}</td>
            <td>{{ trajet.destination_station }}</td>
            <td>{{ trajet.agency_id }}</td>
            <td><span class="badge badge-success">{{ trajet.status }}</span></td>
            <td>
              <button @click="viewDetails(trajet.trip_id)" class="btn btn-secondary btn-sm">Détails</button>
            </td>
          </tr>
        </tbody>
      </table>
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

onMounted(() => trajetStore.fetchTrajets())

let searchTimeout
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => trajetStore.searchTrajets(searchQuery.value), 300)
}

function viewDetails(id) { router.push(`/trajets/${id}`) }
function addNewTrajet() { router.push('/trajets/new') }
</script>