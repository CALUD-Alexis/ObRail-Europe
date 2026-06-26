<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Tableau de Bord</h1>
      <button
        @click="dashboardStore.loadAllDashboardData()"
        class="btn btn-primary"
        :disabled="dashboardStore.loading"
        aria-label="Actualiser les statistiques"
      >
        Actualiser
      </button>
    </div>

    <!-- RGAA 7.3 : aria-live pour les zones de contenu dynamique -->
    <div
      v-if="dashboardStore.loading"
      class="alert alert-info"
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-cy="loading"
    >
      Chargement des statistiques…
    </div>
    <div v-if="dashboardStore.error" class="alert alert-error" role="alert" data-cy="error">
      {{ dashboardStore.error }}
    </div>

    <!-- Cartes de statistiques -->
    <section aria-label="Indicateurs clés" v-if="dashboardStore.stats" class="grid-4 mb-2">
      <div class="card">
        <h3 class="text-muted">Trajets totaux</h3>
        <p class="text-xl text-primary font-bold">
          {{ dashboardStore.stats.total.toLocaleString('fr-FR') }}
        </p>
      </div>
      <div class="card">
        <h3 class="text-muted">Part Trains de Nuit</h3>
        <p class="text-xl text-night font-bold">{{ dashboardStore.stats.nightPercentage }} %</p>
      </div>
      <div class="card">
        <h3 class="text-muted">Distance moyenne</h3>
        <p class="text-xl text-primary font-bold">{{ dashboardStore.stats.averages.distanceKm }} km</p>
      </div>
      <div class="card">
        <h3 class="text-muted">CO2 moyen / trajet</h3>
        <p class="text-xl text-primary font-bold">{{ dashboardStore.stats.averages.carbonEmissionKg }} kg</p>
      </div>
    </section>

    <!-- Graphiques -->
    <section aria-label="Graphiques" v-if="dashboardStore.stats" class="grid-2">
      <div class="card">
        <h2>Répartition Jour / Nuit</h2>
        <div style="height: 280px; position: relative;">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
      </div>
      <div class="card">
        <h2>Top 5 Opérateurs (par volume)</h2>
        <div style="height: 280px; position: relative;">
          <Bar :data="barData" :options="barOptions" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js'
import { useDashboardStore } from '@/stores/dashboardStore'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const dashboardStore = useDashboardStore()

onMounted(() => dashboardStore.loadAllDashboardData())

const doughnutData = computed(() => {
  const s = dashboardStore.stats
  if (!s) return { labels: [], datasets: [{ data: [] }] }
  return {
    labels: ['Trains de Jour', 'Trains de Nuit'],
    datasets: [{
      data: [parseFloat(s.dayPercentage), parseFloat(s.nightPercentage)],
      backgroundColor: ['#4CAF50', '#1565C0'],
      borderColor: ['#388E3C', '#0D47A1'],
      borderWidth: 2,
    }],
  }
})

const barData = computed(() => {
  const agencies = dashboardStore.stats?.topAgencies ?? []
  if (!agencies.length) return { labels: [], datasets: [{ data: [] }] }
  const top5 = agencies.slice(0, 5)
  return {
    labels: top5.map((a) => a.agencyId),
    datasets: [{
      label: 'Nombre de trajets',
      data: top5.map((a) => a.count),
      backgroundColor: ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'],
      borderRadius: 4,
    }],
  }
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: { callbacks: { label: (ctx) => ` ${ctx.label} : ${ctx.parsed} %` } },
  },
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { stepSize: 50 } } },
}
</script>
