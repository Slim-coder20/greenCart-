import React from "react";
import { Navbar } from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast"
const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");

  return (
    <div className="w-full min-h-screen">
      {/* Utilisation d'une condition ternaire pour l'affichage de la navbar seller / user  */}
      {isSellerPath ? null : <Navbar />}
      <Toaster/>
      <div
        className={`w-full ${isSellerPath ? "" : "md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
