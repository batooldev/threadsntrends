import mongoose, { Schema, model, models } from "mongoose";

const contactSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

// Prevent multiple model compilation in development
const Contact = models.Contact || model("Contact", contactSchema);

export default Contact;
