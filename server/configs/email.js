/**
 * Configuration d'envoie de mail avec la librairie Nodemailer 
 * Ce fichier centralise la configuration des envoies de mail dans toute l'application 
 * Utilisation dans toutes les routes API 
 */

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 

// Création du transporteur // 
// Configuration fléxible pour développement et production // 
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default transporter;

