"use client";

import { useState , useEffect } from 'react';
import CategorySidebar from '@/components/categorysidebar/categorysidebar';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category?: string;
  collection?: string;
  gender?: 'MEN' | 'WOMEN';
}

export default function ProductPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("API response is not an array:", data);
          setProducts([]); // Ensure it's an array
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]); // Fallback to an empty array
      });
  }, []);
  
 

  const handleCategorySelect = (gender: string, collection?: string) => {
    setSelectedCategory(gender);
    if (collection) {
      setSelectedCollection(collection);
    } else {
      setSelectedCollection('');
    }
  };

  const filterProducts = (products: Product[]) => {
    return products.filter(product => {
      if (!selectedCategory && !selectedCollection) return true;
      
      if (selectedCollection) {
        return product.gender === selectedCategory && product.collection === selectedCollection;
      }
      
      return product.gender === selectedCategory;
    });
  };

  const handleAddToCart = (product: Product) => {
    alert(`Added ${product.name} to cart!`);
  };

 const filteredProducts = filterProducts(products); 

  const ProductGrid = ({ products }: { products: Product[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (

        <div>
        <Link href={`/view_product/${product.id}`} key={product.id}>
          <div className="bg-white p-4 shadow rounded-lg">
            <img src={product.image} alt={product.name} className="w-full h-[50vh] object-cover mb-2 rounded" />
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
            </div>
            </Link>

            <button 
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(product);
              }}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
      
        </div>
      ))}
    </div>
  );


  


  return (
    <div className="flex bg-rosy_pink">
      <aside className="w-1/4">
        <CategorySidebar onCategorySelect={handleCategorySelect} />
      </aside>
      <main className="w-3/4 p-6">
        {/* Hero Image Section */}
        <div className="relative w-full rounded-lg overflow-hidden mb-6 ">
          <img 
            src="/images/AB.jpeg" 
            alt="Hero Image" 
            className="w-full h-auto object-cover min-h-[40vh] max-h-[60vh]"
          />
        </div>

        {/* Product Sections */}
        {!selectedCategory ? (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">New Arrival Products</h2>
              <ProductGrid products={products.slice(0, 4)} />
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Popular Products</h2>
              <ProductGrid products={products} />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Trending Products</h2>
              <ProductGrid products={products.slice(4)} />
            </section>
          </>
        ) : (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {selectedCategory} {selectedCollection ? `- ${selectedCollection}` : ''}
            </h2>
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <p className="text-gray-600">No products found in this category.</p>
            )}
          </section>
        )}
          
      </main>
    </div>
  );
}

