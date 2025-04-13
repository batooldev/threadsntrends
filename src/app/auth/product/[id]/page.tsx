"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the product interface to match the schema
interface Product {
  _id: string;
  productID: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images?: Array<string>;
  inStock: boolean;
  sizes?: string[]; // Changed from size to sizes to match database schema
  stock: number;
  details?: {
    material?: string;
    features?: string[];
  };
}

interface Review {
  _id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductPage(): JSX.Element {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("XS");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("description");
  const router = useRouter();

  // Default sizes with unstitched option
  const defaultSizes = ["XS", "S", "M", "L", "XL", "Unstitched"];

  useEffect(() => {
    // Make sure we have an ID before fetching
    if (!id) return;

    const fetchProduct = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${id}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: Product = await response.json();
        setProduct(data);
        
        // If product has sizes and there's at least one, set the first as selected
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews when the reviews tab is selected
  useEffect(() => {
    if (activeTab === "reviews" && id) {
      fetchReviews();
    }
  }, [activeTab, id]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/reviews/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: "67c59a3b1eeafc3be590e110",
          productId: product._id,
          name: product.name,
          description: product.description,
          category: product.category || 'uncategorized',
          price: product.price,
          stock: product.stock,
          size: selectedSize, // This will be sent to the database
          image: product.images?.[0],
          quantity: 1
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCartMessage('Product added to cart!');
        setTimeout(() => setCartMessage(null), 3000); // Clear message after 3 seconds
      } else {
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setCartMessage(err instanceof Error ? err.message : 'Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const nextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.images!.length);
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length);
  };

  const selectThumbnail = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Determine which sizes to show
  const getSizesToShow = () => {
    // If the product has specified sizes, use those
    if (product?.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    // Otherwise, use default sizes
    return defaultSizes;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-red-600 mb-4">Error: {error}</div>
        <Link href="/Products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );

  if (!product) return <div className="text-center py-10">Product not found</div>;

  const sizesToShow = getSizesToShow();

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{product.name} | Our Store</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Gallery */}
          <div className="md:w-1/2 flex">
            <div className="hidden md:flex flex-col space-y-3 mr-4">
              {product.images?.map((image, index) => (
                <div 
                  key={index} 
                  className={`w-20 h-24 border cursor-pointer ${currentImageIndex === index ? 'border-black' : 'border-gray-200'}`}
                  onClick={() => selectThumbnail(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              
              {/* If no images, show placeholder thumbnails */}
              {(!product.images || product.images.length === 0) && (
                <>
                  {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="w-20 h-24 bg-gray-100 border border-gray-200"></div>
                  ))}
                </>
              )}
            </div>
            
            <div className="flex-1 relative">
              {product.images && product.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-auto object-cover"
                  />
                  
                  {/* Navigation arrows positioned directly on the image */}
                  <div className="absolute bottom-4 w-full flex justify-center space-x-4">
                    <button 
                      onClick={prevImage} 
                      className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center shadow-sm hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    
                    <button 
                      onClick={nextImage} 
                      className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center shadow-sm hover:bg-white"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
            <div className="text-2xl text-gray-600 mb-8">Rs. {product.price.toFixed(2)}</div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="text-lg font-medium">SIZE: {selectedSize}</div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {sizesToShow.map((size) => (
                  <button
                    key={size}
                    className={`${
                      size === "Unstitched" ? "px-4" : "w-10"
                    } h-10 rounded-full flex items-center justify-center ${
                      selectedSize === size 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-white border border-gray-300 text-gray-800'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              disabled={addingToCart} 
              className="w-full h-12 rounded-full bg-black hover:bg-gray-800 text-white"
            >
              {addingToCart ? 'ADDING...' : 'ADD TO CART'}
            </Button>
            
            {cartMessage && (
              <div className="mt-3 text-sm font-medium text-green-600">
                {cartMessage}
              </div>
            )}

            {/* Product Information Tabs */}
            <div className="mt-8">
              <Tabs 
                defaultValue="description" 
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="description" className="flex-1 rounded-full">Description</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1 rounded-full">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <div className="text-gray-600 mb-6">
                    <p className="mb-4">{product.description}</p>
                    
                    {/* Only show details if they exist in the product data */}
                    {product.details && (
                      <div className="mt-6">
                        {product.details.material && (
                          <>
                            <h3 className="text-gray-500 font-medium mt-4 mb-2">Material</h3>
                            <p className="text-gray-600">{product.details.material}</p>
                          </>
                        )}
                        
                        {product.details.features && product.details.features.length > 0 && (
                          <>
                            <h3 className="text-gray-500 font-medium mt-4 mb-2">Features</h3>
                            <ul className="list-disc list-inside text-gray-600">
                              {product.details.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4">
                  {reviewsLoading ? (
                    <div className="py-4 text-center text-gray-600">Loading reviews...</div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review._id} className="border-b pb-4">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{review.username}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center mt-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-gray-600">No reviews yet.</div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}