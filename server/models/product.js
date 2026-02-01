import mongoose from "mongoose"; 

const productSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
  }, 
  description: {
    type: Array, 
    required: true, 
    
  },
  price: {
    type: Number,
    required: true, 
  },
  offerPrice: {
    type:Number,
    required: true, 
  },
  image: {
    type: Array,
    required: true,
  },
  category:{
    type:String,
    required: true, 
  },
  inStock:{
    type: Boolean,
    default: true, 
  }

}, {timestamps: true});

// Note: 'prodcut' est conservé pour la compatibilité avec la collection existante 'prodcuts'
const Product = mongoose.models.prodcut || mongoose.model("prodcut", productSchema);

export default Product 