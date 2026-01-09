# Étape 1 : construire le frontend
FROM node:18 as build

# Définir le dossier de travail à l'intérieur du container
WORKDIR /app

# Copier les fichiers de dépendances pour que Docker puisse installer les packages
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier tout le code source dans le container
COPY . .

# Construire le projet React (crée le dossier build/ prêt à être servi)
RUN npm run build

# Étape 2 : servir le build avec un serveur léger (nginx)
FROM nginx:alpine

# Copier le dossier build créé précédemment dans nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 pour accéder à l'application depuis le navigateur
EXPOSE 80

# Commande pour démarrer Nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
