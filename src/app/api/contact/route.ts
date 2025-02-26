
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Contact from "@/lib/contact"; 

// POST method to create a new contact message
export async function POST(req: NextRequest) {
  try {
    console.log(" Contact API hit");
    const body = await req.json();

    console.log("Received Data:", body);
    const { name, email, subject, message } = body;

    // Validate input fields
    if (!name || !email || !subject || !message) {
        console.log(" Validation Error: Missing fields");
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Connect to MongoDB (Ensure you have a MongoDB connection setup)
    if (mongoose.connection.readyState === 0) {
        console.log(" Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Create a new contact entry
    console.log(" Saving Contact Message...");
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    console.log(" Message Saved!");
    return NextResponse.json({ message: "Message sent successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}



// GET method to fetch all contact messages
export async function GET(req: NextRequest) {
  try {
    // Fetch all contact messages from the database
    console.log("Fetching all contact messages...");
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Sort by creation date (most recent first)

    // Return the contact messages as a JSON response
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
