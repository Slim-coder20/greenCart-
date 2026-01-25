import { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

/**
 * Composant ProductCard
 * Affiche une carte produit avec :
 * - Image du produit avec effet de zoom au survol
 * - Catégorie, nom et notation par étoiles
 * - Prix (avec prix barré et prix promotionnel)
 * - Bouton d'ajout au panier ou contrôleur de quantité (+/-)
 * 
 * @param {Object} product - L'objet produit à afficher
 */
const ProductCard = ({ product }) => {
  // Récupération des fonctions et états du contexte pour la gestion du panier et la navigation
  const { currency, addToCart, removeFromCart, cartItems, navigate } =
    useAppContext();

  return (
    product && (
      /* Carte produit : clic sur la carte entière → navigation vers la page de détail du produit */
      <div
        onClick={() => {
          navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full"
      >
        {/* Image produit avec effet de zoom au survol */}
        <div className="group cursor-pointer flex items-center justify-center px-2">
          <img
            className="group-hover:scale-105 transition max-w-26 md:max-w-36"
            src={product.image[0]}
            alt={product.name}
          />
        </div>
        
        {/* Informations du produit : catégorie, nom et notation */}
        <div className="text-gray-500/60 text-sm">
          {/* Catégorie du produit */}
          <p>{product.category}</p>
          
          {/* Nom du produit (tronqué si trop long) */}
          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.name}
          </p>
          
          {/* Notation par étoiles : affiche des étoiles pleines jusqu'à product.rating, puis des étoiles vides */}
          <div className="flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) =>
                i < product.rating ? (
                  <img
                    key={i}
                    src={assets.star_icon}
                    alt="star"
                    className="md:w-3.5 w-3"
                  />
                ) : (
                  <img
                    key={i}
                    src={assets.star_dull_icon}
                    alt="star"
                    className="md:w-3.5 w-3"
                  />
                ),
              )}
            <p>(4)</p>
          </div>
          
          {/* Section prix et gestion du panier */}
          <div className="flex items-end justify-between mt-3">
            {/* Prix : prix promotionnel en évidence + ancien prix barré */}
            <p className="md:text-xl text-base font-medium text-primary">
              {currency}{product.offerPrice}{" "}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                {currency}{product.price}
              </span>
            </p>
            
            {/* Zone de gestion du panier : stopPropagation pour éviter la navigation au clic */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-primary"
            >
              {!cartItems[product._id] ? (
                /* Produit non dans le panier : afficher le bouton "Add" */
                <button
                  className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded text-primary cursor-pointer"
                  onClick={() => addToCart(product._id)}
                >
                  <img src={assets.cart_icon} alt="cart_icon" />
                  Add
                </button>
              ) : (
                /* Produit déjà dans le panier : afficher le contrôleur de quantité avec boutons +/- */
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                  {/* Bouton pour diminuer la quantité */}
                  <button
                    onClick={() => {
                      removeFromCart(product._id);
                    }}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  {/* Quantité actuelle dans le panier */}
                  <span className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>
                  {/* Bouton pour augmenter la quantité */}
                  <button
                    onClick={() => {
                      addToCart(product._id);
                    }}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
