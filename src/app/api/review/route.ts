import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/lib/review";


// GET: Fetch reviews (optionally filtered by productID or userID)
export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const productID = searchParams.get("productID");
  const userID = searchParams.get("userID");

  try {
    let query: any = {};
    if (productID) query.productID = productID;
    if (userID) query.userID = userID;

    const reviews = await Review.find(query).populate("userID", "name");
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new review
export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  try {
    const review = await Review.create(body);
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT: Update a review by ID
export async function PUT(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 });
  }

  const updates = await req.json();

  try {
    const updatedReview = await Review.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Remove a review by ID
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 });
  }

  try {
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
