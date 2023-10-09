# Demo {EPITECH.}

Ce projet s'inscrit dans le processus d'admission de la formation MSc Pro Epitech Strasbourg 2024.

## Table des matières

1. [Introduction](#introduction)
2. [Technologies Utilisées](#technologies-utilisées)
3. [Configuration du Projet](#configuration-du-projet)
4. [Exécution du Projet](#exécution-du-projet)
5. [Structure du Projet](#structure-du-projet)
5. [Conteneurisation du Projet](#conteneurisation-du-projet)

## Introduction

L'objectif est de présenter plusieurs compétences acquises lors de ma formation au département informatique de l'IUT de Belfort-Montbéliard à travers la conception d'une application démo.

## Technologies Utilisées

- Node.js
- Vue.js
- MongoDB
- Docker

## Configuration du Projet

1. Cloner ce dépôt : https://github.com/Maxime90100/EPITECH_Demo.git
2. Installer les dépendances : 
```shell
npm run install:all
 ```
3. Configurer les variables d'environements
- créer un fichier `.env` à la racine du projet et le compléter :
```.dotenv
# SERVER
SERVER_PORT=3000
SERVER_HOSTNAME=127.0.0.1
SERVER_URL=http://127.0.0.1:3000
JWT_SECRET=secret

# GOOGLE OAUTH
GOOGLE_CLIENT_ID=[your_google_client_id]
GOOGLE_CLIENT_SECRET=[your_google_client_secret]
GOOGLE_CALLBACK_URL=http://127.0.0.1:3000/auth/google/callback

# BDD
MONGO_PORT=27017
MONGO_HOSTNAME=127.0.0.1
MONGO_COLLECTION=demo_epitech

# CLIENT
VUE_APP_PORT=8080
VUE_APP_HOSTNAME=127.0.0.1
VUE_APP_URL=http://127.0.0.1:8080

# API
API_GEOGRAPHIE=https://geo.api.gouv.fr
```
NB: remplacer les variables entre [ ]
## Exécution du Projet

```shell
npm run start:all
```
Accéder à l'application : http://127.0.0.1:8080 (VUE_APP_URL)

## Structure du Projet

```
projet/
├── server/
│ ├── ...
│ └── server.js
├── client/
│ ├── ...
│ └── src/
│   ├── ...
│   └── App.vue
└── sensors/
  └── sensor-simulator.js
```
- `server.js`: API REST NodeJS de traitement des requêtes client et d'interaction avec la base de données MongoDB.
- `App.vue`: Application client VueJS.
- `sensor-simulator.js`: Faux capteurs transmettants des données via une socket de connexion avec le serveur.

## Conteneurisation du Projet

Ce projet peut être directement conteneuriser avec docker via le docker compose:
```shell
docker compose up
```