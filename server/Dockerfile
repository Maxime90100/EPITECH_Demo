# Utilisez une image Node.js comme base
FROM node:14

# Définissez le répertoire de travail
WORKDIR /usr/src/app

# Copiez le package.json et le package-lock.json
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel votre application écoute
EXPOSE 3000

# Commande pour lancer l'application
CMD ["node", "server.js"]
