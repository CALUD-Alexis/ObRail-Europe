# ObRail-Europe — Frontend

## Résumé étape par étape de la mise en place du frontend

Ce document explique, de façon chronologique, comment la partie frontend du projet ObRail-Europe a été construite, depuis l'initialisation jusqu'à la mise en place des composants et des services.

---

## Étape 1 — Initialisation du projet avec Create React App

Le projet a été initialisé à l'aide de **Create React App** (CRA), l'outil officiel de démarrage rapide pour les applications React.

```bash
npx create-react-app frontend
```

Cette commande a généré la structure de base du projet (dossiers `public/`, `src/`, fichier `package.json`, etc.) et a configuré automatiquement Webpack, Babel et ESLint. Le fichier `README.old.md` conservé à la racine du dossier `frontend/` en est la trace.

---

## Étape 2 — Changement de framework : passage de React à Vue 3

Après réflexion sur l'architecture du projet, React a été abandonné au profit de **Vue 3**, mieux adapté aux besoins de l'équipe et à la structure du projet (Composition API, stores Pinia, etc.).

Les dépendances React ont été conservées dans `package.json` pour l'historique, mais toute la base de code source (`src/`) a été réécrite en Vue 3.

---

## Étape 3 — Installation de Vue 3 et de Vue CLI

Les outils de base Vue ont été installés :

```bash
npm install vue@^3
npm install --save-dev @vue/cli-service @vue/compiler-sfc vue-loader
```

- **`vue`** : le framework Vue 3 lui-même.
- **`@vue/cli-service`** : l'outil de développement (serveur de développement, build, lint) basé sur Vue CLI.
- **`@vue/compiler-sfc`** : compilateur pour les fichiers `.vue` (Single File Components).
- **`vue-loader`** : chargeur Webpack pour les fichiers `.vue`.

Un fichier `vue.config.js` a été créé à la racine de `frontend/` pour configurer Vue CLI, notamment le proxy vers le backend AdonisJS :

```js
// vue.config.js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3333', // Port par défaut d'AdonisJS
      changeOrigin: true
    }
  }
}
```

---

## Étape 4 — Configuration de Vite (build tool alternatif)

En parallèle, **Vite** a été configuré comme outil de build alternatif, plus rapide que Webpack pour le développement. Un fichier `vite.config.js` a été créé :

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // ⚠️ À mettre à jour : devrait correspondre au port d'AdonisJS (3333 par défaut, cf. vue.config.js)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

L'alias `@` permet d'importer des fichiers depuis `src/` sans chemins relatifs longs (ex : `@/stores/authStore.js`).

---

## Étape 5 — Installation de Vue Router

**Vue Router** a été installé pour gérer la navigation entre les pages de l'application :

```bash
npm install vue-router@^5
```

Un fichier `src/router.js` a été créé avec :

- **Les routes** : `/login`, `/` (Dashboard), `/trajets`, `/trajets/:id`.
- **Les meta `requiresAuth`** : pour protéger les pages privées.
- **Un guard de navigation global** (`router.beforeEach`) : qui vérifie si l'utilisateur est authentifié (via `localStorage`) avant d'autoriser l'accès à une page protégée.

```js
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})
```

---

## Étape 6 — Installation de Pinia (gestion d'état)

**Pinia** a été installé comme gestionnaire d'état global (alternative moderne à Vuex) :

```bash
npm install pinia@^3
```

Un fichier `src/stores/index.js` a été créé pour initialiser Pinia et activer les logs de debug en développement. Plusieurs stores ont ensuite été créés pour compartimenter l'état de l'application :

| Fichier | Rôle |
|---|---|
| `authStore.js` | Gestion de l'authentification (user, token, login/logout) |
| `dashboardStore.js` | Statistiques et données du tableau de bord |
| `trajetStore.js` | Liste, filtres et détails des trajets |
| `trainStore.js` | Données des trains |
| `gareStore.js` / `stationStore.js` | Données des gares |
| `operateurStore.js` | Données des opérateurs ferroviaires |
| `adminStore.js` | Fonctions d'administration |

---

## Étape 7 — Installation d'Axios (client HTTP)

**Axios** a été installé pour effectuer les appels vers l'API backend :

```bash
npm install axios@^1
```

Un fichier `src/api/axios.js` a été créé avec une **instance Axios configurée** :

- **`baseURL`** : lue depuis la variable d'environnement `VITE_API_URL`.
- **Timeout** : 10 secondes.
- **Intercepteur de requête** : injecte automatiquement le token JWT depuis le `localStorage` dans l'en-tête `Authorization`.
- **Intercepteur de réponse** : gère les erreurs globales (401 → redirection login, 403, 404, 500).

Un fichier `src/api/services.js` regroupe tous les appels API organisés par domaine (`authService`, `trajetService`, `stationService`, `reservationService`).

---

## Étape 8 — Configuration des variables d'environnement

Deux fichiers d'environnement ont été créés pour séparer les URLs de développement et de production :

```
# .env.development
VITE_API_URL=http://localhost:3333/api

# .env.production
VITE_API_URL=https://api.obrail-europe.com/api
```

Ces variables sont accessibles dans le code via `import.meta.env.VITE_API_URL` (convention Vite).

---

## Étape 9 — Point d'entrée de l'application (`main.js`)

Le fichier `src/main.js` est le point d'entrée de l'application Vue. Il crée l'application et y enregistre les plugins :

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import './index.css'

createApp(App)
  .use(pinia)   // Gestion d'état
  .use(router)  // Navigation
  .mount('#app')
```

---

## Étape 10 — Charte graphique et CSS global (`index.css`)

Un fichier `src/index.css` a été rédigé pour définir la **charte graphique** du projet. Il repose sur des **variables CSS** (design tokens) pour une cohérence visuelle :

- **Thème Jour** (défaut) : tons verts (#2E7D32), fond crème (#FAF9F6).
- **Thème Nuit** (dark mode) : tons bleus sombres (#0F172A).
- **Composants utilitaires** : `.card`, `.btn`, `.badge`, `.alert`, `.form-input`, `.data-table`, `.grid-2`, `.grid-4`, etc.
- **Police** : Inter (Google Fonts).

---

## Étape 11 — Composant racine (`App.vue`) et Sidebar

Le composant `App.vue` définit la mise en page principale :
- Une **Sidebar de navigation** (`src/components/Sidebar.vue`) affichée sur toutes les pages sauf `/login`.
- Une zone `<router-view />` pour afficher la page active.

La **Sidebar** contient les liens de navigation vers : Tableau de Bord, Trajets, Carte Réseau (à venir), Opérateurs (à venir), Administration (à venir), À propos.

---

## Étape 12 — Création des pages (Views)

Les pages de l'application ont été créées dans `src/views/` :

| Fichier | Route | Description |
|---|---|---|
| `Login.vue` | `/login` | Formulaire de connexion (username + password) |
| `dashboardPage.vue` | `/` | Tableau de bord avec statistiques et graphiques |
| `trajetsPage.vue` | `/trajets` | Liste des trajets avec filtres et recherche |
| `trajetDetailPage.vue` | `/trajets/:id` | Détail d'un trajet (fiche technique, arrêts, carte) |

---

## Étape 13 — Données mock pour le développement

Un fichier `src/mocks/trajets.json` a été créé avec des données de trajets ferroviaires fictives (SNCF, ÖBB, DB, Trenitalia, SJ) pour permettre le développement de l'interface sans dépendre du backend.

---

## Étape 14 — Conteneurisation avec Docker

Un `Dockerfile` multi-étapes a été créé pour produire une image Docker optimisée :

1. **Étape build** : image `node:20-alpine`, installe les dépendances et construit l'application (`npm run build`).
2. **Étape serve** : image `nginx:alpine`, sert le build statique sur le port 80.

Ce Dockerfile est utilisé par le `docker-compose.yml` à la racine du projet.

---

## Commandes utiles

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement (port 3000)
npm run dev

# Construire pour la production
npm run build

# Linter
npm run lint
```

---

## Structure du dossier `src/`

```
src/
├── api/
│   ├── axios.js       # Instance Axios configurée
│   ├── index.js       # Point d'entrée des exports
│   └── services.js    # Services par domaine (auth, trajets, gares...)
├── components/
│   └── Sidebar.vue    # Barre de navigation latérale
├── mocks/
│   └── trajets.json   # Données fictives pour le développement
├── stores/
│   ├── index.js       # Initialisation de Pinia
│   ├── authStore.js
│   ├── dashboardStore.js
│   ├── trajetStore.js
│   └── ...
├── views/
│   ├── Login.vue
│   ├── dashboardPage.vue
│   ├── trajetsPage.vue
│   └── trajetDetailPage.vue
├── App.vue            # Composant racine
├── index.css          # Charte graphique globale
├── main.js            # Point d'entrée de l'application
└── router.js          # Configuration du routeur Vue Router
```
