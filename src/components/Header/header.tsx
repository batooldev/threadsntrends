"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CiSearch, CiShoppingCart} from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button"



const Header = () => {
  const [showSearch, setShowSearch] = useState(false); // State to control search visibility
  

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  
  };
  const closeSearch = () => {
    setShowSearch(false);
  };


  

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
        <div className="search-modal fixed top-0 right-0 w-95 h-full bg-white bg-opacity-90 z-50 flex flex-col p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              SEARCH OUR SITE
            </h2>
            <button onClick={closeSearch} className="text-2xl">
              x
            </button>
          </div>
          <div className="flex flex-col mt-5 gap-3">
            <select className="border p-2 rounded">
              <option>All Categories</option>
              <option>Fashion</option>
              <option>Home Decor</option>
              <option>Events</option>
            </select>
            <div className="flex items-center border p-2 rounded">
              <input
                type="text"
                placeholder="Search"
                className="flex-grow outline-none"
              />
              <CiSearch className="text-xl" />
            </div>
          </div>

        </div>
      )}
      
    </div>
  );
};

export default Header;
