# Déploiement FoodShop sur Vercel

Votre application a **2 parties** : le frontend (React) et le backend (Express). Voici comment les déployer en production.

---

## Recommandation : 2 déploiements séparés

| Partie    | Plateforme | Raison                                          |
|-----------|------------|--------------------------------------------------|
| Frontend  | Vercel     | Idéal pour React/Vite, déploiement très simple   |
| Backend   | Railway ou Render | Mieux adapté à Express, MongoDB, webhooks Stripe |

Le backend Express (base de données, webhooks, fichiers) fonctionne mieux sur une plateforme qui laisse tourner un serveur en continu.

---

## Option 1 : Frontend sur Vercel + Backend sur Railway

### Étape 1 : Déployer le backend sur Railway

1. Créer un compte sur [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub** (ou uploadez le dossier `server`)
3. Configurer le **Root Directory** : `server`
4. Ajouter les variables d'environnement dans Railway :
   - `PORT` (Railway le définit souvent automatiquement)
   - `JWT_SECRET`
   - `MONGODB_URI`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET` (voir étape Stripe ci-dessous)
   - Toutes les autres variables de `.env`
5. Railway vous donnera une URL : `https://votre-app.up.railway.app`

### Étape 2 : Configurer le webhook Stripe en production

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL** : `https://votre-app.up.railway.app/stripe`
3. Événements : `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
4. **Reveal** le **Signing secret** (`whsec_...`) et l’ajouter dans Railway

### Étape 3 : Déployer le frontend sur Vercel

1. Créer un compte sur [vercel.com](https://vercel.com)
2. **Add New** → **Project** → importer depuis GitHub
3. Configurer :
   - **Root Directory** : `client`
   - **Framework Preset** : Vite (détecté automatiquement)
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
4. Variables d'environnement :
   - `VITE_BACKEND_URL` = `https://votre-app.up.railway.app`
   - `VITE_CURRENCY` = `$` (ou votre devise)
5. Déployer

### Étape 4 : Mettre à jour CORS et URLs

Dans `server/server.js`, ajouter l’URL du frontend Vercel dans `allowedOrigins` :

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://votre-app.vercel.app"
]
```

Dans `server/controllers/orderController.js` (placeOrderStripe), l’`origin` vient des headers. Si besoin, forcer l’URL de production pour `success_url` et `cancel_url`.

---

## Option 2 : Tout sur Vercel (frontend + backend)

Vercel peut héberger l’API via des Serverless Functions, mais cela demande d’adapter le backend.

### Fichiers à créer

**`vercel.json`** à la racine du projet :

```json
{
  "version": 2,
  "builds": [
    { "src": "client/package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } },
    { "src": "server/server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server/server.js" },
    { "src": "/stripe", "dest": "/server/server.js" },
    { "src": "/(.*)", "dest": "/client/$1" }
  ]
}
```

**Adaptations dans `server/server.js`** :
- Exporter `app` pour Vercel
- Ne pas appeler `app.listen()` en environnement serverless
- Gérer le raw body pour le webhook Stripe

Cette approche est plus technique. L’**Option 1** (Vercel + Railway) reste plus simple et plus stable pour un backend Express complet.

---

## Checklist production

- [ ] Variables d'environnement configurées sur la plateforme de déploiement
- [ ] CORS mis à jour avec l’URL de production du frontend
- [ ] Webhook Stripe créé avec l’URL de production du backend
- [ ] `STRIPE_WEBHOOK_SECRET` = secret `whsec_` du Dashboard (pas la clé API)
- [ ] Cookies configurés pour le domaine de production (si nécessaire)
- [ ] MongoDB accessible depuis Internet (Atlas par défaut)
