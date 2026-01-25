import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

/**
 * Composant NewsLetter
 * Formulaire d'inscription à la newsletter permettant aux utilisateurs
 * de s'abonner pour recevoir les dernières offres et promotions
 * Utilise react-hook-form pour la gestion du formulaire et react-hot-toast pour les notifications
 */
const NewsLetter = () => {
  // Configuration du formulaire avec react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  /**
   * Fonction de soumission du formulaire
   * Affiche un message de succès et réinitialise le formulaire
   * @param {Object} data - Les données du formulaire (email)
   */
  const onSubmit = (data) => {
    console.log("Newsletter:", data);
    toast.success("Thank you, you have been subscribed successfully.");
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
      {/* Titre de la section newsletter */}
      <h1 className="md:text-4xl text-2xl font-light mt-4">
        Never Miss a Deal!
      </h1>
      
      {/* Description de la newsletter */}
      <p className="md:text-lg text-gray-500/70 pb-8">
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </p>
      
      {/* Formulaire d'inscription */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        {/* Champ email avec validation */}
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500 mb-10"
          type="text"
          placeholder="Enter your email id"
          {...register("email", { required: "Email is required" })}
        />
        {/* Message d'erreur pour le champ email */}
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 text-left pl-1">
            {errors.email.message}
          </p>
        )}
        
        {/* Bouton de soumission */}
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none mb-10"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
