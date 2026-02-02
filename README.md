# FoodShop

Application e-commerce alimentaire full-stack avec une interface client (acheteurs) et une interface vendeur (gestion des produits et commandes).

---

## Sommaire

- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancement de l'application](#lancement-de-lapplication)

---

## Technologies utilisées

### Frontend (`client/`)

| Technologie | Rôle |
|-------------|------|
| **React 19** | Bibliothèque UI |
| **Vite 7** | Build tool et serveur de développement |
| **React Router DOM 7** | Routage côté client |
| **Tailwind CSS 4** | Styles utilitaires |
| **React Hook Form** | Gestion des formulaires |
| **React Hot Toast** | Notifications toast |
| **ESLint** | Lint du code |

### Backend (`server/`)

| Technologie | Rôle |
|-------------|------|
| **Node.js** | Runtime JavaScript |
| **Express 5** | Framework web API REST |
| **MongoDB + Mongoose 9** | Base de données NoSQL et ODM |
| **JWT (jsonwebtoken)** | Authentification par token |
| **bcryptjs** | Hash des mots de passe |
| **cookie-parser** | Lecture des cookies |
| **CORS** | Politique d’origine croisée |
| **dotenv** | Variables d’environnement |
| **Multer** | Upload de fichiers |
| **Cloudinary** | Hébergement d’images |
| **Stripe** | Paiement en ligne |
| **Nodemon** | Rechargement auto en dev |

---

## Architecture du projet

```
FoodShop/
├── client/                 # Application frontend (React)
├── server/                 # API backend (Node.js / Express)
└── README.md
```

---

### Architecture Backend (`server/`)

Structure de type **MVC** (Modèle – Vue – Contrôleur), avec une API REST sans couche « Vue » (la vue est le front React).

```
server/
├── server.js              # Point d'entrée, configuration Express, montage des routes
├── configs/
│   └── db.js              # Connexion MongoDB (Mongoose)
├── controllers/
│   └── userController.js  # Logique métier : register, login, logout, etc.
├── middlewares/
│   └── authUser.js        # Vérification JWT et authentification
├── models/
│   ├── user.js            # Schéma utilisateur (Mongoose)
│   └── contact.js         # Schéma contact / formulaire
└── routes/
    └── userRoute.js       # Routes /api/user (register, login, logout)
```

- **`server.js`** : crée l’app Express, applique CORS, `cookie-parser`, `express.json()`, connecte MongoDB, monte le routeur utilisateur sur `/api/user`.
- **`configs/db.js`** : fonction `connectMongo()` pour se connecter à la base `foodstore`.
- **`models/`** : schémas Mongoose (User : name, email, password, cartItems ; Contact : formulaire de contact).
- **`controllers/userController.js`** : inscription, connexion, déconnexion, validation (email, mot de passe), hash bcrypt, JWT et cookies.
- **`middlewares/authUser.js`** : lit le token JWT depuis les cookies, vérifie la signature et attache `userId` à la requête pour les routes protégées.
- **`routes/userRoute.js`** : définit les endpoints POST `/register`, `/login`, `/logout` et les associe aux contrôleurs.

---

### Architecture Frontend (`client/`)

Application **React** organisée par **pages**, **composants** et **contexte global**.

```
client/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx           # Point d'entrée React
│   ├── App.jsx            # Routes et structure layout (Navbar, Footer, Seller)
│   ├── index.css          # Styles globaux + Tailwind
│   ├── assets/            # Images, icônes, données (ex. dummyProducts)
│   ├── context/
│   │   └── AppContext.jsx # État global : user, panier, auth, produits, vendeur
│   ├── components/       # Composants réutilisables
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Login.jsx
│   │   ├── MainBanner.jsx
│   │   ├── Categories.jsx
│   │   ├── BestSeller.jsx
│   │   ├── ProductCard.jsx
│   │   ├── BottomBanner.jsx
│   │   ├── NewsLetter.jsx
│   │   └── seller/
│   │       └── SellerLogin.jsx
│   └── pages/             # Pages / écrans
│       ├── Home.jsx
│       ├── AllProducts.jsx
│       ├── ProductCategory.jsx
│       ├── ProductDetails.jsx
│       ├── Cart.jsx
│       ├── AddAddress.jsx
│       ├── MyOrders.jsx
│       ├── Contact.jsx
│       └── seller/
│           ├── SellerLayout.jsx   # Layout + sous-routes vendeur
│           ├── AddProduct.jsx
│           ├── ProductList.jsx
│           └── Orders.jsx
```

- **`App.jsx`** : utilise React Router ; affiche Navbar/Footer sauf sur les routes `/seller` ; modal Login selon `showUserLogin` ; routes vendeur protégées par `isSeller` (sinon redirection vers SellerLogin).
- **`AppContext.jsx`** : état partagé (utilisateur, panier, produits, recherche, auth) et fonctions (addToCart, login, register, etc.).
- **Routes principales** : `/` (accueil), `/products`, `/products/:category`, `/products/:category/:id`, `/contact`, `/cart`, `/add-address`, `/my-orders`.
- **Routes vendeur** : `/seller` (layout), `/seller/product-list`, `/seller/orders`.

---

## Installation

### Prérequis

- **Node.js** (v18 ou supérieur recommandé)
- **npm** (ou yarn / pnpm)
- **MongoDB** (local ou Atlas) pour le backend

---

### Backend (`server/`)

1. Aller dans le dossier serveur :

   ```bash
   cd server
   ```

2. Installer les dépendances :

   ```bash
   npm install
   ```

3. Créer un fichier `.env` à la racine de `server/` (voir section [Variables d'environnement](#variables-denvironnement)).

---

### Frontend (`client/`)

1. Aller dans le dossier client :

   ```bash
   cd client
   ```

2. Installer les dépendances :

   ```bash
   npm install
   ```

3. Optionnel : créer un fichier `.env` dans `client/` si vous utilisez des variables (ex. `VITE_API_URL`, `VITE_CURRENCY`).

---

## Variables d'environnement

### Backend (`server/.env`)

| Variable       | Description                    | Exemple                    |
|----------------|--------------------------------|----------------------------|
| `MONGODB_URI`  | Chaîne de connexion MongoDB    | `mongodb://localhost:27017` ou URI Atlas |
| `JWT_SECRET`   | Secret pour signer les JWT     | Chaîne longue et aléatoire |
| `PORT`         | Port du serveur (optionnel)    | `3000`                     |
| `NODE_ENV`     | Environnement (development / production) | `development`     |

Exemple minimal :

```env
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire
PORT=3000
NODE_ENV=development
```

### Frontend (`client/.env`)

Les variables exposées au code doivent être préfixées par `VITE_` (ex. `VITE_CURRENCY`, `VITE_API_URL` si vous centralisez l’URL de l’API).

---

## Lancement de l'application

1. **Démarrer le backend** (depuis la racine du projet) :

   ```bash
   cd server
   npm run dev
   ```

   Le serveur tourne par défaut sur `http://localhost:3000` (ou le `PORT` défini dans `.env`). Nodemon recharge automatiquement à chaque modification.

2. **Démarrer le frontend** (dans un autre terminal) :

   ```bash
   cd client
   npm run dev
   ```

   L’application React est disponible sur `http://localhost:5173` (Vite).

3. **Build de production**

   - Frontend : `cd client && npm run build` (sortie dans `client/dist`).
   - Backend : `cd server && npm start` (lance `node server.js`).

---

## Résumé des commandes

| Dossier   | Commande        | Effet                          |
|-----------|-----------------|---------------------------------|
| `server/` | `npm run dev`   | API en mode développement (nodemon) |
| `server/` | `npm start`     | API en production              |
| `client/` | `npm run dev`   | Front en mode développement (Vite)  |
| `client/` | `npm run build` | Build de production du front   |
| `client/` | `npm run preview` | Prévisualiser le build de production |

---

## API utilisateur (exemples)

- `POST /api/user/register` — Inscription (name, email, password)
- `POST /api/user/login` — Connexion (email, password), renvoie un cookie JWT
- `POST /api/user/logout` — Déconnexion (efface le cookie)

L’authentification pour les routes protégées repose sur le cookie contenant le JWT et le middleware `authUser`.



SlimDev20@29031980