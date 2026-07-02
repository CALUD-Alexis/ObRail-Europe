<template>
  <!-- RGAA 12.6 : role="navigation" + aria-label pour identifier la zone -->
  <aside class="sidebar" role="navigation" aria-label="Navigation principale">
    <div class="sidebar-logo" aria-hidden="true">
      ObRail Europe
    </div>

    <nav>
      <router-link to="/" class="sidebar-item" aria-label="Tableau de Bord">
        Tableau de Bord
      </router-link>

      <router-link to="/trajets" class="sidebar-item" aria-label="Rechercher un trajet">
        Rechercher Trajet
      </router-link>

      <router-link to="/supervision" class="sidebar-item" aria-label="Supervision de l'API">
        Supervision
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <!-- aria-label explicite car le badge seul manque de contexte -->
      <span class="badge badge-success" aria-label="Statut API : en ligne">API En Ligne</span>
      <button class="sidebar-logout" @click="logout" aria-label="Déconnexion">Déconnexion</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-logout {
  margin-top: 12px;
  padding: 8px 18px;
  background: #198754;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.sidebar-logout:hover {
  background: #145c32;
}
.sidebar-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 32px;
}
</style>


<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
