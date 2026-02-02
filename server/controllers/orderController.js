import Order from "../models/order.js";
import Product from "../models/product.js";
import stripe from "stripe";
import User from "../models/user.js"; 

//================================
// Ce controller est utilisé pour gérer les commandes des utilisateurs dans la base de données :
// - Créer une nouvelle commande
// - Récupérer une commande pour un utilisateur spécifique
// - Récupération de tous les commandes pour un vendeur ou admin 
//================================

// Fonction qui permet de créer une nouvelle commande avec paiement a la livraison : /api/order/cod
export const placeOrderCod = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid Data" });
    }

    // Calcul du montant total de la commande
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }
      amount += (product.offerPrice || product.price) * item.quantity;
    }
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
    });
    return res
      .status(201)
      .json({ success: true, message: "Order placed Successfully" });
  } catch (error) {
    // retourner un message d'erreur
    console.error("Error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Focntion qui permet de créer une nouvelle commande avec paiement en ligne : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    
    const { userId, items, address } = req.body;
  
    // Récupérer l'origine de la requête
    const {origin } = req.headers;  
    
    // Récupérer les données du produit et les ajouter au tableau productData pour le paiement en ligne
    let productData = []; 
    
    // Vérifier si les données sont valides
    if (!address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid Data" });
    }

    // Calcul du montant total de la commande
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      // Ajouter les données du produit au tableau productData pour le paiement en ligne
      productData.push({
        name: product.name,
        price: product.offerPrice || product.price,
        quantity: item.quantity,
      }); 
      // Vérifier si le produit existe
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }
      amount += (product.offerPrice || product.price) * item.quantity;
    }
    amount += Math.floor(amount * 0.02);
  // Créer la commande dans la base de données pour le paiement en ligne /
   const order =  await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
    });
    // Créer d'une instance Stripe via la secrte Key  /
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    //création du paiement en ligne via l'instance Stripe //
    const line_items = productData.map((item) => {
       return {
          price_data: {
            currency: "usd",
            product_data: {
               name: item.name, 
            },
            unit_amount: Math.floor(item.price + item.price * 0.02) * 100
          },
          quantity: item.quantity,
       }
    })

    // Création de la session de paiement en ligne via Stripe // 
    const session = await stripeInstance.checkout.sessions.create({
      line_items, 
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url:`${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      }
    })
    return res
      .status(201)
      .json({ success: true, url: session.url});
  } catch (error) {
    // retourner un message d'erreur
    console.error("Error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * stripeWebhooks
 * Route : POST /stripe
 *
 * Webhook appelé par Stripe pour notifier les événements de paiement.
 * Doit être configuré avec express.raw() car Stripe exige le body brut pour la vérification de signature.
 * Événements gérés :
 * - checkout.session.completed : paiement réussi via Checkout → met à jour la commande, vide le panier
 * - payment_intent.succeeded : alternative pour paiement réussi
 * - payment_intent.payment_failed : paiement échoué → supprime la commande
 */
export const stripeWebhooks = async (req, res) => {
  // 1. Initialisation de l'instance Stripe
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  // 2. Vérification de la signature du webhook (sécurité : garantit que la requête provient de Stripe)
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body, // Body brut (Buffer) requis - ne pas utiliser express.json() sur cette route
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook Stripe - signature invalide:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // 3. Fonction helper : marque la commande comme payée et vide le panier de l'utilisateur
  const handlePaymentSuccess = async (orderId, userId) => {
    await Order.findByIdAndUpdate(orderId, { isPaid: true });
    await User.findByIdAndUpdate(userId, { cartItems: {} });
  };

  // 4. Traitement de l'événement selon son type
  switch (event.type) {
    // Événement principal pour Stripe Checkout (recommandé par Stripe)
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.payment_status !== "paid") break; // Ignorer si paiement non finalisé
      const { orderId, userId } = session.metadata || {};
      if (orderId && userId) {
        await handlePaymentSuccess(orderId, userId);
        console.log("Webhook Stripe: commande", orderId, "marquée comme payée");
      }
      break;
    }

    // Événement alternatif (niveau PaymentIntent)
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      // Récupérer la session Checkout associée (les metadata sont sur la session)
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });
      if (sessionList.data.length > 0) {
        const { orderId, userId } = sessionList.data[0].metadata || {};
        if (orderId && userId) {
          await handlePaymentSuccess(orderId, userId);
        }
      }
      break;
    }

    // Paiement refusé ou échoué : suppression de la commande non payée
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });
      if (sessionList.data.length > 0) {
        const { orderId } = sessionList.data[0].metadata || {};
        if (orderId) await Order.findByIdAndDelete(orderId);
      }
      break;
    }

    default:
      console.log("Webhook Stripe - événement non géré:", event.type);
  }

  // 5. Confirmer à Stripe que le webhook a bien été reçu
  res.json({ received: true });
}






// Récupération d'une commande a partir de l'id du User : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    // Récupérer l'id de l'utilisateur //
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }
    // Récupérer les commandes de l'utilisateur (COD ou payées en ligne)
    const orders = await Order.find({
      userId,
      $or: [
        { paymentType: "COD" },
        { paymentType: "Online", isPaid: true },
      ],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    // Retourner les commandes //
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    // Retourner un message d'erreur //
    console.error("Error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  récupération de tous les commandes pour un vendeur ou admin : api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { paymentType: "COD" },
        { paymentType: "Online", isPaid: true },
      ],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    // Retourner les commandes //
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    // Retourner un message d'erreur //
    console.error("Error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
