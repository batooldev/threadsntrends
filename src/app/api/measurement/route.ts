import { NextResponse } from 'next/server';
import  Measurement  from "@/lib/measurement";
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

console.log(Measurement);

// Handle POST request to create a new measurement
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const measurement = new Measurement(body);
    const savedMeasurement = await measurement.save();
    return NextResponse.json(savedMeasurement, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Handle GET request to fetch all measurements
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get('userID');

    // Validate userID if provided
    if (userID && !mongoose.Types.ObjectId.isValid(userID)) {
      return NextResponse.json({ error: 'Invalid userID' }, { status: 400 });
    }

    const query = userID ? { userID } : {};
    const measurements = await Measurement.find(query);
    return NextResponse.json(measurements, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle PUT request to update a measurement by ID
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    }

    const body = await req.json();
    const updatedMeasurement = await Measurement.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMeasurement) {
      return NextResponse.json({ error: 'Measurement not found' }, { status: 404 });
    }
    return NextResponse.json(updatedMeasurement, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Handle DELETE request to delete a measurement by ID
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    }

    const deletedMeasurement = await Measurement.findByIdAndDelete(id);
    if (!deletedMeasurement) {
      return NextResponse.json({ error: 'Measurement not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Measurement deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}