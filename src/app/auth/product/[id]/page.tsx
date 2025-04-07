"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define the product interface
interface Product {
  _id: string;
  productID: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images?: Array<string>;
  inStock: boolean;
  size?: string;
  stock: number;
}

export default function ProductPage(): JSX.Element {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  
  // const { data: session } = useSession();
  const router = useRouter();

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
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    // if (!session) {
      // Redirect to login if not authenticated
      // router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      // return;
    // }

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
          size: product.size,
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

  return (
    <div className="min-h-screen py-8 px-4">
      <Head>
        <title>{product.name} | Our Store</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="max-w-4xl mx-auto">
        <Link href="/Products" className="text-blue-600 hover:underline mb-6 block">
          ← Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-4">
              {product.images?.[0] ? (
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-auto object-cover rounded"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-2xl text-blue-600 mb-4">${product?.price?.toFixed(2)}</p>

              {product.inStock ? (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full mb-4">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1 text-sm rounded-full mb-4">
                  Out of Stock
                </span>
              )}

              {/* Display size if available */}
              {product.size && (
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full">
                    Size: {product.size}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description:</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {product.stock > 0 && (
                <div>
                  <button 
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded ${addingToCart ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  
                  {cartMessage && (
                    <div className="mt-3 text-sm font-medium text-green-600">
                      {cartMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}