# Vite & Gourmand – Projet ECF

Ce projet est réalisé dans le cadre de l’**ECF – Graduate Développeur Web Full Stack**.
Il s’agit d’un site web avec **routage front-end en JavaScript (SPA)**, sans framework.

---

## 🧱 Structure du projet

La racine technique du projet est le dossier :

```
ECF/VSCODE
```

Il contient notamment :

* `index.html` → point d’entrée de l’application
* `pages/` → pages HTML chargées dynamiquement (home, decouvrir, 404…)
* `Router/` → logique de routage JavaScript
* `scss/` → styles SCSS compilés en CSS
* `script.js` → logique JavaScript principale

---

## ▶️ Lancement du projet en local

### 1️⃣ Prérequis

* PHP installé sur la machine (version 8.x)
* Visual Studio Code
* Un navigateur web

---

### 2️⃣ Démarrage du serveur local

Ouvrir un terminal **dans VS Code**, puis se placer dans le bon dossier :

```powershell
cd ECF\VSCODE
```

Lancer ensuite le serveur PHP intégré :

```powershell
php -S localhost:3001
```

Un message de confirmation doit apparaître :

```
PHP Development Server (http://localhost:3001) started
```

---

### 3️⃣ Accès au site

Dans le navigateur, ouvrir uniquement l’URL suivante :

```
http://localhost:3001/
```

⚠️ Il est volontairement déconseillé d’accéder directement aux routes comme :

* `/decouvrir`
* `/home`
* `/pages/404.html`

Ces routes sont gérées **exclusivement par le routage JavaScript côté client**.

---

## 🔀 Fonctionnement du routage

Le projet utilise un **routage front-end (SPA)** :

* L’application charge toujours `index.html`
* Les contenus sont injectés dynamiquement depuis le dossier `pages/`
* La navigation se fait via JavaScript, sans rechargement complet de la page

### Comportement attendu

* ✅ Navigation par clic sur les boutons/liens → OK
* ❌ Rafraîchissement de la page sur une route interne → page 404 (comportement normal)
* ❌ Accès direct à une route interne via l’URL → page 404 (comportement normal)

Ce choix est conforme aux consignes pédagogiques de l’ECF.

---

## 🛑 Arrêt du serveur

Pour arrêter le serveur PHP :

* Cliquer dans le terminal où le serveur est actif
* Appuyer sur :

```
Ctrl + C
```

Si le port est encore occupé, il est possible de relancer le serveur sur un autre port (ex. 3002).

---

## 🔐 Justification technique des choix

Le choix d’un **routage front-end en JavaScript sans framework** a été fait afin de démontrer la compréhension des mécanismes fondamentaux du web (chargement dynamique, gestion de l’historique, séparation des responsabilités).

L’utilisation du serveur PHP intégré a pour seul objectif de **servir les fichiers en local** pendant le développement, sans logique back-end.

Dans ce contexte, l’apparition d’une page 404 lors du rafraîchissement d’une route interne est un **comportement attendu et connu**, lié à l’absence volontaire de fallback serveur, conformément aux consignes pédagogiques de l’ECF.

---

## Explications

> « Le projet utilise un routage front-end en JavaScript. Lorsqu’on navigue via l’interface, le JavaScript intercepte les liens et charge dynamiquement les pages.
> En revanche, si on recharge directement une route interne, le serveur PHP cherche un fichier physique qui n’existe pas et renvoie donc une 404.
> Ce comportement est normal dans une SPA sans configuration serveur spécifique, et il est volontairement assumé dans le cadre de l’ECF. »

---

## ℹ️ Remarques importantes

* Une page 404 au rechargement d’une route interne est **normale** dans ce contexte
* Le serveur PHP est utilisé uniquement pour le développement local
* Aucun framework (React, Vue, etc.) n’est utilisé volontairement

---


## 👩‍💻 Autrice

Projet réalisé par **Sylvie** dans le cadre de la formation *Graduate Développeur Web Full Stack*.
