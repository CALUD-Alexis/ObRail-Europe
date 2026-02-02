<template>
  <div class="trajets-container">
    <h1>🚂 Trajets Ferroviaires</h1>

    <!-- Barre de recherche et filtres -->
    <div class="search-filters">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          @input="handleSearch"
          type="text" 
          placeholder="🔍 Rechercher un trajet (numéro, gare, opérateur...)"
          class="search-input"
        />
      </div>

      <div class="filters-row">
        <select v-model="trajetStore.filters.statut" class="filter-select">
          <option value="tous">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="termine">Terminé</option>
          <option value="annule">Annulé</option>
        </select>

        <select v-model="trajetStore.filters.gareDepart" class="filter-select">
          <option :value="null">Toutes les gares de départ</option>
          <option value="1">Paris Gare du Nord</option>
          <option value="2">Lyon Part-Dieu</option>
          <!-- Charger dynamiquement depuis gareStore -->
        </select>

        <select v-model="trajetStore.filters.gareArrivee" class="filter-select">
          <option :value="null">Toutes les gares d'arrivée</option>
          <option value="1">Marseille St-Charles</option>
          <option value="2">Lille Europe</option>
          <!-- Charger dynamiquement depuis gareStore -->
        </select>

        <button @click="trajetStore.clearFilters()" class="btn-clear-filters">
          🗑️ Effacer les filtres
        </button>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="stats-bar">
      <span>Total: <strong>{{ trajetStore.trajetCount }}</strong> trajets</span>
      <span>Affichés: <strong>{{ trajetStore.filteredTrajets.length }}</strong></span>
      <span>Actifs: <strong>{{ trajetStore.trajetsActifs.length }}</strong></span>
    </div>

    <!-- Messages -->
    <div v-if="trajetStore.loading" class="loading-message">
      Chargement des trajets...
    </div>

    <div v-if="trajetStore.error" class="error-message">
      ⚠️ Erreur: {{ trajetStore.error }}
    </div>

    <!-- Tableau des trajets -->
    <div v-if="!trajetStore.loading && trajetStore.filteredTrajets.length > 0" class="table-container">
      <table class="trajets-table">
        <thead>
          <tr>
            <th>N° Trajet</th>
            <th>Départ</th>
            <th>Arrivée</th>
            <th>Opérateur</th>
            <th>Date/Heure</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trajet in trajetStore.filteredTrajets" :key="trajet.id">
            <td class="trajet-numero">{{ trajet.numero }}</td>
            <td>{{ trajet.gareDepart }}</td>
            <td>{{ trajet.gareArrivee }}</td>
            <td>{{ trajet.operateur }}</td>
            <td>{{ formatDateTime(trajet.dateDepart) }}</td>
            <td>
              <span :class="['badge', `badge-${trajet.statut}`]">
                {{ trajet.statut }}
              </span>
            </td>
            <td class="actions-cell">
              <button @click="viewDetails(trajet.id)" class="btn-icon" title="Voir détails">
                👁️
              </button>
              <button @click="editTrajet(trajet.id)" class="btn-icon" title="Modifier">
                ✏️
              </button>
              <button @click="deleteTrajet(trajet.id)" class="btn-icon btn-danger" title="Supprimer">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Message si aucun résultat -->
    <div v-if="!trajetStore.loading && trajetStore.filteredTrajets.length === 0" class="no-results">
      <p>😕 Aucun trajet trouvé avec ces critères</p>
      <button @click="trajetStore.clearFilters()" class="btn-primary">
        Réinitialiser les filtres
      </button>
    </div>

    <!-- Bouton d'ajout -->
    <button @click="addNewTrajet" class="btn-add-floating">
      ➕
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTrajetStore } from '@/stores/trajetStore'

const router = useRouter()
const trajetStore = useTrajetStore()
const searchQuery = ref('')

// Charger les trajets au montage
onMounted(() => {
  trajetStore.fetchTrajets()
})

// Recherche avec debounce
let searchTimeout
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    trajetStore.searchTrajets(searchQuery.value)
  }, 300)
}

// Formater date et heure
function formatDateTime(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Voir les détails d'un trajet
function viewDetails(id) {
  router.push(`/trajets/${id}`)
}

// Éditer un trajet
function editTrajet(id) {
  router.push(`/trajets/${id}/edit`)
}

// Supprimer un trajet
async function deleteTrajet(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
    try {
      await trajetStore.deleteTrajet(id)
      alert('Trajet supprimé avec succès')
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }
}

// Ajouter un nouveau trajet
function addNewTrajet() {
  router.push('/trajets/new')
}
</script>

<style scoped>
.trajets-container {
  padding: 30px;
  max-width: 1600px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

/* Recherche et filtres */
.search-filters {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #1976d2;
}

.filters-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-select {
  flex: 1;
  min-width: 200px;
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
}

.btn-clear-filters {
  padding: 10px 25px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear-filters:hover {
  background: #e0e0e0;
}

/* Barre de stats */
.stats-bar {
  display: flex;
  gap: 30px;
  padding: 15px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  margin-bottom: 25px;
  font-size: 0.95rem;
}

.stats-bar strong {
  font-size: 1.1rem;
}

/* Messages */
.loading-message {
  background: #e3f2fd;
  color: #1976d2;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-results p {
  font-size: 1.2rem;
  color: #777;
  margin-bottom: 20px;
}

/* Tableau */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.trajets-table {
  width: 100%;
  border-collapse: collapse;
}

.trajets-table thead {
  background: #f5f5f5;
}

.trajets-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
}

.trajets-table td {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.trajets-table tbody tr:hover {
  background: #f9f9f9;
}

.trajet-numero {
  font-weight: 600;
  color: #1976d2;
}

/* Badges de statut */
.badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge-actif {
  background: #c8e6c9;
  color: #2e7d32;
}

.badge-termine {
  background: #e0e0e0;
  color: #616161;
}

.badge-annule {
  background: #ffcdd2;
  color: #c62828;
}

/* Actions */
.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 8px 12px;
  border: none;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-icon:hover {
  background: #e0e0e0;
  transform: scale(1.1);
}

.btn-danger:hover {
  background: #ffcdd2;
}

/* Bouton flottant d'ajout */
.btn-add-floating {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
  z-index: 100;
}

.btn-add-floating:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.btn-primary {
  padding: 12px 30px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #1565c0;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .trajets-container {
    padding: 15px;
  }

  .filters-row {
    flex-direction: column;
  }

  .filter-select {
    min-width: 100%;
  }

  .stats-bar {
    flex-direction: column;
    gap: 10px;
  }

  .table-container {
    overflow-x: auto;
  }

  .trajets-table {
    font-size: 0.85rem;
  }

  .trajets-table th,
  .trajets-table td {
    padding: 10px 8px;
  }
}
</style>