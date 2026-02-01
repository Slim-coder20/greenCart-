// ============================================
// IMPORTS
// ============================================
import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import {useEffect } from "react";
import toast from "react-hot-toast";


// ============================================
// COMPOSANT NAVBAR
// ============================================
export const Navbar = () => {
  // ============================================
  // ÉTATS ET CONTEXT
  // ============================================
  const [open, setOpen] = React.useState(false); // État pour l'ouverture/fermeture du menu mobile
  const {
    user,
    setUser,
    setCartItems,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

 /**
  * 
  * Déconnexion du user avec envoie de données au serveur pour la deconnexion et suppression du cookie de connexion
  */

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data?.success) {
        setUser(null);
        setCartItems({});
        navigate("/");
        toast.success(data.message);
      }
    } catch (error) {
      setUser(null);
      setCartItems({});
      toast.error("An error occurred during logout");
    }
  }; 

  // ============================================
  // RENDU DU COMPOSANT
  // ============================================
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-50">
      {/* ============================================
          LOGO - Lien vers la page d'accueil
          ============================================ */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* ============================================
          MENU DESKTOP - Visible uniquement sur écrans >= sm (640px)
          ============================================ */}
      <div className="hidden sm:flex items-center gap-8">
        {/* ============================================
            LIENS DE NAVIGATION PRINCIPAUX
            ============================================ */}
        <NavLink to="/" className="hover:text-primary-dull">
          Home
        </NavLink>
        <NavLink to="/products" className="hover:text-primary-dull">
          All Product
        </NavLink>
        <NavLink to="/contact" className="hover:text-primary-dull">
          Contact
        </NavLink>

        {/* ============================================
            BARRE DE RECHERCHE - Visible uniquement sur écrans >= lg (1024px)
            ============================================ */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        {/* ============================================
            ICÔNE PANIER - Avec badge du nombre d'articles
            ============================================ */}
        <div
          onClick={() => navigate("cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {/* ============================================
            BOUTON LOGIN / MENU PROFIL
            Condition : Si user n'existe pas → Affiche bouton Login
                       Si user existe → Affiche icône profil avec menu déroulant
            ============================================ */}
        {!user ? (
          // Bouton Login - Affiche la modale de connexion
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          // Menu profil avec dropdown - Visible au survol
          <div className="relative group">
            <img
              src={assets.profile_icon}
              alt="profile-icon"
              className="w-10"
            />
            {/* Menu déroulant avec options utilisateur */}
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("my-orders")}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ============================================
          ICÔNE PANIER ET BOUTON MENU HAMBURGER MOBILE - Visible uniquement sur mobile (< sm)
          ============================================ */}
      <div className="sm:hidden flex items-center gap-4">
        {/* Icône panier mobile */}
        <div
          onClick={() => navigate("cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {getCartCount()}
          </button>
        </div>
        {/* Bouton menu hamburger */}
        <div>

        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
        >
          <img src={assets.menu_icon} alt="menu" />
        </button>
        </div>
      </div>

      {/* ============================================
          MENU MOBILE - S'affiche quand open === true
          Visible uniquement sur écrans < md (768px)
          ============================================ */}
      {open && (
        <div
          className={`${open ? "flex" : "hidden"} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}
        >
          {/* ============================================
              LIENS DE NAVIGATION MOBILE
              ============================================ */}
          <NavLink to="/" onClick={() => setOpen(false)} className="block">
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className="block"
          >
            All Products
          </NavLink>

          {/* ============================================
              LIEN "MY ORDERS" - Visible uniquement si user est connecté
              ============================================ */}
          {user && (
            <NavLink to="/" onClick={() => setOpen(false)} className="block">
              My Orders
            </NavLink>
          )}

          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className="block"
          >
            Contact
          </NavLink>

          {/* ============================================
              BOUTON LOGIN / LOGOUT MOBILE
              Condition : Si user n'existe pas → Affiche bouton Login
                         Si user existe → Affiche bouton Logout
              ============================================ */}
          {!user ? (
            // Bouton Login - Ferme le menu et affiche la modale de connexion
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            // Bouton Logout - Déconnecte l'utilisateur
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
