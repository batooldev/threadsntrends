
"use client";

import React, { useState } from 'react';


const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [contactMethod, setContactMethod] = useState('phone');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ orderId, contactMethod, contactInfo });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="bg-white p-8 rounded shadow max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#b8915c]">Track Your Order</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="orderId" className="block text-sm font-medium mb-2">Order ID</label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Order ID"
              required
            />
          </div>
          <div className="mb-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={contactMethod === 'phone'}
                  onChange={(e) => setContactMethod(e.target.value)}
                />
                Phone Number
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={contactMethod === 'email'}
                  onChange={(e) => setContactMethod(e.target.value)}
                />
                Email
              </label>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="contactInfo" className="block text-sm font-medium mb-2">
              {contactMethod === 'phone' ? 'Enter Phone Number' : 'Enter Email'}
            </label>
            <input
              type="text"
              id="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder={contactMethod === 'phone' ? 'Phone Number' : 'Email'}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-solid_brown"
          >
            Track IT
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackOrder;
