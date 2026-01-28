import jwt from 'jsonwebtoken';
import User from '../models/User';
/**
  Ce middleware est utilisé pour vérifier si l'utilisateur est authentifié et si le token est valide 
 */
export const authUser = async (req, res, next ) => {
  const { token } = req.cookies; 
  // vérifier si le token est présent 
  if(!token ){
    return res.status(401).json({success: false, errorMessage: 'Not Authorized'}); 
  }
  try {
    // vérifier si le token est valide 
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    // vérifier si l'utilisateur existe dans la base de données
    if(tokenDecode.id){
      req.body.userId = tokenDecode.id;
    } else {
      // si l'utilisateur n'existe pas, renvoyer une réponse d'erreur
      return res.status(401).json({success: false, errorMessage: 'Not Authorized'});  
    }
    next();
  } catch (error) {
    // si une erreur se produit, renvoyer une réponse d'erreur
    return res.status(401).json({success: false, errorMessage: 'Not Authorized'}); 
  }
};

/**