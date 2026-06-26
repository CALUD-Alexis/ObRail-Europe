import { defineStore } from 'pinia'
import { ref } from 'vue'

// Gère l'état de connexion de l'utilisateur
// L'authentification est simulée : n'importe quels identifiants non vides sont acceptés
export const useAuthStore = defineStore('auth', () => {
  // On lit localStorage au démarrage pour survivre aux rechargements de page
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

  // Connecte l'utilisateur — retourne false si les champs sont vides
  function login(username, password) {
    if (!username || !password) return false
    isAuthenticated.value = true
    localStorage.setItem('isAuthenticated', 'true')
    return true
  }

  // Déconnecte l'utilisateur et nettoie le stockage local
  function logout() {
    isAuthenticated.value = false
    localStorage.removeItem('isAuthenticated')
  }

  return { isAuthenticated, login, logout }
})
