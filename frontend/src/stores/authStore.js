import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const loading = ref(true)

  const user = computed(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => !!session.value)
  const accessToken = computed(() => session.value?.access_token ?? null)

  // Initialisation : écoute les changements de session Supabase
  async function init() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    loading.value = false

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
    })
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    session.value = data.session
  }

  async function register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) throw error
    return data
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    session.value = null
  }

  // Déclenche l'envoi de l'email de réinitialisation (via Resend si configuré dans Supabase)
  async function sendPasswordResetEmail(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }

  // Mise à jour du mot de passe après clic sur le lien
  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  return {
    session,
    loading,
    user,
    isAuthenticated,
    accessToken,
    init,
    login,
    register,
    logout,
    sendPasswordResetEmail,
    updatePassword
  }
})
