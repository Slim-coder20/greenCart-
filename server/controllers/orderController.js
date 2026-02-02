import Order from "../models/order.js";
import Product from "../models/product.js";
import stripe from "stripe";

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
        userId, 
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
