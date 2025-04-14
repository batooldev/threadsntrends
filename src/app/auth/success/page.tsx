"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId"); // ✅ gets the orderId from URL

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-green-600">Payment Successful! 🎉</h1>
        <p className="text-gray-600">Thank you for your purchase.</p>

        {orderId && (
          <Button
          className="mt-4"
          onClick={async () => {
            if (!orderId) return;
        
            try {
              const res = await fetch(`/api/invoice/${orderId}`);
              if (!res.ok) throw new Error("Failed to fetch invoice.");
        
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
        
              const a = document.createElement("a");
              a.href = url;
              a.download = `invoice-${orderId}.pdf`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error("Invoice download failed:", err);
              alert("Failed to download invoice. Please try again.");
            }
          }}
        >
          Download Invoice
        </Button>
        
        )}

        <Button 
          onClick={() => router.push('/auth')}
          className="mt-2"
        >
          Back to Products
        </Button>
      </div>
    </div>
  );
}
