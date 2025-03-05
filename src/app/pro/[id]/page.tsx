import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// Define the product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  inStock: boolean;
  size?: string; // Added size field
}

export default function ProductPage(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Make sure we have an ID before fetching
    if (!id) return;

    const fetchProduct = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data: Product = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading product...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-xl text-red-600 mb-4">Error: {error}</div>
      <Link href="/" className="text-blue-600 hover:underline">
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
        <Link href="/" className="text-blue-600 hover:underline mb-6 block">
          ← Back to Products
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-4">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
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
              <p className="text-2xl text-blue-600 mb-4">${product.price.toFixed(2)}</p>
              
              {product.inStock ? (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full mb-4">
                  In Stock
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
              
              {product.inStock && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}