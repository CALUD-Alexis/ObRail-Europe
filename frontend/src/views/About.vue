<template>
  <div class="container">
    <div class="about">
      <div class="card">
        <h1>À propos d'ObRail-Europe</h1>
        <p>Cette page est protégée par un guard de navigation.</p>
        <p class="text-muted">Vous devez être authentifié pour y accéder.</p>
        
        <div class="info-section">
          <h3>🔒 Accès sécurisé</h3>
          <p>Votre session est protégée et vos données sont en sécurité.</p>
        </div>

        <button @click="logout" class="btn btn-secondary">Se déconnecter</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  methods: {
    logout() {
      localStorage.removeItem('isAuthenticated')
      this.$router.push('/login')
    }
  }
}
</script>
