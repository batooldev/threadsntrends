"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-green-600">Payment Successful! 🎉</h1>
        <p className="text-gray-600">Thank you for your purchase.</p>
        <Button 
          onClick={() => router.push('/auth')}
          className="mt-4"
        >
          Back to Products
        </Button>
      </div>
    </div>
  );
}