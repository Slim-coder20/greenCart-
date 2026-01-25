import React from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  // Récupérer la config de la catégorie (titre, etc.) dont le path correspond au paramètre d’URL
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category,
  );
  // Filtrer les produits dont la catégorie correspond à celle de l’URL (insensible à la casse)
  const filteredProduct = products.filter(
    (product) => product.category.toLowerCase() === category,
  );

  return (
    <div className="mt-16">
      {/* Afficher le titre de la catégorie uniquement si elle existe dans la config */}
      {searchCategory && (
        <div className="flex flex-col items-end w-max ">
          <p className="text-2xl font-light">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}
      {/* Grille de produits si la catégorie en contient, sinon message "aucun produit" */}
      {filteredProduct.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-col-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 justify-items-center sm:justify-items-stretch">
          {filteredProduct.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-light text-primary">
            No product found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
