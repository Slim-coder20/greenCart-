import express from "express";
import { login, register } from "../controllers/userController.js";

// Initialisation du router //
const userRouter = express.Router()

// Routes // 
userRouter.post('/register', register)
userRouter.post('/login', login)




export default userRouter; 