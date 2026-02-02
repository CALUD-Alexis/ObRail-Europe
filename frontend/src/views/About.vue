<template>
  <div class="about">
    <h1>À propos d'ObRail-Europe</h1>
    <p>Cette page est protégée par un guard de navigation.</p>
    <p>Vous devez être authentifié pour y accéder.</p>
    <button @click="logout">Se déconnecter</button>
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

<style scoped>
.about {
  padding: 20px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #35a372;
}
</style>
