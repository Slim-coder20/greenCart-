import Address from "../models/address.js";
// ============================================
// Add Address: api/address/add
// Cette fonction est utilisée pour ajouter une adresse de livraison de la commande .
// ============================================

export const addAddress = async (req, res) => {
  try {
    // Récupérer l'adresse et l'ID de l'utilisateur depuis le corps de la requête
    const { address, userId } = req.body;
    // Créer une nouvelle adresse dans la base de donnéees
    await Address.create({ ...address, userId });
    // Retourner un message de succès
    res
      .status(201)
      .json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error("Error", error);
    // retourner un message d'erreur
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// Fonction pour récupérer l'adresse de l'utilisateur : api/address/get
// Cette fonction est utilisée pour récupérer l'adresse de l'utilisateur depuis la base de donnéees.
// ============================================

export const getAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    // Récupérer l'adresse de l'utilisateur depuis la base de donnéees
    const addresses = await Address.find({ userId });
    
    // Vérifier si l'adresse n'existe pas
    if (!addresses) {
    // Retourner un message d'erreur
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    // Retourner l'adresse de l'utilisateur
    return res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error("Error", error);
    // Retourner un message d'erreur
    return res.status(500).json({ success: false, message: error.message });
  }
};