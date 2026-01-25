import React from "react";
import { assets, features } from "../assets/assets";

/**
 * Composant BottomBanner
 * Affiche une bannière avec une image de fond et une liste des avantages/features de l'application
 * L'image change selon la taille d'écran (desktop vs mobile)
 * Le contenu est positionné en overlay sur l'image
 */
const BottomBanner = () => {
  return (
    <div className="relative mt-24">
      {/* Image de fond pour desktop (visible uniquement sur écrans >= md) */}
      <img
        src={assets.bottom_banner_image}
        alt="bottom_banner_image"
        className="w-full hidden md:block"
      />
      {/* Image de fond pour mobile (visible uniquement sur écrans < md) */}
      <img
        src={assets.bottom_banner_image_sm}
        alt="bottom_banner_image"
        className="w-full md:hidden"
      />
      
      {/* Contenu overlay positionné au-dessus de l'image */}
      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-8 pb-4 md:pt-0 md:pb-0 md:pr-12 lg:pr-24 px-4 md:px-0">
        {/* Titre de la section */}
        <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-4 md:mb-8 text-center md:text-right">
          Why We Are the Best?
        </h1>
        
        {/* Liste des features/avantages */}
        <div className="flex flex-col gap-3 md:gap-5 w-full md:w-auto max-w-xs md:max-w-none">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 md:gap-4">
              {/* Icône de la feature */}
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-9 h-9 md:w-11 md:h-11 flex-shrink-0"
              />
              {/* Contenu textuel de la feature */}
              <div className="flex flex-col min-w-0 flex-1">
                <div>
                  {/* Titre de la feature */}
                  <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-1">
                    {feature.title}
                  </h3>
                  {/* Description de la feature */}
                  <p className="text-xs md:text-base text-gray-500/70 break-words">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
