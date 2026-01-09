# Étape 1 : choisir l'image Node.js officielle
FROM node:20

# Étape 2 : créer le dossier de l'application dans le container
WORKDIR /app

# Étape 3 : copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Étape 4 : installer les dépendances
RUN npm install

# Étape 5 : copier le reste du code de l'application
COPY . .

# Étape 6 : exposer le port utilisé par AdonisJS
EXPOSE 3333

# Étape 7 : lancer le serveur AdonisJS
CMD ["node", "ace", "serve", "--watch"]
