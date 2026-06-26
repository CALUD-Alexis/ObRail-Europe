<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Supervision</h1>
      <button @click="refresh" class="btn btn-primary" :disabled="loading">Actualiser</button>
    </div>

    <div v-if="loading" class="alert alert-info" data-cy="loading">Vérification en cours...</div>

    <!-- Statut API -->
    <div class="grid-2 mb-2">
      <div class="card">
        <h3 class="text-muted">État de l'API</h3>
        <div v-if="health">
          <span :class="health.status === 'healthy' ? 'badge badge-success' : 'badge badge-error'" style="font-size:1rem; padding: 0.5rem 1.2rem;">
            {{ health.status === 'healthy' ? 'En ligne' : 'Hors ligne' }}
          </span>
          <p class="mt-1 text-muted" style="font-size:0.85rem;">
            Uptime : {{ formatUptime(health.uptime) }}
          </p>
        </div>
        <div v-else-if="!loading">
          <span class="badge badge-error" style="font-size:1rem;">Inaccessible</span>
        </div>
      </div>

      <div class="card">
        <h3 class="text-muted">Base de données</h3>
        <div v-if="health?.checks?.database">
          <span :class="health.checks.database.status === 'healthy' ? 'badge badge-success' : 'badge badge-error'" style="font-size:1rem; padding: 0.5rem 1.2rem;">
            {{ health.checks.database.status === 'healthy' ? 'Connectée' : 'Erreur' }}
          </span>
          <p class="mt-1 text-muted" style="font-size:0.85rem;">
            Latence : {{ health.checks.database.latency }} ms
          </p>
        </div>
      </div>
    </div>

    <!-- Métriques système -->
    <div class="grid-4 mb-2" v-if="health">
      <div class="card">
        <h3 class="text-muted">Dernière vérification</h3>
        <p class="font-bold">{{ formatTimestamp(health.timestamp) }}</p>
      </div>
      <div class="card">
        <h3 class="text-muted">Uptime</h3>
        <p class="font-bold text-primary">{{ formatUptime(health.uptime) }}</p>
      </div>
      <div class="card">
        <h3 class="text-muted">Latence DB</h3>
        <p class="font-bold" :class="health.checks?.database?.latency > 100 ? 'text-night' : 'text-primary'">
          {{ health.checks?.database?.latency ?? '—' }} ms
        </p>
      </div>
      <div class="card">
        <h3 class="text-muted">Env.</h3>
        <p class="font-bold">Production</p>
      </div>
    </div>

    <!-- Liens monitoring -->
    <div class="card mb-2">
      <h3>Tableaux de bord</h3>
      <p class="text-muted mb-1">Accédez aux outils de supervision en temps réel :</p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="http://localhost:3000" target="_blank" rel="noopener" class="btn btn-primary">
          Grafana — Métriques API
        </a>
        <a href="http://localhost:9090" target="_blank" rel="noopener" class="btn btn-secondary">
          Prometheus — Métriques brutes
        </a>
        <a href="http://localhost:3333/docs" target="_blank" rel="noopener" class="btn btn-secondary">
          API Docs (Swagger)
        </a>
      </div>
    </div>

    <!-- Historique des vérifications -->
    <div class="card">
      <h3>Historique des vérifications (session)</h3>
      <div v-if="history.length === 0" class="text-muted">Aucune vérification effectuée.</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Heure</th>
            <th>État API</th>
            <th>État DB</th>
            <th>Latence DB</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, i) in history.slice().reverse()" :key="i">
            <td>{{ entry.time }}</td>
            <td>
              <span :class="entry.apiOk ? 'badge badge-success' : 'badge badge-error'">
                {{ entry.apiOk ? 'OK' : 'KO' }}
              </span>
            </td>
            <td>
              <span :class="entry.dbOk ? 'badge badge-success' : 'badge badge-error'">
                {{ entry.dbOk ? 'OK' : 'KO' }}
              </span>
            </td>
            <td>{{ entry.latency !== null ? entry.latency + ' ms' : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import apiClient from '@/api/axios'

const health = ref(null)
const loading = ref(false)
const history = ref([])
let interval = null

async function refresh() {
  loading.value = true
  try {
    const response = await apiClient.get('/health')
    health.value = response.data
    history.value.push({
      time: new Date().toLocaleTimeString('fr-FR'),
      apiOk: response.data.status === 'healthy',
      dbOk: response.data.checks?.database?.status === 'healthy',
      latency: response.data.checks?.database?.latency ?? null,
    })
    // Garder uniquement les 20 dernières entrées
    if (history.value.length > 20) history.value.shift()
  } catch {
    health.value = null
    history.value.push({
      time: new Date().toLocaleTimeString('fr-FR'),
      apiOk: false,
      dbOk: false,
      latency: null,
    })
  } finally {
    loading.value = false
  }
}

function formatUptime(seconds) {
  if (!seconds) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`
}

function formatTimestamp(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('fr-FR')
}

onMounted(() => {
  refresh()
  interval = setInterval(refresh, 30000) // Auto-refresh toutes les 30s
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
