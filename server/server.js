import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMongo } from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudnary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRouter.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import contactRouter from "./routes/contactRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";

dotenv.config();

// Express app //
const app = express();

// Port // 
const port = process.env.PORT || 3000 ;

// Connect to MongoDB // 
await connectMongo();

// Connect to Cloudinary // 
await connectCloudinary();



const allowedOrigins = ["http://localhost:5173"]

// Webhook pour Stripe // 
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware configuration initialisation /
// Création d'un objet cors avec les origines autorisés et le cookie parser pour les cookies//
app.use(cors({ origin: allowedOrigins, credentials: true })); 
app.use(express.json());
app.use(cookieParser()); 


// Routes //  
// Réponse de la route racine //
app.get("/", (req, res) => {
  res.send("FoodStore API is running 🚀");
});
app.use('/api/user', userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/contact', contactRouter)

//=====//
// Server 
//=====//
// Démarrage du serveur //
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port} 🚀`);
})
