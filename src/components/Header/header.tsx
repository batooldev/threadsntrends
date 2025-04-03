"use client";

import React, { useState , useEffect} from "react";
import Link from "next/link";
import { CiSearch, CiShoppingCart} from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button"


interface Product {
  _id: string
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

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

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
  

  return (
    <div>
      {/* Tailor button */}
      <div className="bg-solid_brown flex justify-end">

        <Link href="/tailor-services">
        <Button variant="outline" >Tailor Service</Button>
        </Link>
    </div>

      <nav className="flex flex-row px-5 py-5 bg-[#fff] shadow-md">
        {/* Navigation links */}
        <div className="flex gap-3">
          <Link href={"/"}>Home</Link>
          <Link href="/Products">Product</Link>
          <Link href="/AboutUs">AboutUs</Link>
          <Link href="/ContactUs">ContactUs</Link>
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

          
          
          {/* shoping cart icon*/}
          <div>
            <Link href="/cart" className="relative">
          <CiShoppingCart
            className="icon"
            style={{ fontSize: "1.5rem" }}  
            
          />
          </Link>
          </div>

          {/*login icon */}
          <div>
            <Link href="/login" className="relative">
            <FiUser 
            className="icon"
            style={{ fontSize: "1.5rem"}}
            />
            
            </Link>
          </div>

        </div>
      </nav>

      {/* Search Modal */}
      {showSearch && (
        <div className="search-modal fixed top-0 right-0 w-96 h-full bg-white z-50 flex flex-col p-5 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">SEARCH PRODUCTS</h2>
            <button onClick={closeSearch} className="text-2xl">×</button>
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
