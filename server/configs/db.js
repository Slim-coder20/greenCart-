import mongoose from "mongoose"; 

// Connexion a mongodb // 
export const connectMongo = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/foodstore`);
    console.log('Connected to MongoDB succefully')
    
  } catch (error) {
    console.error('Error connecting to MongoDB', error); 
    process.exit(1); 
  }
}