import React from "react";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { dummyOrders } from "../assets/assets";

/**
 * Composant MyOrders
 * Affiche la liste de toutes les commandes de l'utilisateur avec leurs détails
 */
const MyOrders = () => {
  /**
   * État qui stocke la liste des commandes de l'utilisateur
   */
  const [myOrders, setMyOrders] = useState([]);
  
  /**
   * Récupération de la devise depuis le contexte
   */
  const { currency } = useAppContext();

  /**
   * Fonction qui récupère les commandes depuis les données mockées
   * Pour l'instant, utilise dummyOrders, mais pourra être remplacée par un appel API
   */
  const fetchMyOrders = async () => {
    setMyOrders(dummyOrders);
  };

  /**
   * useEffect qui charge les commandes au montage du composant
   */
  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="mt-16 pb-16">
      {/* En-tête de la page */}
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-ligth uppercase">My orders </p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      
      {/* Liste des commandes */}
      {myOrders.map((order, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          {/* Informations générales de la commande */}
          <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col ">
            <span className="text-sm font-light">OrderId: {order._id}</span>
            <span className="text-sm font-light">
              Payment: {order.paymentType}
            </span>
            <span>
              Total Amount: {currency}
              {order.amount}
            </span>
          </p>
          
          {/* Liste des articles de la commande */}
          {order.items.map((item, index) => (
            <div 
              key={index}
              className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-betweenp-4 py-5 md:gap-48 w-full max-w-4xl`}
            >
              {/* Informations du produit */}
              <div className="flex items-center mb-4 md:mb-0">
                {/* Image du produit */}
                <div className=" border border-gray-400 p-2 rounded-full mt-2 bg-primary/10">
                  <img
                    src={item.product.image[0]}
                    alt="product"
                    className="w-16 h-16 "
                  />
                </div>
                {/* Nom et catégorie du produit */}
                <div>
                  <div className="ml-4">
                    <h2 className="text-sm font-light  text-gray-800">
                      {item.product.name}
                    </h2>
                    <p className="text-sm font-light  text-gray-800">
                      Category: {item.product.category}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Détails de la commande (quantité, statut, date) */}
              <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                <p>Quantity: {item.quantity || "1"}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              
              {/* Montant total pour cet article */}
              <p className="text-primary text-sm font-light">
                Amount: {currency}
                {item.product.offerPrice * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
