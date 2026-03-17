<template>
  <div class="page-container">
    <div class="page-header">
      <h1>📊 Tableau de Bord</h1>
      <button @click="refreshData" class="btn btn-primary" :disabled="dashboardStore.loading">
        🔄 Actualiser
      </button>
    </div>

    <div v-if="dashboardStore.loading" class="alert alert-info">Chargement des statistiques...</div>
    <div v-if="dashboardStore.error" class="alert alert-error">⚠️ Erreur: {{ dashboardStore.error }}</div>

    <div class="grid-4 mb-2">
      <div class="card">
        <h3 class="text-muted">Trajets totaux</h3>
        <p class="text-xl text-primary font-bold">{{ dashboardStore.stats?.totalTrajets || 0 }}</p>
      </div>
      <div class="card">
        <h3 class="text-muted">Part Trains de Nuit</h3>
        <p class="text-xl text-night font-bold">18.5 %</p>
      </div>
      <div class="card">
        <h3 class="text-muted">Gares actives</h3>
        <p class="text-xl text-primary font-bold">{{ dashboardStore.stats?.totalGares || 0 }}</p>
      </div>
      <div class="card">
        <h3 class="text-muted">Opérateurs</h3>
        <p class="text-xl text-primary font-bold">{{ dashboardStore.stats?.totalOperateurs || 0 }}</p>
      </div>
    </div>

    <div class="card mb-2">
      <h2>🌱 Impact Environnemental (CO2 évité vs Avion)</h2>
      <div class="grid-4 mt-2">
        <div class="card bg-success text-white text-center">
          <h4>Aujourd'hui</h4>
          <p class="text-lg font-bold">12 t CO2</p>
        </div>
        <div class="card bg-success text-white text-center">
          <h4>Ce mois</h4>
          <p class="text-lg font-bold">340 t CO2</p>
        </div>
        <div class="card bg-success text-white text-center">
          <h4>Cette année</h4>
          <p class="text-lg font-bold">4,250 t CO2</p>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card chart-placeholder">
        <h3>🌓 Répartition Jour / Nuit</h3>
        <p class="text-muted mt-2">Intégrer Chart.js (Doughnut) ici</p>
      </div>
      <div class="card chart-placeholder">
        <h3>🏢 Offre par Opérateur (Top 5)</h3>
        <p class="text-muted mt-2">Intégrer Chart.js (Bar) ici</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.loadAllDashboardData()
})

function refreshData() {
  dashboardStore.loadAllDashboardData()
}
</script>