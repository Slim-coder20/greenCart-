import React from 'react'
import { assets } from '../assets/assets'; 
import { Link } from "react-router-dom"; 

/**
 * Composant MainBanner
 * Affiche la bannière principale de la page d'accueil avec :
 * - Une image de fond responsive (différente selon la taille d'écran)
 * - Un titre accrocheur
 * - Des boutons d'action (Shop now / Explore deals) qui redirigent vers la page des produits
 */
const MainBanner = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Image de fond pour desktop (visible uniquement sur écrans >= md) */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full hidden md:block"
      />
      {/* Image de fond pour mobile (visible uniquement sur écrans < md) */}
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full h-auto md:hidden object-cover"
      />
      
      {/* Contenu overlay positionné au-dessus de l'image */}
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-16 lg:pl-24">
        {/* Titre principal de la bannière */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-[280px] sm:max-w-72 md:max-w-80 lg:max-w-[420px] leading-tight lg:leading-[1.2]">
          Freshness You can trust, Saving You will Love!
        </h1>

        {/* Boutons d'action */}
        <div className=" flex items-center mt-6 font-medium">
          {/* Bouton principal "Shop now" : visible sur tous les écrans */}
          <Link
            to={"/products"}
            className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer"
          >
            Shop now
            {/* Icône flèche blanche : visible uniquement sur mobile */}
            <img
              className="md:hidden transition group-focus:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>
          {/* Bouton secondaire "Explore deals" : visible uniquement sur desktop */}
          <Link
            to={"/products"}
            className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer"
          >
            Explore deals
            {/* Icône flèche noire avec animation au survol */}
            <img
              className="transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MainBanner