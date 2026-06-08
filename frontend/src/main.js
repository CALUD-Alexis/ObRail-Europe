import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { useAuthStore } from './stores/authStore'
import './index.css'

const app = createApp(App)
app.use(pinia)
app.use(router)

// Initialise la session Supabase avant le premier rendu
const authStore = useAuthStore()
authStore.init().then(() => {
  app.mount('#app')
})
