import Order from "../models/order.js";
import Product from "../models/product.js";

//================================
// Ce controller est utilisé pour gérer les commandes des utilisateurs dans la base de données :
// - Créer une nouvelle commande
// - Récupérer une commande pour un utilisateur spécifique
// - Récupération de tous les commandes pour un vendeur ou admin 
//================================

// Fonction qui permet de créer une nouvelle commande: /api/order/cod
export const placeOrderCod = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || !items === 0) {
      return res.status(400).json({ success: false, message: "Invalid Data" });
    }
    // Calculer le montant total de la commande //
    let amount = await items.reduce(async (acc, item) => {
      // Récupérer le produit //
      const product = await Product.findById(item.product);
      // Si le produit a une offre on utililse l'offre,sinon on utilise le prix normal //
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    // Ajout de la taxe (2%)
    amount += Math.floor(amount * 0.02);

    // Création de la commande dans la base de données //
    await Order.create({
      userId,
      items,
      amount,
      address,
      payementType: "COD",
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
    // Récupérer les commandes de l'utilisateur //
    const orders = await Order.find({
      userId,
      $or: [
        {
          payementType: "COD",
          isPaid: true,
        },
      ],
      // Récupérer les produits de la commande //
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
    // Récupérer les commandes de l'utilisateur //
    const orders = await Order.find({
      $or: [
        {
          payementType: "COD",
          isPaid: true,
        },
      ],
      // Récupérer les produits de la commande //
    }).populate("items.product address").sort({createdAt: -1});
    // Retourner les commandes //
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    // Retourner un message d'erreur //
    console.error("Error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
