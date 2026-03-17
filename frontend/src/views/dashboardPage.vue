<template>
  <div class="dashboard-container">
    <h1>📊 Dashboard - Vue Globale</h1>

    <!-- Messages d'état -->
    <div v-if="dashboardStore.loading" class="loading-message">
      Chargement des statistiques...
    </div>

    <div v-if="dashboardStore.error" class="error-message">
      ⚠️ Erreur: {{ dashboardStore.error }}
    </div>

    <!-- Cartes de statistiques -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🚂</div>
        <div class="stat-content">
          <h3>Trajets totaux</h3>
          <p class="stat-value">{{ dashboardStore.stats.totalTrajets }}</p>
          <span class="stat-label">Trajets actifs: {{ dashboardStore.stats.trajetsActifs }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏢</div>
        <div class="stat-content">
          <h3>Gares</h3>
          <p class="stat-value">{{ dashboardStore.stats.totalGares }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>Opérateurs</h3>
          <p class="stat-value">{{ dashboardStore.stats.totalOperateurs }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3>Taux d'utilisation</h3>
          <p class="stat-value">{{ dashboardStore.tauxUtilisation }}%</p>
        </div>
      </div>
    </div>

    <!-- Section Consommation -->
    <div class="section-consommation">
      <h2>⚡ Consommation</h2>
      
      <div class="consommation-cards">
        <div class="conso-card">
          <h4>Aujourd'hui</h4>
          <p class="conso-value">{{ dashboardStore.stats.consommationJour }} kWh</p>
        </div>
        <div class="conso-card">
          <h4>Ce mois</h4>
          <p class="conso-value">{{ dashboardStore.stats.consommationMois }} kWh</p>
        </div>
        <div class="conso-card">
          <h4>Cette année</h4>
          <p class="conso-value">{{ dashboardStore.stats.consommationAnnee }} kWh</p>
        </div>
        <div class="conso-card">
          <h4>Moyenne</h4>
          <p class="conso-value">{{ dashboardStore.consommationMoyenne }} kWh</p>
        </div>
      </div>

      <!-- Graphique de consommation (placeholder) -->
      <div class="chart-container">
        <h3>Évolution de la consommation</h3>
        <div class="chart-placeholder">
          <!-- Ici vous pouvez intégrer Chart.js, Recharts, ou autre librairie -->
          <p>📊 Graphique de consommation</p>
          <p class="chart-info">
            {{ dashboardStore.consommationData.length }} points de données chargés
          </p>
        </div>
      </div>
    </div>

    <!-- Section Graphiques -->
    <div class="charts-section">
      <div class="chart-box">
        <h3>📅 Trajets par mois</h3>
        <div class="chart-placeholder">
          <p>{{ dashboardStore.trajetsParMois.length }} mois de données</p>
          <!-- Intégrer un graphique en barres -->
        </div>
      </div>

      <div class="chart-box">
        <h3>🏢 Répartition par opérateurs</h3>
        <div class="chart-placeholder">
          <p>{{ dashboardStore.repartitionOperateurs.length }} opérateurs</p>
          <!-- Intégrer un graphique camembert/donut -->
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions">
      <button @click="refreshData" class="btn-primary" :disabled="dashboardStore.loading">
        🔄 Actualiser les données
      </button>
      <button @click="exportData" class="btn-secondary">
        📥 Exporter en CSV
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const dashboardStore = useDashboardStore()

// Charger toutes les données au montage
onMounted(() => {
  dashboardStore.loadAllDashboardData()
})

// Actualiser les données
function refreshData() {
  dashboardStore.loadAllDashboardData()
}

// Exporter les données (à implémenter selon vos besoins)
function exportData() {
  console.log('Export des données...')
  // Logique d'export CSV
  alert('Fonctionnalité d\'export à implémenter')
}
</script>

<style scoped>
.dashboard-container {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

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

/* Grille de statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 3rem;
}

.stat-content h3 {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1976d2;
  margin: 0;
}

.stat-label {
  font-size: 0.85rem;
  color: #777;
}

/* Section consommation */
.section-consommation {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-consommation h2 {
  margin-top: 0;
  color: #2c3e50;
}

.consommation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.conso-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.conso-card h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.conso-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.chart-container {
  margin-top: 30px;
}

.chart-container h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

/* Section graphiques */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-box {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-box h3 {
  margin-top: 0;
  color: #2c3e50;
}

.chart-placeholder {
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 60px 20px;
  text-align: center;
  color: #999;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chart-placeholder p:first-child {
  font-size: 1.2rem;
  margin: 0 0 10px 0;
}

.chart-info {
  font-size: 0.9rem;
  color: #666;
}

/* Actions */
.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1565c0;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #1976d2;
  border: 2px solid #1976d2;
}

.btn-secondary:hover {
  background: #1976d2;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>