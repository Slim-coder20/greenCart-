import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../context/AppContext";

/**
 * Composant Login
 * Modal de connexion/inscription avec deux modes :
 * - Login : connexion avec email et mot de passe
 * - Register : inscription avec nom, email et mot de passe
 * Utilise react-hook-form pour la gestion du formulaire et la validation
 */
const Login = () => {
  // Récupération des fonctions du contexte pour gérer l'utilisateur et la visibilité de la modale
  const { setShowUserLogin, setUser } = useAppContext();
  
  // État pour basculer entre le mode "login" et "register"
  const [state, setState] = useState("login");

  // Configuration du formulaire avec react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
  });

  /**
   * Fonction de soumission du formulaire
   * Enregistre l'utilisateur avec son email et son nom (ou "User" par défaut)
   * Ferme la modale après la soumission
   */
  const onSubmit = (data) => {
    setUser({
      email: data.email,
      name: data.name || "User",
    });
    setShowUserLogin(false);
  };

  /**
   * Fonction pour basculer entre le mode login et register
   * Réinitialise le formulaire lors du changement de mode
   */
  const toggleMode = () => {
    setState((prev) => (prev === "login" ? "register" : "login"));
    reset({ name: "", email: "", password: "" });
  };

  return (
    // Overlay sombre : clic pour fermer la modale
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      {/* Formulaire : stopPropagation pour éviter la fermeture au clic sur le formulaire */}
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(onSubmit)}
        className="sm:w-87.5 w-full text-center bg-white border border-gray-200 rounded-2xl px-8"
      >
        {/* Titre dynamique selon le mode (Login ou Sign up) */}
        <h1 className="text-gray- text-3xl mt-10 font-medium text-primary">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        {/* Sous-titre */}
        <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>

        {/* Champ nom : visible uniquement en mode register */}
        {state !== "login" && (
          <div className="w-full mt-6">
            <div className="flex items-center w-full bg-white border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
              {/* Icône utilisateur */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-gray-500"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <circle cx="12" cy="8" r="5" />{" "}
                <path d="M20 21a8 8 0 0 0-16 0" />{" "}
              </svg>
              {/* Input nom avec validation */}
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 border-none outline-none "
                {...register("name", { required: "Le nom est requis" })}
              />
            </div>
            {/* Message d'erreur pour le champ nom */}
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.name.message}</p>
            )}
          </div>
        )}

        {/* Champ email : visible dans les deux modes */}
        <div className="w-full mt-4">
          <div className="flex items-center w-full bg-white border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            {/* Icône email */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-gray-500"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />{" "}
              <rect x="2" y="4" width="20" height="16" rx="2" />{" "}
            </svg>
            {/* Input email avec validation */}
            <input
              type="email"
              placeholder="Email id"
              className="w-full bg-transparent text-gray-800 placeholder-gray-400 border-none outline-none "
              {...register("email", { required: "L'email est requis" })}
            />
          </div>
          {/* Message d'erreur pour le champ email */}
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Champ mot de passe : visible dans les deux modes */}
        <div className="w-full mt-4">
          <div className="flex items-center w-full bg-white border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            {/* Icône cadenas */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-gray-500"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />{" "}
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />{" "}
            </svg>
            {/* Input mot de passe avec validation */}
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent text-gray-800 placeholder-gray-400 border-none outline-none"
              {...register("password", { required: "Le mot de passe est requis" })}
            />
          </div>
          {/* Message d'erreur pour le champ mot de passe */}
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.password.message}</p>
          )}
        </div>

        {/* Lien "Mot de passe oublié" : visible uniquement en mode login */}
        <div className="mt-4 text-left">
          <button type="button" className="text-sm text-gray-400 hover:text-primary hover:underline transition-colors">
            Forget password?
          </button>
        </div>

        {/* Bouton de soumission : texte dynamique selon le mode */}
        <button
          type="submit"
          className="w-full h-11 rounded-full text-white bg-primary   hover:bg-primary-dull transition mt-2"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        {/* Lien pour basculer entre login et register */}
        <p
          onClick={toggleMode}
          className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span className="text-primary hover:underline ml-1">click here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
