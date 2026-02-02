<template>
  <div class="home">
    <h1>Bienvenue sur ObRail-Europe</h1>
    <p>Page d'accueil de l'application</p>
    <router-link to="/about">En savoir plus</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    console.log('Home page mounted')
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

h1 {
  color: #42b983;
}
</style>
