<template>
  <div class="app-layout">
    <!-- RGAA 12.6 : zone de navigation identifiée -->
    <Sidebar v-if="!isLoginPage" />

    <!-- RGAA 12.1 : cible du lien d'évitement + role="main" -->
    <main id="main-content" class="main-content" role="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
// On n'affiche pas la sidebar sur la page de login
const isLoginPage = computed(() => route.path === '/login')
</script>
