import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { Link, NavLink, Outlet } from "react-router-dom";

/**
 * Composant SellerLayout
 * Layout principal pour l'interface vendeur (Seller Dashboard)
 * 
 * Structure :
 * - Header : Logo + message d'accueil + bouton de déconnexion
 * - Sidebar : Menu de navigation vertical avec les liens vers les différentes sections
 * - Outlet : Zone de contenu pour afficher les routes enfants (Add Product, Product List, Orders)
 */
const SellerLayout = () => {
  // Récupération de la fonction setIsSeller depuis le context global de l'application
  // Permet de gérer l'état de connexion du vendeur
  const { setIsSeller } = useAppContext();

  /**
   * Configuration des liens de navigation de la sidebar
   * Chaque lien contient :
   * - name : Nom affiché dans le menu
   * - path : Route vers laquelle rediriger
   * - icon : Icône associée au lien
   */
  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product list",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  /**
   * Fonction de déconnexion du dashboard Seller
   * Réinitialise l'état isSeller à false pour déconnecter le vendeur
   * et le rediriger vers la page de connexion
   */
  const logout = async () => {
    setIsSeller(false);
  };

  return (
    <>
      {/* ============================================
          HEADER - Barre de navigation supérieure
          ============================================ */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        {/* Logo cliquable qui redirige vers la page d'accueil */}
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className="cursor-pointer w-34 md:w-38"
          />
        </Link>
        
        {/* Section droite du header : Message d'accueil + Bouton de déconnexion */}
        <div className="flex items-center gap-5 text-gray-500">
          <p className="text-2xl font-light text-primary">Hi! Seller</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1 cursor-pointer "
          >
            Logout
          </button>
        </div>
      </div>

      {/* ============================================
          CONTENEUR PRINCIPAL - Flex horizontal
          Sidebar à gauche + zone de contenu (Outlet) à droite
          ============================================ */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* ============================================
            SIDEBAR - Menu de navigation vertical
            ============================================
            - Largeur responsive : 64 (256px) sur desktop, 16 (64px) sur mobile
            - min-h pour prendre toute la hauteur disponible
            - Bordure droite pour séparer du contenu principal
            - Flex-col pour empiler les liens verticalement
        */}
        <div className="md:w-64 w-16 border-r min-h-[calc(100vh-4rem)] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300 shrink-0">
          {/* Mapping des liens de navigation */}
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              // end={true} pour "/seller" permet une correspondance exacte
              // Évite que "/seller/product-list" active aussi "/seller"
              end={item.path === "/seller"}
              /**
               * Styles conditionnels basés sur l'état actif du lien
               * - Si actif : bordure droite primary, fond primary/10, texte primary
               * - Si inactif : fond gris au survol, bordure blanche
               */
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${
                              isActive
                                ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                : "hover:bg-gray-100/90 border-white "
                            }`}
            >
              {/* Icône du lien de navigation */}
              <img src={item.icon} alt="" className="w-7 h-7" />
              
              {/* Texte du lien - Masqué sur mobile (w-16), visible sur desktop (md:w-64) */}
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* ============================================
            OUTLET - Zone de contenu pour les routes enfants
            Doit être DANS le flex pour apparaître à droite de la sidebar,
            pas en dessous. flex-1 pour occuper l'espace restant.
            ============================================ */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SellerLayout;
