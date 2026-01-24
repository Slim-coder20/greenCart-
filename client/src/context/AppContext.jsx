import { createContext, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

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
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery ] = useState({}); 

  // Création d'une fonction qui va me permettre de récupérer l'objet dummyProducts depuis le fichier assets.js//
  const fetchProducts = async () => {
    setProducts(dummyProducts);
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
  // Fonction qji va permettre de mettre a jour la quantité d'un produit dans le panier //
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
    setCartItems(cartData)
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Ce tableau value va me permettre de récupérer les valeurs de l'état global de l'application //
  // et de les utiliser dans les composants enfants //
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
    setSearchQuery
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};;

export const useAppContext = () => {
  return useContext(AppContext);
};
