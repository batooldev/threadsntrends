"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface Product {
  _id: string;
  productID: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  isFeatured: boolean;
  images: string[];
  size: string[];
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  _id: string;
  userId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const toggleSearch = () => setShowSearch(!showSearch);
  const closeSearch = () => setShowSearch(false);

  // Fetch products based on search query
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) {
        setSearchResults([]); // Clear results when input is empty
        return;
      }
      try {
        const response = await fetch(`/api/search?q=${searchQuery}`);

        const data = await response.json();
        setSearchResults(data.products || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const delaySearch = setTimeout(fetchResults, 300); // Delay search for better UX
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Function to fetch cart count
  const fetchCartCount = async () => {
    try {
      if (!session?.user?.id) {
        setCartItemCount(0);
        return;
      }

      const userId = session.user.id;
      const response = await fetch(`/api/cart?userId=${userId}`, {
        // Adding cache: 'no-store' to prevent caching
        // This ensures we always get fresh data
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      
      const data = await response.json();
      
      if (data.cartItems && Array.isArray(data.cartItems)) {
        setCartItemCount(data.cartItems.length);
      } else {
        setCartItemCount(0);
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
      setCartItemCount(0);
    }
  };

  // Fetch cart items count whenever session changes
  useEffect(() => {
    if (session) {
      fetchCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [session]);

  // Refetch cart count on page changes
  useEffect(() => {
    if (session) {
      fetchCartCount();
    }
  }, [pathname, session]);

  // Set up an interval to periodically check for cart updates
  useEffect(() => {
    // Only set up the interval if the user is logged in
    if (!session?.user?.id) return;
    
    // Check for cart updates every 5 seconds
    const intervalId = setInterval(fetchCartCount, 5000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [session]);

  // Listen for custom cart update events
  useEffect(() => {
    // Function to handle cart update events
    const handleCartUpdate = () => {
      if (session?.user?.id) {
        fetchCartCount();
      }
    };

    // Add event listener for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [session]);

  return (
    <div>
      {/* Brown background div */}
      <div className="bg-solid_brown h-10"></div>

      <nav className="flex flex-row px-5 py-5 bg-[#fff] shadow-md">
        {/* Navigation links */}
        <div className="flex gap-3">
          <Link href={"/"}>Home</Link>
          <Link href="/auth">Product</Link>
          <Link href="/AboutUs">AboutUs</Link>
          <Link href="/ContactUs">ContactUs</Link>
          <Link href="/auth/tailor-services">Tailor Services</Link>
        </div>

        {/* Logo or Branding */}
        <div className="flex-grow text-center justify-center w-8/12">
          <p>Thread N Trends</p>
        </div>

        {/* Search and Cart Icons and Trackoder icon*/}
        <div className="header-icons flex items-center gap-3">
          {/* search icon */}
          <div className="search-container flex items-center gap-2">
            <CiSearch
              className="icon"
              style={{ fontSize: "1.5rem" }}
              onClick={toggleSearch}
            />
          </div>

          {/* shopping cart icon with badge */}
          <div className="relative">
            <Link href="/auth/cart">
              <CiShoppingCart className="icon" style={{ fontSize: "1.5rem" }} />
              {/* Always show the badge, even when count is 0 */}
              <span className="absolute -top-2 -right-2 bg-light_brown text-white text-xs w-4 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            </Link>
          </div>

          {/*login icon */}
          <div>
            {session ? (
              <LogOut onClick={() => signOut().then(() => router.push("/login"))} className="icon" style={{ fontSize: "1.5rem" }} />
            ) : (
              <Link href="/login" className="relative">
                <FiUser className="icon" style={{ fontSize: "1.5rem" }} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {showSearch && (
        <div className="search-modal fixed top-0 right-0 w-96 h-full bg-white z-50 flex flex-col p-5 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">SEARCH PRODUCTS</h2>
            <button onClick={closeSearch} className="text-2xl">
              ×
            </button>
          </div>

          <div className="flex flex-col mt-5 gap-3">
            <div className="flex items-center border p-2 rounded">
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-grow outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <CiSearch className="text-xl" />
            </div>

            {/* Display Search Results */}
            <div className="max-h-60 overflow-auto mt-3">
              {searchResults.length === 0 && searchQuery && (
                <p className="text-gray-500">No products found</p>
              )}
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="block p-2 border-b hover:bg-gray-100 transition"
                  onClick={closeSearch}
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;