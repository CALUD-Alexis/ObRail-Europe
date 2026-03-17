<template>
  <div class="app-layout">
    <Sidebar v-if="!isLoginPage" />
    
    <main class="main-content">
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