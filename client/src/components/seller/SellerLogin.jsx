import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios} = useAppContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",  
      password: "",
    },
  });

  // Soumission du formulaire //
  const onSubmit = async (data) => {
    try {
      // Envoi des données au serveur //
      const response = await axios.post("/api/seller/login", {
        email: data.email.trim(),
        password: data.password
      });
      if(response.data.success){
        // Si la connexion est réussie, on redirige vers le dashboard seller //
        setIsSeller(true); 
        toast.success(response.data.message);
        reset();
        navigate("/seller");
      } else {
        // Si la connexion échoue, on affiche un message d'erreur //
        toast.error(response.data.message || "Identifiants invalides");
        reset();
      }
    
    } catch (error) {
      // Si une erreur survient, on affiche un message d'erreur //
      toast.error("Une erreur est survenue");
      reset();
    }
  };

  return (
    !isSeller && (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white p-10"
        >
          <h1 className="text-gray-600 text-3xl mt-10 font-light">
            <span className="text-3xl font-semibold text-primary m-1">Seller</span>
            Login
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-light">
            Please sign in to continue
          </p>
          <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mail-icon lucide-mail"
            >
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="border-none font-light ring-0 outline-none cursor-pointer"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 text-left pl-1">
              {errors.email.message}
            </p>
          )}
          <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-lock-icon lucide-lock"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="border-none outline-none ring-0 cursor-pointer"
              {...register("password", { required: "Password is required" })}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 text-left pl-1">
              {errors.password.message}
            </p>
          )}
          <button
            // onClick={() => navigate("/seller")}
            className="mt-6 w-full h-11 rounded-full text-white bg-primary hover:bg-primary-dull transition-opacity cursor-pointer"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    )
  );
};

export default SellerLogin;
