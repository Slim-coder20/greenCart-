import express from "express"; 
import {sellerLogin, isSellerAuth, sellerLogout } from "../controllers/sellerController.js"; 
import { authSeller } from "../middlewares/authSeller.js"; 

// Initialisation du router //
const sellerRouter = express.Router()


// Routes // 
sellerRouter.post('/login', sellerLogin); 
sellerRouter.get("/logout", authSeller, sellerLogout);
sellerRouter.get("/is-auth", isSellerAuth)


export default sellerRouter; 