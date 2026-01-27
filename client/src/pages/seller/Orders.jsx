import React from 'react'
import { useAppContext } from "../../context/AppContext";
import { useState, useEffect } from "react";
import { dummyOrders, assets } from "../../assets/assets"; 
const Orders = () => {
  // Récupération du currency du contexte //
  const { currency } = useAppContext();
  // État pour stocker les commandes //
  const [orders, setOrders] = useState([]);

  // Création d'une fonction qui va récupérer les commandes dans l'espace Seller //
  const fetchOrders = async () => {
    // Récupération des commandes dans l'espace Seller //
    setOrders(dummyOrders);
  };

  // useEffect va nous permettre d'executer la fonction fetchOrders au chargement de la page //
  useEffect(() => {
    fetchOrders();
  }, []);

  // Rendu du composant Orders //
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-semibold text-primary">Orders List</h2>
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
          >
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex flex-col ">
                    <p className="font-medium">
                      {item.product.name}{" "}
                      <span className="text-primary m-0.5">
                        x {item.quantity}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm md:text-base text-black/60">
              <p className="text-black/80">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city}
              </p>
              <p>
                {order.address.state},{order.address.zipcode}
                {order.address.country}
              </p>
              <p>{order.address.phone}</p>
            </div>

            <p className="font-medium text-base my-auto text-black/70 ml-10">
              {currency}
              {order.amount}
            </p>

            <div className="flex flex-col text-sm">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
              <p>Status: {order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders