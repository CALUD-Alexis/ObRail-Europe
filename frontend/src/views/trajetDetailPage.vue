<template>
  <div class="trajet-detail-container">
    <!-- Bouton retour -->
    <button @click="goBack" class="btn-back">
      ← Retour à la liste
    </button>

    <!-- Chargement -->
    <div v-if="trajetStore.loading" class="loading-message">
      Chargement des détails...
    </div>

    <!-- Erreur -->
    <div v-if="trajetStore.error" class="error-message">
      ⚠️ Erreur: {{ trajetStore.error }}
    </div>

    <!-- Contenu principal -->
    <div v-if="trajetStore.trajetDetails" class="detail-content">
      <!-- En-tête -->
      <div class="detail-header">
        <div class="header-left">
          <h1>🚂 Trajet {{ trajetStore.trajetDetails.numero }}</h1>
          <span :class="['badge-large', `badge-${trajetStore.trajetDetails.statut}`]">
            {{ trajetStore.trajetDetails.statut }}
          </span>
        </div>
        <div class="header-actions">
          <button @click="editTrajet" class="btn-secondary">
            ✏️ Modifier
          </button>
          <button @click="deleteTrajet" class="btn-danger">
            🗑️ Supprimer
          </button>
        </div>
      </div>

      <!-- Informations principales -->
      <div class="info-grid">
        <div class="info-card">
          <div class="info-icon">🚏</div>
          <div class="info-content">
            <h3>Départ</h3>
            <p class="info-value">{{ trajetStore.trajetDetails.gareDepart }}</p>
            <span class="info-detail">{{ formatTime(trajetStore.trajetDetails.heureDepart) }}</span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">🏁</div>
          <div class="info-content">
            <h3>Arrivée</h3>
            <p class="info-value">{{ trajetStore.trajetDetails.gareArrivee }}</p>
            <span class="info-detail">{{ formatTime(trajetStore.trajetDetails.heureArrivee) }}</span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">⏱️</div>
          <div class="info-content">
            <h3>Durée</h3>
            <p class="info-value">{{ trajetStore.trajetDetails.duree }}</p>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">🏢</div>
          <div class="info-content">
            <h3>Opérateur</h3>
            <p class="info-value">{{ trajetStore.trajetDetails.operateur }}</p>
          </div>
        </div>
      </div>

      <!-- Fiche technique -->
      <div class="section-card">
        <h2>📋 Fiche Technique</h2>
        <div class="technical-details">
          <div class="tech-row">
            <span class="tech-label">Type de train:</span>
            <span class="tech-value">{{ trajetStore.trajetDetails.typeTrain || 'TGV' }}</span>
          </div>
          <div class="tech-row">
            <span class="tech-label">Nombre de voitures:</span>
            <span class="tech-value">{{ trajetStore.trajetDetails.nombreVoitures || '8' }}</span>
          </div>
          <div class="tech-row">
            <span class="tech-label">Capacité totale:</span>
            <span class="tech-value">{{ trajetStore.trajetDetails.capacite || '500' }} passagers</span>
          </div>
          <div class="tech-row">
            <span class="tech-label">Distance:</span>
            <span class="tech-value">{{ trajetStore.trajetDetails.distance || '450' }} km</span>
          </div>
          <div class="tech-row">
            <span class="tech-label">Vitesse moyenne:</span>
            <span class="tech-value">{{ trajetStore.trajetDetails.vitesseMoyenne || '200' }} km/h</span>
          </div>
          <div class="tech-row">
            <span class="tech-label">Consommation:</span>
            <span class="tech-value">{{ trajetStore.trajetDetails.consommation || '1250' }} kWh</span>
          </div>
        </div>
      </div>

      <!-- Arrêts intermédiaires -->
      <div class="section-card" v-if="trajetStore.trajetDetails.arrets">
        <h2>🚉 Arrêts Intermédiaires</h2>
        <div class="stops-timeline">
          <div 
            v-for="(arret, index) in trajetStore.trajetDetails.arrets" 
            :key="index"
            class="stop-item"
          >
            <div class="stop-marker">{{ index + 1 }}</div>
            <div class="stop-info">
              <h4>{{ arret.gare }}</h4>
              <p>Arrivée: {{ formatTime(arret.heureArrivee) }} | Départ: {{ formatTime(arret.heureDepart) }}</p>
              <span class="stop-duration">Arrêt de {{ arret.dureeArret }} min</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Carte du trajet -->
      <div class="section-card">
        <h2>🗺️ Carte du Trajet</h2>
        <div class="map-container">
          <div class="map-placeholder">
            <p>📍 Carte interactive du trajet</p>
            <p class="map-info">
              Départ: {{ trajetStore.trajetDetails.coordonneesDepart?.lat }}, 
              {{ trajetStore.trajetDetails.coordonneesDepart?.lng }}
            </p>
            <p class="map-info">
              Arrivée: {{ trajetStore.trajetDetails.coordonneesArrivee?.lat }}, 
              {{ trajetStore.trajetDetails.coordonneesArrivee?.lng }}
            </p>
            <p class="map-note">
              💡 Intégrer ici une carte interactive (Google Maps, Leaflet, Mapbox)
            </p>
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

// Charger les détails au montage
onMounted(() => {
  const trajetId = route.params.id
  trajetStore.fetchTrajetDetails(trajetId)
})

// Formater l'heure
function formatTime(timeString) {
  if (!timeString) return '-'
  return new Date(timeString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Retour à la liste
function goBack() {
  router.push('/trajets')
}

// Éditer le trajet
function editTrajet() {
  router.push(`/trajets/${route.params.id}/edit`)
}

// Supprimer le trajet
async function deleteTrajet() {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
    try {
      await trajetStore.deleteTrajet(route.params.id)
      alert('Trajet supprimé avec succès')
      router.push('/trajets')
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }
}
</script>

<style scoped>
.trajet-detail-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.btn-back {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 25px;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #f5f5f5;
  transform: translateX(-5px);
}

.loading-message,
.error-message {
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 1.1rem;
}

.loading-message {
  background: #e3f2fd;
  color: #1976d2;
}

.error-message {
  background: #ffebee;
  color: #c62828;
}

/* En-tête */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h1 {
  margin: 0;
  color: #2c3e50;
}

.badge-large {
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
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

.header-actions {
  display: flex;
  gap: 15px;
}

.btn-secondary,
.btn-danger {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-secondary {
  background: #1976d2;
  color: white;
}

.btn-secondary:hover {
  background: #1565c0;
  transform: translateY(-2px);
}

.btn-danger {
  background: #d32f2f;
  color: white;
}

.btn-danger:hover {
  background: #c62828;
  transform: translateY(-2px);
}

/* Grille d'informations */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.info-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-icon {
  font-size: 2.5rem;
}

.info-content h3 {
  margin: 0 0 5px 0;
  color: #777;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.info-value {
  margin: 0 0 5px 0;
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
}

.info-detail {
  font-size: 0.9rem;
  color: #999;
}

/* Sections */
.section-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
}

.section-card h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

/* Fiche technique */
.technical-details {
  display: grid;
  gap: 15px;
}

.tech-row {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.tech-label {
  font-weight: 500;
  color: #555;
}

.tech-value {
  font-weight: 600;
  color: #1976d2;
}

/* Timeline des arrêts */
.stops-timeline {
  position: relative;
  padding-left: 50px;
}

.stops-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.stop-item {
  position: relative;
  padding-bottom: 30px;
}

.stop-marker {
  position: absolute;
  left: -38px;
  top: 0;
  width: 40px;
  height: 40px;
  background: #1976d2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.stop-info h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.stop-info p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.stop-duration {
  display: inline-block;
  padding: 3px 10px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 0.85rem;
}

/* Carte */
.map-container {
  margin-top: 20px;
}

.map-placeholder {
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  color: #999;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.map-placeholder p:first-child {
  font-size: 1.5rem;
  margin: 0;
}

.map-info {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.map-note {
  margin-top: 20px;
  font-style: italic;
  color: #999;
}

@media (max-width: 768px) {
  .trajet-detail-container {
    padding: 15px;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .header-actions {
    width: 100%;
  }

  .btn-secondary,
  .btn-danger {
    flex: 1;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stops-timeline {
    padding-left: 40px;
  }

  .stop-marker {
    width: 30px;
    height: 30px;
    font-size: 0.85rem;
    left: -30px;
  }
}
</style>