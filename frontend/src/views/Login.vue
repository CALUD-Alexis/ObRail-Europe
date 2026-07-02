<template>
  <div class="login-page">
    <div class="login-card card">
      <h1>Connexion</h1>
      <p class="text-muted">Accédez à votre espace ObRail Europe</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="form-input"
            placeholder="Entrez votre nom d'utilisateur"
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
          />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%">Se connecter</button>
      </form>

      <p v-if="error" class="text-error mt-1">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  // auth.login() retourne false si un champ est vide
  const success = auth.login(username.value, password.value)
  if (success) {
    router.push('/')
  } else {
    error.value = 'Veuillez remplir tous les champs'
  }
}
</script>
