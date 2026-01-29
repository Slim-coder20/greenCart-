import User from "../models/user.js";

// ============================================
// update User Cartdata in the data base : api/cart/update
// Cette fonction est utilisée pour mettre à jour les données du panier de l'utilisateur dans la base de donnéees.
// ============================================

export const updateCart = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur et les éléments du panier depuis le corps de la requête
    const { userId, cartItems } = req.body;
    // Mettre à jour les données du panier de l'utilisateur dans la base de donnéees
    await User.findByIdAndUpdate(userId, { cartItems });
    // Retourner un message de succès
    res.status(200).json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error("Error", error);
    // retourner un message d'erreur
    return res.status(500).json({ errorMessage: "Error for updated cart" });
  }
};
