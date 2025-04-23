"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const directOrderId = searchParams.get("orderId");

    // If we have a direct order ID (from COD), use it
    if (directOrderId) {
      setOrderId(directOrderId);
      return;
    }

    // If we have a session ID (from Stripe), poll for order confirmation
    if (sessionId) {
      let attempts = 0;
      const maxAttempts = 10;

      const pollOrderStatus = async () => {
        try {
          const response = await fetch(`/api/order-status?session_id=${orderId ? orderId : sessionId}`);
          const data = await response.json();
          
          if (data.orderId) {
            setOrderId(data.orderId);
            return;
          }
          
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(pollOrderStatus, 2000);
          }
        } catch (error) {
          console.error('Error checking order status:', error);
        }
      };

      pollOrderStatus();
    }
  }, [searchParams]);

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
              // orderId is already the orderID string
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
