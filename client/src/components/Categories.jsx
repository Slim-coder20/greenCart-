import React from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

/**
 * Composant Categories
 * Affiche une grille de catégories de produits avec leurs images et noms
 * Chaque catégorie est cliquable et redirige vers la page des produits de cette catégorie
 * Le nombre de colonnes s'adapte selon la taille d'écran
 */
const Categories = () => {
  // Récupération de la fonction de navigation depuis le contexte
  const { navigate } = useAppContext();
  
  return (
    <div className="mt-16 px-4 sm:px-0">
      {/* Titre de la section */}
      <p className="text-2xl md:text-3xl font-light">Categories</p>
      
      {/* Grille responsive des catégories :
          - Mobile : 2 colonnes
          - Small : 3 colonnes
          - Medium : 5 colonnes
          - Large : 6 colonnes
          - Extra Large : 7 colonnes
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-3 sm:gap-4 md:gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer py-4 sm:py-5 px-2 sm:px-3 gap-2 rounded-lg flex flex-col justify-center items-center overflow-hidden"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              // Navigation vers la page des produits de la catégorie sélectionnée
              navigate(`/products/${category.path.toLowerCase()}`);
              // Scroll vers le haut de la page
              scrollTo(0,0)
            }}
          >
            {/* Image de la catégorie avec effet de zoom au survol */}
            <img
              src={category.image}
              alt={category.text}
              className="group-hover:scale-105 transition w-full max-w-[80px] sm:max-w-24 md:max-w-28 h-auto object-contain"
            />
            {/* Nom de la catégorie */}
            <p className="text-xs sm:text-sm font-medium text-center">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
