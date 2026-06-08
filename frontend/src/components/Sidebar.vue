<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      ObRail Europe
    </div>

    <nav class="sidebar-nav">
      <router-link to="/" class="sidebar-item">
        Tableau de Bord
      </router-link>
      
      <router-link to="/trajets" class="sidebar-item">
        Rechercher Trajet
      </router-link>

      <div class="sidebar-divider"></div>

      <div class="sidebar-item disabled" title="Bientôt disponible">
        Carte Réseau
      </div>
      <div class="sidebar-item disabled" title="Bientôt disponible">
        Opérateurs
      </div>
      
      <div class="sidebar-divider"></div>
      
      <div class="sidebar-item disabled" title="Bientôt disponible">
        Administration
      </div>
      <router-link to="/about" class="sidebar-item">
        À propos
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <span class="badge badge-success">API En Ligne</span>
    </div>
  </aside>
</template>

<script setup>
// Le composant est maintenant purement visuel
</script>