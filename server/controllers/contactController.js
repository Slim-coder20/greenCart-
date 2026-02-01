import transporter from "../configs/email.js";
import Contact from "../models/contact.js";
import { getUserEmailHtml, getAdminEmailHtml } from "../templates/index.js";

// Contact form email handler : POST /api/contact
export const contact = async (req, res) => {
  try {
    const { name, email, content, message } = req.body;
    const messageContent = content || message;

    if (!name || !email || !messageContent) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const newContact = new Contact({
      name: name.trim(),
      email: email.trim(),
      content: messageContent.trim(),
    });
    await newContact.save();

    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
    const displayName = "FoodStore";

    // User confirmation email (HTML + text fallback)
    await transporter.sendMail({
      from: `"${displayName}" <${senderEmail}>`,
      to: email.trim(),
      subject: "✓ Your message has been received - FoodStore",
      text: `Hello ${name}, thank you for contacting FoodStore. We have received your message and will get back to you as soon as possible. Best regards, The FoodStore Team`,
      html: getUserEmailHtml(name.trim()),
    });

    // Admin notification email (HTML + text fallback)
    await transporter.sendMail({
      from: `"${displayName} Contact" <${senderEmail}>`,
      to: senderEmail,
      replyTo: email.trim(),
      subject: `📩 New message from ${name} - FoodStore`,
      text: `New message from ${name} (${email}):\n\n${messageContent}`,
      html: getAdminEmailHtml(name.trim(), email.trim(), messageContent.trim()),
    });

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).json({
      message: "An error occurred while sending the message",
    });
  }
};
