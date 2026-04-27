# 🍽️ Vite & Gourmand - Frontend

## Description

Ce projet correspond au frontend de l’application web **Vite & Gourmand**, réalisée dans le cadre de l’Évaluation de Compétences Finale (ECF) du titre professionnel Développeur Web et Web Mobile.

L’application permet aux utilisateurs de consulter des menus, créer un compte, passer des commandes et suivre leurs prestations. Des espaces dédiés sont également disponibles pour les employés et administrateurs.

Le frontend communique avec une API REST développée en Symfony.

Le frontend est responsable de l’affichage des données, de l’interaction utilisateur et de la communication avec l’API.

Il est développé en **JavaScript vanilla**, sans framework, avec une architecture de type **Single Page Application (SPA)** basée sur un système de routage côté client.

Bootstrap est utilisé pour la mise en forme, la grille responsive et certains composants d’interface.

---

## Stack technique

- HTML5  
- CSS3 / SCSS  
- JavaScript (Vanilla)  
- Router personnalisé (SPA)  
- Fetch API  
- Bootstrap  
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
- `router.js` → gestion des routes  
- `script.js` → initialisation globale  

---

## API

Le frontend consomme une API REST.

L’URL de l’API est configurée dans les fichiers JavaScript :

```js
const apiUrl = "https://ecfbackendapi-production.up.railway.app/api";
```

---

## Lancer le projet el local
1. Cloner le repository frontend :
git clone https://github.com/Milady28002/ECF_FrontEnd.git

2. Ouvrir le projet dans VS Code
3. Lancer un serveur local (ex: Live Server)

Application en ligne
https://ecf-front-end.vercel.app/

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