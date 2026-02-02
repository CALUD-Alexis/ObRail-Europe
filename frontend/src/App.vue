<template>
  <div id="app">
    <header class="main-header">
      <div class="container">
        <nav class="main-nav">
          <div class="nav-brand">
            <h2>🚆 ObRail-Europe</h2>
          </div>
          <div class="nav-links">
            <router-link to="/" class="nav-link">Accueil</router-link>
            <router-link to="/about" class="nav-link">À propos</router-link>
            <router-link to="/login" class="nav-link">Connexion</router-link>
          </div>
        </nav>
      </div>
    </header>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
