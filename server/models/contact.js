import mongoose from "mongoose"; 

// Création du Schema pour le formulaire de contact // 
const contactSchema = new mongoose.Schema({

fullName: {
  type: String, 
  required: true
}, 
email: {
  type: String, 
  required: true, 
},
content: {
  type: String,
  required: true
},
date: {
  type: Date, 
  default: Date.now,
}

});

// Création et exportation du modèle
const Contact = mongoose.model("Contact", contactSchema);

// export 
module.exports = Contact;