# Configuration du webhook Stripe en local

## Problème

Stripe envoie les webhooks depuis ses serveurs. En développement local, Stripe **ne peut pas** atteindre `http://localhost:3000/stripe` car localhost n'est pas accessible depuis Internet.

Sans webhook fonctionnel :
- La commande reste `isPaid: false` → invisible dans my-orders
- Le panier n'est jamais vidé

## Solution : Stripe CLI

### 1. Installer Stripe CLI

- **Mac** : `brew install stripe/stripe-cli/stripe`
- **Windows** : télécharger depuis https://stripe.com/docs/stripe-cli
- Ou : `npm install -g stripe`

### 2. Se connecter

```bash
stripe login
```

### 3. Lancer le tunnel webhook

Dans un terminal séparé (avec le serveur déjà lancé sur le port 3000) :

```bash
stripe listen --forward-to localhost:3000/stripe
```

### 4. Copier le secret webhook

La CLI affiche une ligne du type :
```
Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### 5. Mettre à jour le fichier .env

```env
STRIPE_WEBHOOK_SECRET='whsec_xxxxxxxxxxxxx'
```

⚠️ **Important** : Le webhook secret doit commencer par `whsec_`, **pas** par `sk_test_`. Ne pas utiliser `STRIPE_SECRET_KEY` pour le webhook.

### 6. Redémarrer le serveur

Après modification du .env, redémarrer `npm run dev`.

---

## Vérification

Quand un paiement est effectué en test, la CLI affiche les événements reçus et les réponses. Si tout fonctionne, vous verrez les logs du webhook dans le terminal du serveur.
