import { createContext, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

/**
 * Ce context est utilisé pour gérer l'état global de l'application : 
 * - Navigation
 * - Utilisateur
 * - Vendeur
 * - Login
 * - Register
 * - Logout
 * - producCart
 * - BestSellers 
 */

// Configuration pour envoyer les cookies avec les requêtes API //
axios.defaults.withCredentials = true; 

// Configuration de l'URL de base pour les requêtes API //
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; 

export const AppContext = createContext();
// Création du context global de l'application //

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Vérifie si le seller est connecté (cookie sellerToken)
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(!!data?.success);
    } catch (error) {
      setIsSeller(false);
    }
  };

  // Vérifie si l'utilisateur est connecté et restaure user + panier (cookie token)
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data?.success && data.user) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      setUser(null);
      setCartItems({});
    }
  };

  // Création d'une fonction qui va me permettre de récupérer l'objet dummyProducts depuis le fichier assets.js et récupérer tous les produits //
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data?.success && data.products) {
        setProducts(data.products);
      } else {
        toast.error(data?.message || "Error loading products");
      }
    } catch (error) {
      toast.error("Error loading products");
    }
  };

  // Fonction qui va permettre d'ajouter un produit au panier //
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  };
  // Fonction qui va permettre de mettre a jour la quantité d'un produit dans le panier //
  const updateCartItemQuantity = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // Fonction qui va permettre de supprimer un produit dans un panier //
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Remove from Cart");
    setCartItems(cartData);
  };

  /**
   * Fonction getCartCount
   * Calcule et retourne le nombre total d'articles dans le panier
   *
   * Logique :
   * - Parcourt tous les produits dans cartItems (objet où clé = ID produit, valeur = quantité)
   * - Additionne toutes les quantités pour obtenir le total d'articles
   */
  const getCartCount = () => {
    let totalCount = 0;
    // Parcourt chaque produit dans le panier
    for (const item in cartItems) {
      // Additionne la quantité de chaque produit au total
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  /**
   * Fonction getCartAmount
   * Calcule et retourne le montant total du panier en utilisant les prix promotionnels
   
   * Logique :
   * - Parcourt tous les produits dans cartItems
   * - Pour chaque produit, trouve les informations complètes dans products via l'ID
   * - Multiplie le prix promotionnel (offerPrice) par la quantité dans le panier
   * - Additionne tous ces montants pour obtenir le total
   * - Arrondit à 2 décimales en utilisant Math.floor (troncature, pas d'arrondi mathématique)
   * 
   * Note : Math.floor(totalAmount * 100) / 100 permet de tronquer à 2 décimales
   * Exemple : 10.999 devient 10.99 (pas 11.00)
   */
  const getCartAmount = () => {
    let totalAmount = 0;
    // Parcourt chaque produit dans le panier
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    // Retourne le montant total arrondi à 2 décimales (troncature)
    return Math.floor(totalAmount * 100) / 100;
  };
  // Au montage : restauration seller, user+panier, et chargement produits
  useEffect(() => {
    fetchSeller();
    fetchUser();
    fetchProducts();
  }, []);

  // Synchronisation du panier vers la BDD quand l'utilisateur modifie cartItems
  useEffect(() => {
    if (!user?._id) return;

    const syncCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data?.success) {
          toast.error(data?.message || "Failed to update cart");
        }
      } catch (error) {
        toast.error(error?.response?.data?.errorMessage || "Failed to update cart");
      }
    };

    syncCart();
  }, [user?._id, cartItems]);

  // Ce tableau value permet de partager les valeurs de l'état global de l'application avec tous le composants de l'applicat //
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Fonction qui permet de récupérer les valeurs de l'état global de l'application dans les composants enfants //
export const useAppContext = () => {
  return useContext(AppContext);
};
