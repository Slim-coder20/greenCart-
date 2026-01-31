import { useState, useEffect } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

/**
 * Composant AddProduct
 * Formulaire d'ajout de produit pour le dashboard vendeur.
 *
 * Champs gérés :
 * - Images produit (jusqu'à 4)
 * - Nom du produit
 * - Description
 * - Catégorie (liste depuis assets)
 * - Prix et prix promotionnel
 */
const AddProduct = () => {
  /**
   * États du formulaire
   * - files : tableau des 4 fichiers image (File ou undefined)
   * - name, description, category, price, offerPrice : valeurs des champs texte / select
   */
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  // Ajout de l'appContext pour appel API via Axios //
  const { axios } = useAppContext();

  /**
   * URLs d’aperçu des images (blob URLs)
   * Créées à partir de files, révoquées au démontage ou quand files change
   * pour éviter les fuites mémoire.
   */
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const urls = files.map((f) => (f ? URL.createObjectURL(f) : null));
    setImageUrls(urls);
    return () => {
      urls.forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [files]);

  /**
   * Soumission du formulaire
   * - Empêche le rechargement (preventDefault)
   * - Convertit price et offerPrice en Number pour l’envoi
   * - Prépare l’objet produit (à envoyer vers l’API ou le contexte)
   */
  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      // récupération des champs du formulaire d'ajout de produit depuis l'espace Seller //
      const productData = {
        name,
        description: description.split("\n").filter(Boolean),
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
      };
      // On stock le nouveau produit via l'objet FormData //
      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      // ajout des images au formData (uniquement les fichiers valides) //
      files.filter(Boolean).forEach((file) => formData.append("images", file));
      // Envoie des données au serveur //
      const { data } = await axios.post("/api/product/add", formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Si une erreur survient, on affiche un message d'erreur //
      toast.error("Error for adding product");
    }
  };

  return (
    <div className="no-scrollbar min-h-full overflow-y-auto flex flex-col px-4 md:px-8 py-6">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        {/* 
            SECTION IMAGES PRODUIT (4 emplacements)
            
            Chaque zone : input file masqué + image de prévisualisation ou placeholder.
            Clic sur l'image = ouverture du sélecteur de fichiers (label htmlFor).
        */}
        <div>
          <p className="text-base font-light">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setFiles((prev) => {
                        const next = [...prev];
                        next[index] = file;
                        return next;
                      });
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  {/* Aperçu via imageUrls (révoquées au démontage / changement de files) */}
                  <img
                    className="max-w-24 cursor-pointer"
                    src={imageUrls[index] ?? assets.upload_area}
                    alt="uploadArea"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Champ nom du produit */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-light" htmlFor="product-name">
            Product Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Champ description du produit */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-light" htmlFor="product-description">
            Product Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>

        {/* Sélecteur de catégorie (options depuis assets/categories) */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-light" htmlFor="category">
            Category
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            id="category"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={item.path} value={item.path}>
                {item.text}
              </option>
            ))}
          </select>
        </div>

        {/* Prix et prix promotionnel (côte à côte) */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-light" htmlFor="product-price">
              Product Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-light" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        {/* Bouton de soumission : ajout du produit */}
        <button
          type="submit"
          className="px-8 py-2.5 bg-primary hover:bg-primary-dull text-white font-light-medium rounded cursor-pointer"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
