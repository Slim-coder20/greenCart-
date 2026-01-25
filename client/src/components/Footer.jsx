import React from "react";
import { assets, footerLinks } from "../assets/assets";

/**
 * Composant Footer
 * Affiche le pied de page de l'application avec :
 * - Le logo et une description de l'entreprise
 * - Des liens organisés par sections (footerLinks)
 * - Le copyright avec l'année dynamique
 */
const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/15 mt-24">
      {/* Section principale du footer */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        {/* Colonne gauche : Logo et description */}
        <div>
          <img className="w-40 md:w-44 h-auto" src={assets.logo} alt="logo" />
          <p className="max-w-[410px] mt-6">
            We deliver fresh groceries and thounsands, we aim to make your
            shopping experience simple and affordable.
          </p>
        </div>
        
        {/* Colonne droite : Liens organisés par sections */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footerLinks.map((section, index) => (
            <div key={index}>
              {/* Titre de la section de liens */}
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              {/* Liste des liens de la section */}
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="hover:underline transition">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Copyright avec année dynamique */}
      <p className="py-4 text-center text-sm md:text-base font-light text-gray-500/80">
        Copyright {new Date().getFullYear()} © <a href="/contact">FoodStore</a> All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
