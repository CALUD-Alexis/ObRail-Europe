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
          <CardTitle class="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>Rejoignez le réseau de surveillance ferroviaire</CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <div v-if="error" class="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
            {{ error }}
          </div>

          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-2">
              <Label for="fullName">Nom complet</Label>
              <Input
                id="fullName"
                v-model="fullName"
                type="text"
                placeholder="Jean Dupont"
                required
                autocomplete="name"
              />
            </div>

            <div class="space-y-2">
              <Label for="email">Adresse e-mail</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="vous@exemple.fr"
                required
                autocomplete="email"
              />
            </div>

            <div class="space-y-2">
              <Label for="password">Mot de passe</Label>
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
              {{ loading ? 'Création du compte...' : 'Créer mon compte' }}
            </Button>
          </form>
        </CardContent>

        <CardFooter class="flex justify-center pt-0 pb-6">
          <p class="text-sm text-muted-foreground">
            Déjà un compte ?
            <RouterLink to="/login" class="text-primary hover:underline font-medium ml-1">
              Se connecter
            </RouterLink>
          </p>
        </CardFooter>
      </Card>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { TrainFront, AlertCircle, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  try {
    await authStore.register(email.value, password.value, fullName.value)
    router.push('/login?registered=true')
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue lors de la création du compte.'
  } finally {
    loading.value = false
  }
}
</script>
