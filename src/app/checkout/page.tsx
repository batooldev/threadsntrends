"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Checkout() {
  const [billingAddress, setBillingAddress] = useState("same"); // Track billing address selection

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-5xl mx-auto">
      {/* Left Section - Contact, Delivery, Shipping, Payment, and Billing */}
      <div className="flex-1 space-y-6">
        {/* Contact Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Contact</h2>
            <Input placeholder="Email" className="border-red-500" />
            <div className="flex items-center space-x-2">
              <Checkbox id="email-offers" />
              <label htmlFor="email-offers" className="text-sm">
                Email me with news and offers
              </label>
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
            <Input placeholder="First name" />
            <Input placeholder="Last name" />
            <Input placeholder="Address" />
            <Input placeholder="Apartment, suite, etc. (optional)" />
            <div className="flex gap-2">
              <Input placeholder="City" className="border-red-500" />
              <Input placeholder="Postal code (optional)" />
            </div>
            <Input placeholder="Phone" />
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
            <RadioGroup defaultValue="card" className="space-y-3">
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
                <p>COD not available for international client</p>
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

            {/* Billing Address Form (Shown Only if "Use a different billing address" is Selected) */}
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
                  <Input placeholder="First name" />
                  <Input placeholder="Last name" />
                </div>
                <Input placeholder="Address" />
                <Input placeholder="Apartment, suite, etc. (optional)" />
                <div className="flex gap-2">
                  <Input placeholder="City" />
                  <Input placeholder="Postal code (optional)" />
                </div>
                <Input placeholder="Phone (optional)" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pay Now Button */}
        <Button className="w-full text-lg py-3">Pay Now</Button>
      </div>

      {/* Right Section - Order Summary */}
      <div className="w-full lg:w-1/3">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm font-semibold">Rs 7,990.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Shipping</span>
              <span className="text-sm font-semibold">Rs 99.00</span>
            </div>
            <div className="border-t pt-4 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>PKR Rs 8,089.00</span>
            </div>
            <Input placeholder="Discount code" />
            <Button className="w-full">Apply</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
