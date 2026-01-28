import multer from "multer";

// Configuration de multer pour le stockage des images sur le disque
export const upload = multer({storage: multer.diskStorage({})})