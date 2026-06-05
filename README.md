# 🍽️ Vite & Gourmand - Frontend

## Description

Ce projet correspond au frontend de l’application web **Vite & Gourmand**, réalisée dans le cadre de l’Évaluation de Compétences Finale (ECF) du titre professionnel Développeur Web et Web Mobile.

L’application permet aux utilisateurs de consulter des menus, créer un compte, passer des commandes et suivre leurs prestations. Des espaces dédiés sont également disponibles pour les employés et administrateurs.

Le frontend communique avec une API REST développée en Symfony.

Il est responsable de l’affichage des données, de l’interaction utilisateur et de la communication avec l’API.

L'application est développée en **JavaScript vanilla**, sans framework, avec une architecture de type **Single Page Application (SPA)** basée sur un système de routage côté client et avec un routeur personnalisé permettant le chargement dynamique des pages sans rechargement complet du navigateur..

Bootstrap est utilisé pour la mise en forme, la grille responsive et certains composants d’interface.

---

## Stack technique

- HTML5  
- CSS3 / SCSS  
- JavaScript (Vanilla)  
- Router personnalisé (SPA)  
- Fetch API  
- Bootstrap
- Docker (environnement local)  
- Vercel (déploiement)

---

## Fonctionnalités principales

### Utilisateur

- Inscription / Connexion  
- Consultation des menus  
- Filtrage des menus (prix, thème, régime, nombre de personnes)  
- Détail d’un menu  
- Passage de commande  
- Calcul dynamique du prix  
- Application automatique des réductions  
- Consultation des commandes  
- Annulation de commande  

### Employé / Administrateur

- Gestion des commandes  
- Gestion des menus  
- Gestion des plats  
- Gestion des horaires  

### Autres fonctionnalités

- Page d’accueil avec présentation et avis clients  
- Formulaire de contact  
- Réinitialisation du mot de passe  

---

## 📁 Structure du projet

- `/pages` → vues HTML 
- `/js` → logique JavaScript  
- `/js/admin` → fonctionnalités back-office  
- `/css` ou `/scss` → styles  
- `router.js` → gestion du routage SPA 
- `script.js` → initialisation globale  

---

## API

Le frontend consomme une API REST. 
Il communique avec le backend via des requêtes HTTP utilisant la Fetch API.

### Configuration
En production :

```script.js
const API_BASE_URL = "https://ecfbackendapi-production.up.railway.app";
```
En environnement local :

```script.js
const API_BASE_URL = "http://localhost:8000";
```
---

## Docker

Le projet utilise deux configurations Docker distinctes :

1. Environnement de développement (local)

Le fichier Dockerfile est utilisé avec Docker Compose pour lancer un environnement complet comprenant :

le frontend
le backend Symfony
MariaDB
MongoDB
Mailhog

Cet environnement permet de reproduire le projet localement de manière isolée et cohérente.

Les dépendances PHP sont installées automatiquement lors du build Docker.
Le dossier `vendor` est isolé dans un volume Docker afin de ne pas être écrasé par le montage du code local.

2. Environnement de production

Le fichier **Dockerfile.prod** est utilisé pour le déploiement du backend sur Railway.

Il repose sur FrankenPHP, qui permet d’intégrer directement le serveur web et PHP dans un seul conteneur optimisé pour la production.


## Lancer le projet en local (Docker)

Prérequis

- Docker Desktop
- Git

Vérification 
```bash
docker -v
docker compose version
git -v
```

1. Cloner les repositories
```bash
git clone https://github.com/Milady28002/ECF_FrontEnd.git
git clone https://github.com/Milady28002/ECF_BackEnd_API.git
git clone https://github.com/Milady28002/ECF_Docker.git
```

2. Lancer l'environnement Docker
```bash
cd ECF_Docker
docker compose up -d --build
```
Accès à l'application
- Frontend -> http://localhost:3001
- Backend -> http://localhost:8000
- Mailhog -> http://localhost:8026


## Lancer le projet sans Docker

1. Cloner le repository frontend :
```bash
git clone https://github.com/Milady28002/ECF_FrontEnd.git
```

2. Modifier la configuration API dans script.js :
```
const API_BASE_URL = "http://localhost:8000";
```

4. Lancer un serveur local (ex: Live Server)
```bash
php -S 127.0.0.1:3001
```


## Application en ligne

https://vite-et-gourmand-traiteur.vercel.app/


---
## Backend

https://github.com/Milady28002/ECF_BackEnd_API

---

## Environnement Docker

https://github.com/Milady28002/ECF_Docker.git

---

##  Comptes de test

👤 Utilisateur
Email : dana.scully@user.com
Mot de passe : Azerty@123

🛠️ Employé
Email : employe@vitegourmand.fr
Mot de passe : Admin123!

🔐 Administrateur
Email : admin@vitegourmand.fr
Mot de passe : Admin123!

---

## Accessibilité

L’interface a été développée en intégrant des bonnes pratiques d’accessibilité :

- Structure HTML sémantique
- Hiérarchie des titres respectée
- Labels explicites pour les formulaires
- Navigation possible au clavier
- Focus visible sur les éléments interactifs
- Alternatives textuelles pour les images
- Attention portée aux contrastes et à la lisibilité

---

## Sécurité (côté frontend)

- Gestion des rôles (USER, EMPLOYE, ADMIN)
- Stockage du token d’authentification (cookie / localStorage)
- Envoi du token dans les headers des requêtes API
- Protection des routes côté client
- Redirection en cas d’accès non autorisé

---

## 👩‍💻 Autrice

Projet réalisé par Sylvie Mendez (Milady)
Formation Graduate Développeur Web Full Stack