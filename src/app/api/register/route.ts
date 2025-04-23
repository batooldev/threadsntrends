import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/lib/User';
import connectDB from '@/lib/db';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { name, email, password } = await req.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with name instead of username
    const user = await User.create({
      name,  // Changed from username to name
      email,
      password: hashedPassword,
    });
    
    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error registering user',  },
      { status: 500 }
    );
  }
}