"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import Image from "next/image";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";


interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  stock: number;
  isFeatured: boolean;
  size: string[],
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const AVAILABLE_SIZES = ["Unstitched","XS", "S", "M", "L", "XL"];

const ProductForm = () => {
  const [product, setProduct] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: 0,
    isFeatured: false,
    size:[],
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setProduct((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : name === "isFeatured"
          ? value === "true"
          : value,
    }));
  };

  const handleSizeChange = (size: string) => {
    setProduct((prev) => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter((s) => s !== size) // Remove if already selected
        : [...prev.size, size], // Add if not selected
    }))
   };
  

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Reset errors
    setError(null);

    // Check total number of images
    if (files.length + selectedImages.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    const validPreviewUrls: string[] = [];

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        setError("Only JPEG, PNG, and WebP images are allowed");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("Each image must be less than 5MB");
        return;
      }

      validFiles.push(file);
      validPreviewUrls.push(URL.createObjectURL(file));
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...validPreviewUrls]);
  };

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    // Validate product fields
    if (!product.name || !product.price || !product.description || !product.category || product.stock < 0) {
      setError("All fields are required and stock cannot be negative");
      setIsSubmitting(false);
      return;
    }
    
    if (selectedImages.length === 0) {
      setError("Please select at least one image");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Create FormData object for multipart form submission
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price.toString());
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("stock", String(product.stock));
      formData.append("isFeatured" , String(product.isFeatured));
      formData.append("size", JSON.stringify(product.size));

      console.log("Sizes: ", JSON.stringify(product.size))

      
      // Append each selected image file to the formData
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });
      
      // Send the formData to the backend - let backend handle Cloudinary upload
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add product");
      
      // Reset form after successful submission
      // setProduct({
      //   name: "",
      //   price: "",
      //   description: "",
      //   category: "",
      //   stock: 0,
      //   isFeatured: false,
      //   size:[],
      // });
      setSelectedImages([]);
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Show success message
      setSuccess("Product added successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]); 
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-700">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
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

        <div>
          <label htmlFor="price" className="block text-gray-700 font-semibold mb-1">
            Price (Pkr)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product price"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Images (Max {MAX_IMAGES})
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            multiple
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum 5 images, each less than 5MB (JPEG, PNG, or WebP)
          </p>
          {previewUrls.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full h-24">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
            
        <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Select Sizes
          </label>
          <div className="flex space-x-2">
            {AVAILABLE_SIZES.map((size) => (
              <label key={size} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={product.size.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{size}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500">Select available sizes for this product.</p>
        </div>

      </div>

        <div>
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
          />
        </div>

        <div>
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

        <div>
          <label htmlFor="stock" className="block text-gray-700 font-semibold mb-1">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product stock"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={product.isFeatured}
              onChange={() => setProduct(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 font-semibold">Featured Product</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded transition flex items-center justify-center ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;