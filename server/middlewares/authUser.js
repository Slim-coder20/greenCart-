import jwt from 'jsonwebtoken';
import User from '../models/user.js';
/**
  Ce middleware est utilisé pour vérifier si l'utilisateur est authentifié et si le token est valide.
  Le token peut être envoyé soit dans le cookie "token", soit dans l'en-tête Authorization: Bearer <valeur_du_jwt>.
 */
export const authUser = async (req, res, next ) => {
  // récupérer le token dans les cookies
  const cookieToken = req.cookies?.token;
  
  // récupérer le token dans l'en-tête Authorization
  const authHeader = req.headers.authorization;
  
  // récupérer le token dans l'en-tête Authorization
  let bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  
  // récupérer le token dans l'en-tête Authorization
  if (bearerToken) bearerToken = bearerToken.replace(/^<|>$/g, '');
  
  // récupérer le token dans l'en-tête Authorization
  const token = cookieToken || bearerToken;

  // vérifier si le token est présent
  if (!token) {
    return res.status(401).json({success: false, errorMessage: 'Not Authorized'});
  }
  try {
    // vérifier si le token est valide 
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    // vérifier si l'utilisateur existe dans la base de données
    if (tokenDecode.id) {
      // GET n'a pas de body par défaut On créé le body si req.body est undefined on le remplace avec un objet vide //
      if (!req.body) req.body = {};
      req.body.userId = tokenDecode.id;
    } else {
      // si l'utilisateur n'existe pas, renvoyer une réponse d'erreur
      return res.status(401).json({success: false, errorMessage: 'Not Authorized'});  
    }
    next();
  } catch (error) {
    console.error('Auth JWT error:', error.message);
    return res.status(401).json({
      success: false,
      errorMessage: 'Invalid or expired token',
    });
  }
};

