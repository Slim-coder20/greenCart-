import transporter from "../configs/email.js";
import Contact from "../models/contact.js";

// Création de fonction pour l'envoie d'email via le formulaire de contact : POST
export const contact = async (req, res) => {
  try {
    const { name, email, content, message } = req.body;
    const messageContent = content || message;

    // Vérification que tous les champs sont présents
    if (!name || !email || !messageContent) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Format d'email invalide",
      });
    }

    // Sauvegarde dans la base de données
    const newContact = new Contact({
      name: name.trim(),
      email: email.trim(),
      content: messageContent.trim(),
    });
    await newContact.save();

    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    // Email de confirmation à l'utilisateur
    await transporter.sendMail({
      from: senderEmail,
      to: email.trim(),
      subject: "Contact confirmation",
      text: `Thank you for your message ${name}, we will get back to you as soon as possible.`,
    });

    // Email de notification au propriétaire du site
    await transporter.sendMail({
      from: senderEmail,
      to: senderEmail,
      replyTo: email.trim(),
      subject: "New contact message",
      text: `A new contact message from ${name} (${email}):\n\n${messageContent}`,
    });

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).json({
      message: "An error occurred while sending the message",
    });
  }
};
