import React from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/NewsLetter";

/**
 * Page Home
 * Page d'accueil de l'application qui affiche les différents composants dans l'ordre :
 * 1. MainBanner : Bannière principale avec titre et boutons d'action
 * 2. Categories : Grille des catégories de produits
 * 3. BestSeller : Section des meilleures ventes (top 5 produits)
 * 4. BottomBanner : Bannière avec les avantages de l'application
 * 5. NewsLetter : Formulaire d'inscription à la newsletter
 */
const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <NewsLetter />
    </div>
  );
};

export default Home;
