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
    <div v-if="trajetStore.error" class="alert alert-error">⚠️ {{ trajetStore.error }}</div>

    <div class="card p-0" v-if="!trajetStore.loading && trajetStore.filteredTrajets.length > 0">
      <table class="data-table">
        <thead>
          <tr>
            <th>N° Train</th>
            <th>Type</th>
            <th>Départ</th>
            <th>Arrivée</th>
            <th>Opérateur</th>
            <th>Durée</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trajet in trajetStore.filteredTrajets" :key="trajet.id">
            <td class="font-bold text-primary">{{ trajet.train_number || `#${trajet.id}` }}</td>
            <td>
              <span :class="['badge', trajet.train_type === 'night' ? 'badge-night' : 'badge-day']">
                {{ trajet.train_type === 'night' ? '🌙 Nuit' : '☀️ Jour' }}
              </span>
            </td>
            <td>{{ trajet.departure_station }}</td>
            <td>{{ trajet.arrival_station }}</td>
            <td>{{ trajet.operator }}</td>
            <td>{{ formatDuration(trajet.duration_minutes) }}</td>
            <td>
              <button @click="viewDetails(trajet.id)" class="btn btn-secondary btn-sm">Détails</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!trajetStore.loading && trajetStore.filteredTrajets.length === 0 && !trajetStore.error" class="alert alert-info">
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

onMounted(() => trajetStore.fetchTrajets())

let searchTimeout
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => trajetStore.searchTrajets(searchQuery.value), 300)
}

function formatDuration(minutes) {
  if (!minutes) return '-'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function viewDetails(id) { router.push(`/trajets/${id}`) }
function addNewTrajet() { router.push('/trajets/new') }
</script>
