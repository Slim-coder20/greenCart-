import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { dummyAddress, assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    currency,
    cartItems,
    products,
    setCartItems,
  } = useAppContext();

  const navigate = useNavigate();
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState(dummyAddress);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]);
  const [payementOption, setPayementOption] = useState("COD");

  /**
   * Fonction getCart
   * Construit un tableau des produits du panier avec leurs quantités
   * à partir de l'objet cartItems
   */
  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        product.quantity = cartItems[key];
        tempArray.push(product);
      }
    }
    setCartArray(tempArray);
  };

  /**
   * Fonction getCartCount
   * Calcule et retourne le nombre total d'articles dans le panier
   */
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  /**
   * Fonction getCartAmount
   * Calcule et retourne le montant total du panier en utilisant les prix promotionnels
   */
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  /**
   * Fonction updateCartItemQuantity
   * Met à jour la quantité d'un produit dans le panier
   */
  const updateCartItemQuantity = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity > 0) {
      cartData[itemId] = quantity;
      setCartItems(cartData);
      toast.success("Cart Updated");
    }
  };

  /**
   * Fonction removeFromCart
   * Supprime un produit du panier
   */
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      delete cartData[itemId];
      setCartItems(cartData);
      toast.success("Removed from Cart");
    }
  };

  /**
   * Fonction placeOrder
   * Valide et place la commande avec les informations sélectionnées
   */
  const placeOrder = async () => {
    // Vérification que le panier n'est pas vide
    if (cartArray.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Vérification qu'une adresse est sélectionnée
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      // Calcul du montant total avec taxes
      const subtotal = getCartAmount();
      const tax = (subtotal * 2) / 100;
      const totalAmount = subtotal + tax;

      // Préparation des données de la commande
      const orderData = {
        items: cartArray.map((product) => ({
          product: product,
          quantity: product.quantity,
        })),
        amount: totalAmount,
        address: selectedAddress,
        paymentType: payementOption,
        isPaid: payementOption === "Online",
        status: "Order Placed",
        createdAt: new Date().toISOString(),
      };

      // Ici, on pourrait faire un appel API pour sauvegarder la commande
      // await fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) });

      // Pour l'instant, on simule juste le succès
      toast.success(
        payementOption === "COD"
          ? "Order placed successfully! You will pay on delivery."
          : "Redirecting to payment..."
      );

      // Vider le panier après la commande
      setCartItems({});
      
      // Rediriger vers la page d'accueil ou la page de confirmation
      setTimeout(() => {
        navigate("/");
        scrollTo(0, 0);
      }, 2000);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Error placing order:", error);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-light mb-6 text-black">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()}Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left text-primary">Product Details</p>
          <p className="text-center text-primary">Subtotal</p>
          <p className="text-center text-primary">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`,
                  );
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) =>
                        updateCartItemQuantity(
                          product._id,
                          Number(e.target.value),
                        )
                      }
                      value={cartItems[product._id]}
                      className="outline-none"
                    >
                      {Array(
                        cartItems[product._id] > 9 ? cartItems[product._id] : 9,
                      )
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary hover:text-primary-dull font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      {/* La section order Summary  */}

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>
            {/* Section adresee et saisie de l'adresse  */}
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {addresses.map((address, index) => (
                  <p
                    key={address._id || index}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {address.street}, {address.city}, {address.state}, {address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>
          {/* Section  paiement  */}

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          {/* Methode de paiement  */}
          <select
            onChange={(e) => setPayementOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>
              {currency}
              {getCartAmount()}
            </span>
            <span>Price</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 2) / 100}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {getCartAmount() + (getCartAmount() * 2) / 100}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
        >
          {payementOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;
