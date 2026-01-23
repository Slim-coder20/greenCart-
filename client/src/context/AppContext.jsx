import { createContext, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Ce context est utilisé pour gérer l'état global de l'application : 
 * - Navigation
 * - Utilisateur
 * - Venteur
 * - Login
 * - Register
 * - Logout
 * - Cart
 * - Search
 */

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
