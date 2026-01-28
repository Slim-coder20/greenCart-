import jwt from "jsonwebtoken";

/**
 * Ce middleware est utilisé pour vérifier si l'utilisateur est authentifié en tant que vendeur et si le token est valide.
 * Le vendeur est identifié par l'email défini dans SELLER_EMAIL (.env).
 *
 */

export const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }

  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    console.error("Auth JWT error:", error.message);
    return res.status(401).json({
      success: false,
      errorMessage: "Invalid or expired token",
    });
  }
};
