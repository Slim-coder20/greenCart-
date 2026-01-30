import express from "express";
import { authSeller } from "../middlewares/authSeller.js";
import { authUser } from "../middlewares/authUser.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrderCod,
} from "../controllers/orderController.js";

// Initialisation du router //
const orderRouter = express.Router();

// Routes //
orderRouter.post("/cod", authUser, placeOrderCod);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);

export default orderRouter;
