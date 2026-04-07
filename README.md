# Vite & Gourmand - Frontend

## Description

Ce projet correspond au frontend de l’application web **Vite & Gourmand**, réalisée dans le cadre de l’Évaluation de Compétences Finale (ECF) du titre professionnel Développeur Web et Web Mobile.

L’application permet aux utilisateurs de consulter des menus, créer un compte, passer des commandes et suivre leurs prestations. Des espaces dédiés sont également disponibles pour les employés et administrateurs.

---

## Stack technique

- HTML5
- CSS3 / Bootstrap
- JavaScript Vanilla
- Architecture SPA (Single Page Application)
- Router personnalisé

---

## Fonctionnalités principales

- Page d’accueil avec présentation et avis clients
- Catalogue des menus avec filtres dynamiques
- Vue détaillée des menus (plats, allergènes, conditions…)
- Inscription / Connexion / Réinitialisation mot de passe
- Passage de commande avec calcul dynamique du prix
- Application automatique des réductions
- Espace utilisateur (gestion commandes et profil)
- Espace employé (gestion commandes, menus, horaires)
- Espace administrateur
- Formulaire de contact

---

## Structure du projet

- `/pages` → vues HTML
- `/js` → logique JavaScript
- `/css` ou `/scss` → styles
- `router.js` → gestion des routes
- `script.js` → initialisation globale

---

## Prérequis

- Navigateur web moderne
- Backend Symfony lancé en local
- API disponible à l’adresse :
  http://127.0.0.1:8000/api/

---

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/Milady28002/ECF_FrontEnd.git

2. Ouvrir le projet dans votre éditeur (VS Code recommandé)
3. Lancer un serveur local (exemple) : Live Server (VS Code)
ou tout autre serveur statique

---

## Lancement

Accéder à l’application via :

`http://127.0.0.1:3001`

L'application nécessite que le backend Symfony soit lancé pour fonctionner correctement.

--- 

## Comptes de test
-	Utilisateur :
email : dana.scully@user.com
mot de passe : Azerty@123

-	Employé :
email : employe@vitegourmand.fr
mot de passe : Admin123!

-	Administrateur :
email : admin@vitegourmand.fr
mot de passe : Admin123!

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
- Gestion des rôles utilisateur 
- Protection des routes selon authentification 
- Redirection automatique en cas d’accès non autorisé 
- Gestion des tokens d’authentification

## 👩‍💻 Autrice
Projet réalisé par Sylvie Mendez alias Milady
Formation Graduate Développeur Web Full Stack
