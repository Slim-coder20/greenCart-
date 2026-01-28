import { v2 as cloudinary } from 'cloudinary';

// Configuration de cloudinary pour le stockage des images sur le cloud
const connectCloudinary = async () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
}
// Exportation de la fonction connectCloudinary
export default connectCloudinary; 