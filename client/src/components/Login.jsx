import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { setShowUserLogin, setUser } = useAppContext();
  const [state, setState] = useState("login");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (data) => {
    setUser({
      email: data.email,
      name: data.name || "User",
    });
    setShowUserLogin(false);
  };

  const toggleMode = () => {
    setState((prev) => (prev === "login" ? "register" : "login"));
    reset({ name: "", email: "", password: "" });
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(onSubmit)}
        className="sm:w-87.5 w-full text-center bg-white border border-gray-200 rounded-2xl px-8"
      >
        <h1 className="text-gray- text-3xl mt-10 font-medium text-primary">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>

        {state !== "login" && (
          <div className="w-full mt-6">
            <div className="flex items-center w-full bg-white border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
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
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 border-none outline-none "
                {...register("name", { required: "Le nom est requis" })}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.name.message}</p>
            )}
          </div>
        )}

        <div className="w-full mt-4">
          <div className="flex items-center w-full bg-white border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
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
            <input
              type="email"
              placeholder="Email id"
              className="w-full bg-transparent text-gray-800 placeholder-gray-400 border-none outline-none "
              {...register("email", { required: "L'email est requis" })}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.email.message}</p>
          )}
        </div>

        <div className="w-full mt-4">
          <div className="flex items-center w-full bg-white border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
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
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent text-gray-800 placeholder-gray-400 border-none outline-none"
              {...register("password", { required: "Le mot de passe est requis" })}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.password.message}</p>
          )}
        </div>

        <div className="mt-4 text-left">
          <button type="button" className="text-sm text-gray-400 hover:text-primary hover:underline transition-colors">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-full text-white bg-primary   hover:bg-primary-dull transition mt-2"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

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
