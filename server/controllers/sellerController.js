import jwt from "jsonwebtoken";

// Fonction pour la connexion du vendeur : Seller : api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Vérification du mot de passe avec la variable d'environnement
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Création du cookie pour la session du vendeur : Seller  //
      res.cookie("sellerToken", token, {
        httpOnly: true,
        // Secure: true si en production, sinon false pour le développement //
        secure: process.env.NODE_ENV === "production",
        // SameSite: none si en production, sinon strict pour le développement //
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });
      return res.status(201).json({ success: true, message: "Logged in" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error for connexion:", error);
    return res.status(500).json({ errorMessage: "Error for connexion" });
  }
};

// création d'une fonction: isSellerAuth pour vérfier si le seller est authentifié : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    return res.status(200).json({ success: true});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, errorMessage: error.message });
  }
};

// Fonction pour deconnecter le seller : /api/seller/logout 
export const sellerLogout = async (req, res ) => {
  try {
    // On supprime le cookie 
    res.clearCookie('sellerToken', {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    return res.status(200).json({success: true, message: 'Logged out'})
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success:false, errorMessage: error.message}); 
  }
}
