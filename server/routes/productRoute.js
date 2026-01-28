import express from "express";
import {
  addProduct,
  changeStock,
  producList,
  productById,
} from "../controllers/productController.js";
import { upload } from "../configs/multer.js";
import {authSeller } from "../middlewares/authSeller.js";

// Initialisation du router //
const productRouter = express.Router();

// Routes //
productRouter.post("/add", upload.array("images"), authSeller, addProduct);
productRouter.get("/list", producList);
productRouter.get("/id", productById);
productRouter.post("/stock", authSeller, changeStock);


export default productRouter; 