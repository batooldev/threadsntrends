import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/lib/review";
import User from "@/lib/User"; // Add this import

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

    const reviews = await Review.find(query)
      .populate('userID', 'name')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Transform the data to ensure all reviews have a name
    const transformedReviews = reviews.map(review => ({
      ...review,
      userID: {
        _id: review.userID?._id || 'unknown',
        name: review.userID?.name || 'Anonymous'
      }
    }));

    return NextResponse.json({ success: true, data: transformedReviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new review
export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  
  try {
    // Extract userName from request and remove it from body
    const { userName, ...reviewData } = body;
    
    // Create the review
    const review = await Review.create(reviewData);
    
    // Update the user's name using Mongoose model if provided
    if (userName && reviewData.userID) {
      await User.findByIdAndUpdate(reviewData.userID, { 
        $set: { name: userName }
      });
    }

    const populatedReview = await Review.findById(review._id)
      .populate('userID', 'name')
      .lean()
      .exec();

    const transformedReview = {
      ...populatedReview,
      userID: {
        _id: (populatedReview as any)?.userID?._id || 'unknown',
        name: userName || (populatedReview as any)?.userID?.name || 'Anonymous'
      }
    };

    return NextResponse.json({ success: true, data: transformedReview }, { status: 201 });
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
