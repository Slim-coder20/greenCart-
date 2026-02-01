import express from "express";
import { contact } from "../controllers/contactController.js";

const contactRouter = express.Router();

// Route : envoi du formulaire de contact (pas d'authentification requise)
contactRouter.post("/", contact);

export default contactRouter;
