<template>
  <div class="app-layout">
    <Sidebar v-if="!isAuthPage" />
    
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
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
const isAuthPage = computed(() => authRoutes.includes(route.path))
</script>