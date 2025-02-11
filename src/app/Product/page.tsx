"use client";

import { useState } from 'react';
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
  
  const products: Product[] = [
    { id: 1, category: 'winter-women', name: 'Blue Dress', price: '$50', image: '/images/p5.webp', gender: 'WOMEN', collection: 'Winter Collection' },
    { id: 2, name: 'Red Shirt', price: '$30', image: '/images/p8.webp', gender: 'MEN', collection: 'Summer Collection' },
    { id: 3, name: 'White Blouse', price: '$40', image: '/images/p9.jpg', gender: 'WOMEN', collection: 'Winter Collection' },
    { id: 4, name: 'Black Jacket', price: '$70', image: '/images/p10.jpg', gender: 'MEN', collection: 'Winter Collection' },
    { id: 5, name: 'Formal Suit', price: '$120', image: '/images/p6.webp', gender: 'MEN', collection: 'Winter Collection' },
    { id: 6, name: 'Casual Trousers', price: '$45', image: '/images/p7.webp', gender: 'MEN', collection: 'Summer Collection' },
    { id: 7, name: 'Summer Hat', price: '$20', image: '/images/p11.jpg', gender: 'WOMEN', collection: 'Summer Collection' },
    { id: 8, name: 'Sneakers', price: '$65', image: '/images/p12.webp', gender: 'MEN', collection: 'Summer Collection' }
  ];

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