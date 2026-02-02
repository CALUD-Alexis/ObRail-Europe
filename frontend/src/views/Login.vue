<template>
  <div class="container">
    <div class="login">
      <div class="card">
        <h1>Connexion 🔐</h1>
        <p class="text-muted">Accédez à votre espace ObRail-Europe</p>
        
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              class="form-input"
              placeholder="Entrez votre nom d'utilisateur"
              required 
            />
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              class="form-input"
              placeholder="Entrez votre mot de passe"
              required 
            />
          </div>
          <button type="submit" class="btn btn-primary">Se connecter</button>
        </form>
        
        <p v-if="error" class="text-error" style="margin-top: 1rem;">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    login() {
      // Simulation d'authentification (à remplacer par une vraie API)
      if (this.username && this.password) {
        localStorage.setItem('isAuthenticated', 'true')
        this.$router.push('/about')
      } else {
        this.error = 'Veuillez remplir tous les champs'
      }
    }
  }
}
</script>
