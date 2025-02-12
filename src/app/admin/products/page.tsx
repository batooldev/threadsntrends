"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Here, you can send the product data to your backend API
    console.log("New Product:", product);
    alert("Product added successfully!");
    // Optionally reset the form:
    setProduct({
      name: "",
      price: "",
      image: "",
      description: "",
      category: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 font-semibold mb-1">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product price"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 font-semibold mb-1">
          Image URL
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={product.image}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter image URL"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-semibold mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product description"
          rows={4}
          required
        ></textarea>
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-gray-700 font-semibold mb-1">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product category"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;
