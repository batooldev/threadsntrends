"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Minus, Plus, ShoppingCart } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState([
    { id: 1, name: "Product 1", price: 30, quantity: 1, image: "/images/product1.jpg" },
    { id: 2, name: "Product 2", price: 45, quantity: 2, image: "/images/product2.jpg" },
  ]);

  const increaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border-b">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">${item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => decreaseQuantity(item.id)}>
                    <Minus size={16} />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => increaseQuantity(item.id)}>
                    <Plus size={16} />
                  </Button>
                </div>
                <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash size={16} />
                </Button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <h3 className="text-lg font-bold">Total: ${totalPrice}</h3>
            <Link href="/checkout">
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
