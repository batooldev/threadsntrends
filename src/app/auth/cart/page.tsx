"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Trash, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";

// Add type for cart items
interface CartItem {
  _id: string;
  userId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const Cart = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!session?.user?.id) {
          setLoading(false);
          return;
        }

        // Use the correct user ID format from session
        const userId = session?.user?.id; // This should match your MongoDB user ID
        console.log("Fetching cart with userId:", userId);
        const response = await fetch(`/api/cart?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        
        const data = await response.json();
        console.log("Cart API response:", data);
        
        if (data.cartItems && Array.isArray(data.cartItems)) {
          console.log("Cart items found:", data.cartItems.length);
          setCart(data.cartItems);
        } else {
          console.error("Invalid cart data structure:", data);
          setCart([]);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching cart:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (session) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [session]);

  const increaseQuantity = async (id: string) => {
    try {
      if (!session?.user?.id) return;
      console.log("Increasing quantity for item:", id);
      const response = await fetch(`/api/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          itemId: id, 
          action: "increase" 
        }),
      });

      const result = await response.json();
      console.log("Increase quantity result:", result);

      if (response.ok) {
        setCart((prevCart: any) =>
          prevCart.map((item: any) => 
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const decreaseQuantity = async (id: string) => {
    try {
      if (!session?.user?.id) return;
      console.log("Decreasing quantity for item:", id);
      const response = await fetch(`/api/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          itemId: id, 
          action: "decrease" 
        }),
      });

      const result = await response.json();
      console.log("Decrease quantity result:", result);

      if (response.ok) {
        setCart((prevCart: any) =>
          prevCart.map((item: any) =>
            item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      if (!session?.user?.id) return;
      console.log("Removing item:", id);
      const response = await fetch(`/api/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: id }),
      });

      const result = await response.json();
      console.log("Remove item result:", result);

      if (response.ok) {
        setCart((prevCart: any) => prevCart.filter((item: any) => item._id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cart.reduce((acc: any, item: any) => acc + item.price * (item.quantity || 1), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error loading cart: {error}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view your cart</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-10">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-md relative">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ShoppingCart /> Your Cart
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingCart size={48} className="mx-auto text-gray-300" />
            <p className="text-gray-500 mt-2">Your cart is empty</p>
          </div>
        ) : (
          <div>
            {cart.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between p-4 border-b">
                <img 
                  src={item.image || "/images/placeholder.jpg"} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded" 
                />
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">RS {item.price} each</p>
                  {item.size && <p className="text-gray-400 text-sm">Size: {item.size}</p>}
                </div>
                <div className="flex items-center gap-2  ml-4">
                  <Button variant="outline" size="icon" onClick={() => decreaseQuantity(item._id)}>
                    <Minus size={16} />
                  </Button>
                  <span className="w-8 text-center">{item.quantity || 1}</span>
                  <Button variant="outline" size="icon" onClick={() => increaseQuantity(item._id)}>
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex items-center ml-4">
                <Button variant="destructive" size="icon" onClick={() => removeItem(item._id)}>
                  <Trash size={16} />
                </Button>
                
              </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <h3 className="text-lg font-bold">Total: RS {totalPrice.toFixed(2)}</h3>
              <Link href={`/auth/checkout`}>
                <Button variant="default">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {cart.length > 0 ? cart.length : 0}
        </div>
      </div>
    </div>
  );
};

export default Cart;
