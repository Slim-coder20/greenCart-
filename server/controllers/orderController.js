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
