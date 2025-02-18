import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Contact from "@/lib/contact"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate input fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Connect to MongoDB (Ensure you have a MongoDB connection setup)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Create a new contact entry
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
