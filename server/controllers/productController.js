import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";
/**
  Ce controller permet de gérer les produits dans la base de données 
  1 - Ajout de produit : /api/product/add
  2 - Affichage de la liste de produits : /api/product/list
  3 - Récupération d'un produit par son ID : /api/product/:id
  4 - Mettre a jour le stock d'un produit 
 */

// Fonction qui permet l'ajout de produit : /api/product/add : POST
export const addProduct = async (req, res) => {
  try {
    // récupérer les données du produit
    let productData = JSON.parse(req.body.productData);
    // récupérer les images du produit
    const images = req.files;
    // uploader les images sur cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        // uploader l'image sur cloudinary
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        // retourner l'url de l'image
        return result.secure_url;
      }),
    );
    // créer le produit dans la base de données
    await Product.create({ ...productData, image: imagesUrl });
    // retourner un message de succès
    res.status(200).json({ success: true, message: "Product Added" });
  } catch (error) {
    console.error("Error", error);
    // retourner un message d'erreur
    return res.status(500).json({ errorMessage: "Error for upload" });
  }
};

// Fonction qui permet d'afficher la liste de produits : /api/product/list : GET
export const producList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error", error);
    // retourner un message d'erreur
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Fonction qui permet de récupérer un prduit depuis son ID  : /api/product/id : GET 
export const productById = async (req, res) => {
  try {
    const { id } = req.body
    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
    
  } catch (error) {
    console.error("Error", error);
    // retourner un message d'erreur
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Fonction qui permet de modifier un produit : /api/product/stock : PUT
export const changeStock = async (req, res) => {
  try {
    const { id,inStock  } = req.body
    // modifier le stock du produit
    const product = await Product.findByIdAndUpdate(id, { inStock }, { new: true });
    // vérifier si le produit existe dans la base de données
    if(!product){
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    // retourner un message de succès
    res.status(200).json({ success: true, message: "Stock updated" });
  } catch (error) {
    // retourner un message d'erreur
    console.error("Error", error);
    return res.status(500).json({ success: false, message: "Error for update stock" });
  }
};
