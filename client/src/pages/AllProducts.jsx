import React from "react";
import { useAppContext } from "../context/AppContext";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

function AllProducts() {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filtrage des produits selon la recherche : recalculer à chaque changement de products ou searchQuery
  useEffect(() => {
    if (searchQuery.length === 0) {
      // Recherche vide → afficher tous les produits
      setFilteredProducts(products);
    } else {
      // Recherche non vide → ne garder que les produits dont le nom contient la requête (insensible à la casse)
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [products, searchQuery]);

  return (
    <div className="mt-16 flex flex-col ">
      {/* En-tête de section avec titre et soulignement */}
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-light uppercase ">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      {/* Grille responsive : afficher uniquement les produits en stock parmi les résultats filtrés */}
      <div className="grid grid-cols-1 sm:grid-col-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 justify-items-center sm:justify-items-stretch">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
}

export default AllProducts;
