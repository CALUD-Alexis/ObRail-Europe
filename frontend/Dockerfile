# Étape 1 : construire l'application
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Construire l'application React
RUN npm run build

# Étape 2 : servir l'application avec un serveur léger
FROM nginx:alpine

# Copier le build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Config nginx pour le routing SPA (Vue Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande par défaut
CMD ["nginx", "-g", "daemon off;"]
