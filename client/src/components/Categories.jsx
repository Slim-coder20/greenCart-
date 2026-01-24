import React from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();
  return (
    <div className="mt-16 px-4 sm:px-0">
      <p className="text-2xl md:text-3xl font-light">Categories</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-3 sm:gap-4 md:gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer py-4 sm:py-5 px-2 sm:px-3 gap-2 rounded-lg flex flex-col justify-center items-center overflow-hidden"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0,0)
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="group-hover:scale-105 transition w-full max-w-[80px] sm:max-w-24 md:max-w-28 h-auto object-contain"
            />
            <p className="text-xs sm:text-sm font-medium text-center">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
