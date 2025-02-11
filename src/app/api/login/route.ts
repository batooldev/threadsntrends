// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/lib/User';
import connectDB from '@/lib/db';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();
      console.log(email,password)
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by username (case-insensitive)
    const user = await User.findOne({ 
     email: email
    });
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    
    // Create response with user info
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: { 
          id: user._id, 
          username: user.username,
          role: user.role 
        }
      },
      { status: 200 }
    );

    

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error logging in' },
      { status: 500 }
    );
  }
}