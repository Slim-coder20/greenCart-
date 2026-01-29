import express from "express";
import { updateCart } from "../controllers/cartController.js";
import { authUser } from "../middlewares/authUser.js";

// Initialisation du routeur // 

const cartRouter = express.Router()

// Routes // 
cartRouter.post('/update', authUser, updateCart); 

export default cartRouter; 