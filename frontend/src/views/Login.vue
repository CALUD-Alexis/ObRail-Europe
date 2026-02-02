<template>
  <div class="login">
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Nom d'utilisateur:</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          required 
        />
      </div>
      <div>
        <label for="password">Mot de passe:</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
        />
      </div>
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
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

<style scoped>
.login {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

div {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #35a372;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
