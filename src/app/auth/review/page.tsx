"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Review {
  _id: string;
  userID: { _id: string; name: string };
  productID: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function Page() {
  // 🔁 Replace with dynamic values as needed
  const productID = "demo-product-id";
  const currentUserID = "demo-user-id";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productID]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productID=${productID}`);
      const data = await res.json();
      setReviews(data.data || []);
    } catch (err) {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      setError("Please provide a rating and comment.");
      return;
    }

    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/reviews?id=${editingId}` : "/api/reviews";
    const reviewPayload = { userID: currentUserID, productID, rating, comment };

    try {
      if (!editingId) {
        const tempReview: Review = {
          _id: Math.random().toString(),
          userID: { _id: currentUserID, name: "You" },
          productID,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        };
        setReviews(prev => [tempReview, ...prev]);
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });

      const data = await res.json();
      if (data.success) {
        setRating(0);
        setComment("");
        setEditingId(null);
        fetchReviews();
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      setError("Failed to delete review.");
    }
  };

  const handleEdit = (review: Review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingId(review._id);
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6">
      <div className="p-4 border rounded-xl shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold">Write a Review</h2>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <Star
              key={i}
              onClick={() => setRating(i)}
              className={cn("h-6 w-6 cursor-pointer", i <= rating ? "text-yellow-500" : "text-gray-300")}
              fill={i <= rating ? "currentColor" : "none"}
            />
          ))}
        </div>

        <Textarea
          placeholder="Your honest feedback..."
          value={comment}
          onChange={handleCommentChange}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleSubmit} disabled={loading}>
          {editingId ? "Update" : "Submit"} Review
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet. Be the first to leave one!</p>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="p-4 border rounded-xl bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{review.userID?.name || "Anonymous"}</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i <= review.rating ? "#facc15" : "none"}
                      stroke="#facc15"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm mt-2">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>

              {review.userID._id === currentUserID && (
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(review)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(review._id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
