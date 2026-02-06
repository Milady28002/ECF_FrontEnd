# Vite & Gourmand – Frontend (Projet ECF)

Ce projet est réalisé dans le cadre de l’ECF – Graduate Développeur Web Full Stack**.

Il s’agit du **frontend** du projet *Vite & Gourmand*, développé en **HTML, SCSS et JavaScript**, avec un **routage front-end (SPA) sans framework**, conformément aux consignes pédagogiques.

---

## 🧱 Structure du projet

La racine du projet frontend est le dossier :

ECF/VSCODE


Il contient notamment :

- `index.html` → point d’entrée unique de l’application
- `pages/` → pages HTML chargées dynamiquement
- `Router/` → logique de routage JavaScript
- `scss/` → styles SCSS compilés en CSS
- `script.js` → logique JavaScript principale (configuration, API, auth…)

---

## ▶️ Lancement du frontend en local

### 1️⃣ Prérequis

- PHP ≥ 8.x
- Visual Studio Code
- Un navigateur web moderne

---

### 2️⃣ Démarrage du serveur local

Ouvrir un terminal dans VS Code, puis :

```bash
cd ECF/VSCODE
php -S 127.0.0.1:3001

Un message de confirmation doit apparaître :

PHP Development Server (http://127.0.0.1:3001) started

3️⃣ Accès au site

Dans le navigateur :

http://127.0.0.1:3001/

⚠️ Les routes internes (/signin, /signup, etc.) sont gérées exclusivement par le routage JavaScript.
🔀 Fonctionnement du routage

Le projet utilise un routage front-end (Single Page Application) :

    index.html est toujours chargé

    Les contenus sont injectés dynamiquement

    La navigation se fait sans rechargement complet de page

Comportements attendus

    ✅ Navigation via l’interface → OK

    ❌ Rafraîchissement sur une route interne → 404 (comportement normal)

    ❌ Accès direct à une route interne → 404 (comportement normal)

Ce comportement est volontaire et conforme aux consignes de l’ECF.
🔌 Communication avec l’API

Le frontend communique avec une API backend Symfony via des requêtes HTTP (fetch).

L’URL de l’API est centralisée dans le fichier script.js :

const apiUrl = "http://127.0.0.1:8000/api/";

Cela permet :

    une maintenance facilitée

    une cohérence front/back

    d’éviter les problèmes d’origine (CORS)

🌱 Bonnes pratiques Git

Le projet frontend utilise la stratégie suivante :

    main → version stable

    dev → branche de développement

Le développement est réalisé sur la branche dev, puis fusionné vers main une fois stable.


👩‍💻 Autrice
Projet réalisé par Sylvie
Formation Graduate Développeur Web Full Stack