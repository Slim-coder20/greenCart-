import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

/**
 * Composant BestSeller
 * Affiche les 5 meilleurs produits en stock sous forme de grille responsive
 * Les produits sont filtrés pour n'afficher que ceux disponibles (inStock === true)
 */
const BestSeller = () => {
  // Récupération de la liste des produits depuis le contexte
  const { products} = useAppContext();
  
  return (
    <div>
      {/* Titre de la section */}
      <p className="text-2xl md:text-3xl font-light mt-16 ml-1">Best Sellers </p>
      
      {/* Grille responsive des produits :
          - Mobile : 1 colonne
          - Small : 2 colonnes
          - Medium : 3 colonnes
          - Large : 4 colonnes
      */}
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-3 md:gap-16 lg:grid-cols-4 lg:gap-8 justify-items-center sm:justify-items-stretch mt-6">
        {products
          // Filtrer uniquement les produits en stock
          .filter((product) => product.inStock)
          // Prendre les 5 premiers produits
          .slice(0, 5)
          // Afficher chaque produit avec ProductCard
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
