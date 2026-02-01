import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";


/**
 * Composant réutilisable pour les champs de saisie du formulaire d'adresse
 * @param {string} type - Type du champ input (text, email, etc.)
 * @param {string} placeholder - Texte d'aide affiché dans le champ
 * @param {string} name - Nom du champ (correspond à la clé dans l'objet address)
 * @param {function} handleChange - Fonction appelée lors du changement de valeur
 * @param {object} address - Objet contenant toutes les valeurs des champs du formulaire
 */
const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);
/**
 * Page permettant d'ajouter une nouvelle adresse de livraison
 * Contient un formulaire avec tous les champs nécessaires pour une adresse complète
 */
const AddAddress = () => {

  const { axios, user, navigate } = useAppContext(); 
  /**
   * État qui stocke toutes les informations de l'adresse saisie par l'utilisateur
   */
  const [address, setAddress] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });


  /**
   * Fonction qui met à jour l'état address lorsqu'un champ du formulaire est modifié
   * @param {Event} e - Événement du changement de valeur dans un champ
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  /**
   * Fonction qui gère la soumission du formulaire
   * @param {Event} e - Événement de soumission du formulaire
   */
  const onSubmithandler = async (e) => {
    e.preventDefault();
    try {
      const addressData = {
        firstName: address.firstname,
        lastName: address.lastname,
        email: address.email,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: parseInt(address.zipcode, 10) || 0,
        phone: address.phone,
      };
      const { data } = await axios.post("/api/address/add", { address: addressData });
      if (data?.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data?.message || "Failed to add address");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add address");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user, navigate]);


  return (
    <div className="mt-16 pb-16">
      {/* Titre de la page */}
      <p className="text-2xl font-light md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        {/* Section formulaire */}
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmithandler} className="space-y-3 mt-6 text-sm">
            {/* Champs Prénom et Nom */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstname"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastname"
                type="text"
                placeholder="Last Name"
              />
            </div>
            
            {/* Champ Email */}
            <InputField
              handleChange={handleChange}
              address={address}
              name="email"
              type="text"
              placeholder="Email address"
            />
            
            {/* Champ Rue */}
            <InputField
              handleChange={handleChange}
              address={address}
              name="street"
              type="text"
              placeholder="Street"
            />

            {/* Champs État et Ville */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="state"
                type="text"
                placeholder="State"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="city"
                type="text"
                placeholder="City"
              />
            </div>
            
            {/* Champs Pays et Code postal */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="country"
                type="text"
                placeholder="Country"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="zipcode"
                type="text"
                placeholder="Zip Code"
              />
            </div>
            
            {/* Champ Téléphone */}
            <InputField
              handleChange={handleChange}
              address={address}
              name="phone"
              type="text"
              placeholder="Phone"
            />
            
            {/* Bouton de soumission */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase"
            >
              Save Address
            </button>
          </form>
        </div>
        
        {/* Image illustrative */}
        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_image}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
