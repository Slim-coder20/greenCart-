import express from "express";
import { register } from "../controllers/userController.js";

// Initialisation du router //
const userRouter = express.Router()

// Routes // 
userRouter.post('/register', register)




export default userRouter; 