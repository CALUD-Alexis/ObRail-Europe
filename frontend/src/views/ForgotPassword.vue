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
          <CardTitle class="text-2xl font-bold">Mot de passe oublié</CardTitle>
          <CardDescription>
            Saisissez votre adresse e-mail et nous vous enverrons un lien de réinitialisation.
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Succès -->
          <div v-if="successMessage" class="flex items-start gap-3 rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm text-primary">
            <MailCheck class="w-5 h-5 mt-0.5 shrink-0" />
            <span>{{ successMessage }}</span>
          </div>

          <div v-if="error" class="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
            {{ error }}
          </div>

          <form v-if="!successMessage" @submit.prevent="handleForgotPassword" class="space-y-4">
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

            <Button type="submit" class="w-full" :disabled="loading">
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              {{ loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
            </Button>
          </form>
        </CardContent>

        <CardFooter class="flex justify-center pt-0 pb-6">
          <RouterLink to="/login" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft class="w-3.5 h-3.5" />
            Retour à la connexion
          </RouterLink>
        </CardFooter>
      </Card>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { TrainFront, AlertCircle, MailCheck, Loader2, ArrowLeft } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const authStore = useAuthStore()

const email = ref('')
const error = ref('')
const successMessage = ref('')
const loading = ref(false)

async function handleForgotPassword() {
  error.value = ''
  loading.value = true
  try {
    await authStore.sendPasswordResetEmail(email.value)
    successMessage.value = `Un e-mail de réinitialisation a été envoyé à ${email.value}. Vérifiez également vos spams.`
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>
