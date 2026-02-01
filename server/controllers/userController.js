import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Création d'un nouveau User : /api/user/register 
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "All fields are required", success: false });
    }
    // Vérfication si le user existe déjà //
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errorMessage: "User already exists", success: false });
    }

    // Normalisation de l'email //
    const normalizedEmail = email.toLowerCase().trim();

    // Validation du format de l'email //
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      return res
        .status(400)
        .json({ errorMessage: "Invalid email format", success: false });
    }

    // Validation de la longueur du mot de passe //
    if (password.length < 8) {
      return res.status(400).json({
        errorMessage: "Password must be at least 8 characters long",
        success: false,
      });
    }
    // Validation de la force du mot de passe (majuscule, minuscule, chiffre, caractère spécial)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        errorMessage:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        success: false,
      });
    }
    // Hashage du mot de passe //
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouveau User //
    const user = await User.create({ name, email, password: hashedPassword });

    // Création du Token JWT //
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    // Création du cookie pour la session de l'utilisateur //
    res.cookie('token', token, {
      httpOnly: true,
      // Secure: true si en production, sinon false pour le développement //
      secure: process.env.NODE_ENV === 'production',
      // SameSite: none si en production, sinon strict pour le développement //
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    })

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        cartItems: user.cartItems || {},
      },
    });
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Internal server error",
      success: false,
    });
  }
};

// Création d'une fonction pour la connexion user : /api/user/login 
export const login  = async (req, res ) => {
  try {
    const {email, password } = req.body;

    // Vérification des champs email et mot de passe 
    if(!email || !password ) {
      return res.status(400).json({success: false, errorMessage: "All fields are required"});
      }
      
    // Normalisation de l'email
    const normalizedEmail = email.toLowerCase().trim();

    // Vérification si l'email existe 
    const user =  await User.findOne({email}); 
    if(!user){
      return res.status(401).json({errorMessage: "Invalid email or password", success: false});
    }

    // Vérification du mot de passe 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({errorMessage: "Email and password invalid", success:false})
    }
    
    // Création du Token JWT //
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    // Création du cookie pour la session de l'utilisateur //
    res.cookie('token', token, {
      httpOnly: true,
      // Secure: true si en production, sinon false pour le développement //
      secure: process.env.NODE_ENV === 'production',
      // SameSite: none si en production, sinon strict pour le développement //
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    })
      return res.status(201).json({
        success: true,
        message: "User connected",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          cartItems: user.cartItems || {},
        },
      });
    } catch (error) {
    console.error('Error for connexion:', error);
    return res
    .status(500)
    .json({ errorMessage: 'Error for connexion' });
  }
}

// Vérification si le user est authentifié : GET /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, errorMessage: "User not found" });
    }
    return res.status(200).json({
      // Réponse de succès avec les données de l'utilisateur
      success: true,
      user: {
        // Données de l'utilisateur
        _id: user._id,
        name: user.name,
        email: user.email,
        cartItems: user.cartItems || {},
      },
    });
  } catch (error) {
    console.error("isAuth error:", error.message);
    return res.status(500).json({ success: false, errorMessage: error.message });
  }
};

// Création d'une fonction pour la deconnexion /api/user/logout 
export const logout = async (req, res ) => {
  try {
    // On supprime le cookie 
    res.clearCookie('token', {
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