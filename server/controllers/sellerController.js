import jwt from "jsonwebtoken";

// Fonction pour la connexion du vendeur : Seller : api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const trimmedEmail = email?.trim?.() ?? "";
    const trimmedPassword = password?.trim?.() ?? "";
    // Vérification des identifiants avec les variables d'environnement
    if (
      trimmedPassword === process.env.SELLER_PASSWORD &&
      trimmedEmail === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email: trimmedEmail }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        path: "/",
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
    const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      path: "/",
    });
    return res.status(200).json({success: true, message: 'Logged out'})
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success:false, errorMessage: error.message}); 
  }
}
