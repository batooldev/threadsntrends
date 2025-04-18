"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Checkout() {
  const router = useRouter();
  const [billingAddress, setBillingAddress] = useState("same");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: "",
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingApartment: "",
    billingCity: "",
    billingPostalCode: "",
    billingPhone: "",
    paymentMethod: "card",
    emailOffers: false,
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = "67c59a3b1eeafc3be590e110";
        const response = await fetch(`/api/cart?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        
        const data = await response.json();
        setCart(data.cartItems);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching cart:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        billingAddress: billingAddress === "same" 
          ? {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              apartment: formData.apartment,
              city: formData.city,
              postalCode: formData.postalCode,
              phone: formData.phone,
            }
          : {
              firstName: formData.billingFirstName,
              lastName: formData.billingLastName,
              address: formData.billingAddress,
              apartment: formData.billingApartment,
              city: formData.billingCity,
              postalCode: formData.billingPostalCode,
              phone: formData.billingPhone,
            },
        products: cart.map((item: any) => ({
          productID: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size 
        })),
        totalAmount: cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) + 99,
        shippingCost: 99,
        paymentMethod: formData.paymentMethod,
      };

      if (formData.paymentMethod === "card") {
        // For card payments, create Stripe checkout session
        const response = await fetch("/api/checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            ...orderData
          }),
        });
        const data = await response.json();
        if (response.ok) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || "Failed to create payment session");
        }
      } else {
        // For COD, create order directly
        const response = await fetch("/api/cod-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        const data = await response.json();
        if (response.ok) {
          router.push(`/auth/success?orderId=${data.order._id}`);// Redirect to success page for COD
        } else {
          throw new Error(data.error || "Failed to create order");
        }
      }
    } catch (err:any) {
      console.error("Error processing order:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 p-6 max-w-5xl mx-auto">
      <div className="flex-1 space-y-6">
        {/* Contact Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Contact</h2>
            <Input 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email" 
              required
            />
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emailOffers" 
                checked={formData.emailOffers}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, emailOffers: !!checked }))}
              />
              <label htmlFor="emailOffers">Email me with news and offers</label>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Delivery</h2>
            <Select>
              <SelectTrigger className="border-red-500">
                <SelectValue placeholder="Select city from dropdown" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lahore">Lahore</SelectItem>
                <SelectItem value="karachi">Karachi</SelectItem>
                <SelectItem value="islamabad">Islamabad</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name" 
              required
            />
            <Input 
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last name" 
              required
            />
            <Input 
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address" 
              required
            />
            <Input 
              name="apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              placeholder="Apartment, suite, etc. (optional)" 
            />
            <div className="flex gap-2">
              <Input 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City" 
                required
              />
              <Input 
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Postal code (optional)" 
              />
            </div>
            <Input 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone" 
              required
            />
          </CardContent>
        </Card>

        {/* Shipping Method */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Shipping Method</h2>
            <div className="flex items-center justify-between border p-3 rounded-md">
              <span>Standard</span>
              <span className="font-semibold">Rs 99.00</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Payment</h2>
            <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>
            <RadioGroup 
              name="paymentMethod"
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 border p-3 rounded-md">
                <RadioGroupItem value="card" id="card" />
                <label htmlFor="card" className="flex-1 text-sm">
                  Debit - Credit Card
                </label>
                <img src="/visa-mastercard.png" alt="Visa and MasterCard" className="h-5" />
              </div>
              <div className="flex items-center space-x-3 border p-3 rounded-md">
                <RadioGroupItem value="cod" id="cod" />
                <label htmlFor="cod" className="flex-1 text-sm">
                  Cash on Delivery (COD)
                </label>
                <p>COD not available for international clients</p>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Billing Address</h2>
            <RadioGroup value={billingAddress} onValueChange={setBillingAddress} className="space-y-3">
              <div className="flex items-center space-x-3 border p-3 rounded-md">
                <RadioGroupItem value="same" id="same" />
                <label htmlFor="same" className="flex-1 text-sm">
                  Same as shipping address
                </label>
              </div>
              <div className="flex items-center space-x-3 border p-3 rounded-md">
                <RadioGroupItem value="different" id="different" />
                <label htmlFor="different" className="flex-1 text-sm">
                  Use a different billing address
                </label>
              </div>
            </RadioGroup>

            {billingAddress === "different" && (
              <div className="mt-4 space-y-3 p-4 border rounded-md bg-gray-50">
                <Select>
                  <SelectTrigger className="border-red-500">
                    <SelectValue placeholder="Country/Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pakistan">Pakistan</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input 
                    name="billingFirstName"
                    value={formData.billingFirstName}
                    onChange={handleInputChange}
                    placeholder="First name" 
                    required
                  />
                  <Input 
                    name="billingLastName"
                    value={formData.billingLastName}
                    onChange={handleInputChange}
                    placeholder="Last name" 
                    required
                  />
                </div>
                <Input 
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  placeholder="Address" 
                  required
                />
                <Input 
                  name="billingApartment"
                  value={formData.billingApartment}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc. (optional)" 
                />
                <div className="flex gap-2">
                  <Input 
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleInputChange}
                    placeholder="City" 
                    required
                  />
                  <Input 
                    name="billingPostalCode"
                    value={formData.billingPostalCode}
                    onChange={handleInputChange}
                    placeholder="Postal code (optional)" 
                  />
                </div>
                <Input 
                  name="billingPhone"
                  value={formData.billingPhone}
                  onChange={handleInputChange}
                  placeholder="Phone (optional)" 
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full text-lg py-3" disabled={submitting}>
          {submitting ? "Processing..." : "Pay Now"}
        </Button>
      </div>

      <div className="w-full lg:w-1/3">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm font-semibold">Rs {cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Shipping</span>
              <span className="text-sm font-semibold">Rs 99.00</span>
            </div>
            <div className="border-t pt-4 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>PKR Rs {(cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) + 99).toFixed(2)}</span>
            </div>
            <Input placeholder="Discount code" />
            <Button className="w-full">Apply</Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
