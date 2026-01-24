import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {

  const { products } = useAppContext();
  return (
    <div >
      <p className="text-2xl md:text-3xl font-light mt-16 ml-1">Best Sellers </p>
      <div className= "grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-3 md:gap-16 lg:grid-cols-4 lg:gap-8 justify-items-center sm:justify-items-stretch mt-6">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
