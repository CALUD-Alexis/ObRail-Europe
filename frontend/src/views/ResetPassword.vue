<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4 py-12">
    <div class="w-full max-w-md space-y-6">

      <!-- Logo -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center gap-2 text-primary font-bold text-xl">
          <TrainFront class="w-6 h-6" />
          ObRail-Europe
        </div>
        <p class="text-sm text-muted-foreground">Plateforme de surveillance ferroviaire</p>
      </div>

      <!-- Card -->
      <Card>
        <CardHeader class="space-y-1 pb-4">
          <CardTitle class="text-2xl font-bold">Nouveau mot de passe</CardTitle>
          <CardDescription>Choisissez un nouveau mot de passe sécurisé.</CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Succès -->
          <div v-if="successMessage" class="space-y-4">
            <div class="flex items-start gap-3 rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm text-primary">
              <CheckCircle class="w-5 h-5 mt-0.5 shrink-0" />
              <span>{{ successMessage }}</span>
            </div>
            <RouterLink to="/login">
              <Button class="w-full">
                Aller à la connexion
              </Button>
            </RouterLink>
          </div>

          <div v-if="error" class="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
            {{ error }}
          </div>

          <form v-if="!successMessage" @submit.prevent="handleResetPassword" class="space-y-4">
            <div class="space-y-2">
              <Label for="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="Minimum 8 caractères"
                minlength="8"
                required
                autocomplete="new-password"
              />
            </div>

            <div class="space-y-2">
              <Label for="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="Répétez votre mot de passe"
                required
                autocomplete="new-password"
              />
            </div>

            <Button type="submit" class="w-full" :disabled="loading">
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              {{ loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe' }}
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { TrainFront, AlertCircle, CheckCircle, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const authStore = useAuthStore()

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const successMessage = ref('')
const loading = ref(false)

async function handleResetPassword() {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  try {
    await authStore.updatePassword(password.value)
    successMessage.value = 'Votre mot de passe a été mis à jour avec succès.'
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue. Le lien est peut-être expiré.'
  } finally {
    loading.value = false
  }
}
</script>
