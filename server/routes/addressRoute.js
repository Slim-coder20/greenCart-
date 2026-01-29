import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { addAddress, getAddress } from "../controllers/addressController.js";

// Initialisation du routeur //
const addressRouter = express.Router();

// Route //
addressRouter.post("/add", authUser, addAddress);
addressRouter.get("/get", authUser, getAddress);

export default addressRouter;
