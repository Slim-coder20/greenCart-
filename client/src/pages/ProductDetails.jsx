import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

/** Page détail d’un produit : galerie, infos, prix, description, Add to Cart / Buy now. */
const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [relatedProduct, setrelatedProduct] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  // Produits de la même catégorie (hors produit actuel), max 5 — pour une éventuelle section « Recommandations »
  useEffect(() => {
    if (products?.length > 0 && product) {
      const filtered = products.filter(
        (item) => product.category === item.category && item._id !== id
      );
      setrelatedProduct(filtered.slice(0, 5));
    }
  }, [products, product, id]);

  // Image principale : initialiser avec la première image du produit au chargement
  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
  }, [product]);

  return (
    product && (
      <div className="max-w-6xl w-full px-6 mt-16">
        {/* Fil d’Ariane : Home > products > catégorie > nom du produit */}
        <p>
          <Link to={"/"} className="hover:text-primary-dull">
            Home
          </Link>{" "}
          /
          <Link to={"/products"} className="hover:text-primary-dull">
            {" "}
            products
          </Link>{" "}
          /
          <Link
            to={`/products/${product.category.toLowerCase()}`}
            className="hover:text-primary-dull"
          >
            {" "}
            {product.category}
          </Link>{" "}
          /<span className="text-primary"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          {/* Galerie : miniatures cliquables + image principale (thumbnail = image affichée en grand) */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img
                src={thumbnail}
                alt="Selected product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Infos produit : nom, notation, prix, description, actions */}
          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-3xl font-medium text-primary">
              {product.name}
            </h1>

            {/* Notation : 5 étoiles (pleines si i < 4, sinon grisées) */}
            <div className="flex items-center gap-0.5 mt-1">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="star_icon"
                    className="md:w-4 w-3.5"
                  />
                ))}
              <p className="text-base ml-2 ">(4)</p>
            </div>

            {/* Prix : ancien prix barré + prix promo */}
            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: {currency}
                {product.price}
              </p>
              <p className="text-2xl font-medium">
                MRP: {currency}
                {product.offerPrice}
              </p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <p className="text-base font-medium mt-6">About product</p>
            {/* Liste des points de description du produit */}
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            {/* Add to Cart : ajoute au panier ; Buy now : ajoute + redirige vers /cart */}
            <div className="flex items-center mt-10 gap-4 text-base">
              <button
                onClick={() => addToCart(product._id)}
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product._id);
                  navigate("/cart");
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        {/* Affichage des Produits similaires */}
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-max ">
            <p className="text-3xl font-light ">Related Products</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12 mt-10 w-full max-w-6xl justify-items-center">
            {relatedProduct
              .filter((product) => product.inStock)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition "
          >
            See More
          </button>
        </div>
      </div>
    )
  );
};

export default ProductDetails;
