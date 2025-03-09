"use client";

import { useState, useEffect } from "react";
import CategorySidebar from "@/components/categorysidebar/categorysidebar";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface Product {
  productID: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  isFeatured: boolean;
  images: string[]; //  Fix: Ensure images is an array of strings (URLs)
  size: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch products");

      if (Array.isArray(data.products)) {
        const allProducts: Product[] = data.products as Product[];
        setProducts(allProducts);
        
        setFeaturedProducts(allProducts.filter((p: Product) => p.isFeatured));
        
        setNewArrivals([...allProducts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 4));
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => setSelectedCategory(category);

  const filterProducts = (products: Product[]) =>
    selectedCategory ? products.filter((p) => p.category === selectedCategory) : products;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link href={`/product/${product.productID}`} className="block">
        <div className="relative w-full h-[400px]">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]} 
              alt={product.name}
              fill
              className="object-cover"
              priority={false}
              quality={75}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          {product.isFeatured && (
            <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
              Featured
            </span>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2">{formatPrice(product.price)}</p>
          <p className="text-sm text-gray-500 mb-2">
            {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
            <span className="text-sm text-gray-500">{product.category}</span>
          </div>
        </div>
      </Link>
    </div>
  );

  const ProductGrid = ({ products }: { products: Product[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productID} product={product} />
      ))}
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <aside className="w-64 border-r bg-white">
        <CategorySidebar onCategorySelect={handleCategorySelect} />
      </aside>

      <main className="flex-1 p-6">
        {!selectedCategory && (
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
            <Image src="/images/pro.jpg" alt="Hero Banner" fill className="object-cover" priority />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</div>
        ) : !selectedCategory ? (
          <>
            {featuredProducts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
                <ProductGrid products={featuredProducts} />
              </section>
            )}

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
              <ProductGrid products={newArrivals} />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">All Products</h2>
              <ProductGrid products={products} />
            </section>
          </>
        ) : (
          <section>
            <h2 className="text-2xl font-bold mb-6">{selectedCategory}</h2>
            {filterProducts(products).length > 0 ? (
              <ProductGrid products={filterProducts(products)} />
            ) : (
              <p className="text-gray-600 text-center p-8">No products found in this category.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
