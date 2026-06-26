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
    </div>
  </aside>
</template>

<script setup>
// Composant purement visuel — aucune logique nécessaire
</script>
