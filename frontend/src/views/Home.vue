<template>
  <div class="container">
    <div class="home">
      <div class="hero">
        <h1>Bienvenue sur ObRail-Europe 🚆</h1>
        <p class="text-muted">Votre plateforme de gestion ferroviaire durable</p>
      </div>

      <div class="features">
        <div class="card">
          <h3>🌱 Éco-responsable</h3>
          <p class="text-muted">Transport durable et écologique</p>
          <span class="badge badge-success">Green Deal</span>
        </div>

        <div class="card">
          <h3>🌞 Trajets Jour</h3>
          <p class="text-muted">Voyagez en journée</p>
          <span class="badge badge-day">Jour</span>
        </div>

        <div class="card">
          <h3>🌙 Trajets Nuit</h3>
          <p class="text-muted">Voyagez de nuit</p>
          <span class="badge badge-night">Nuit</span>
        </div>
      </div>

      <div class="cta">
        <router-link to="/about" class="btn btn-primary">En savoir plus</router-link>
      </div>
    </div>
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
