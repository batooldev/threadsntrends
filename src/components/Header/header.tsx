"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CiSearch, CiShoppingCart} from "react-icons/ci";
import { CiDeliveryTruck } from "react-icons/ci";


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
      <div className="flex justify-end bg-solid_brown p-3">
        <Link
          href={"/tailor"}
          className="bg-[#fff] shadow-md px-2 py-0.5 border-none rounded-md"
        >
          Tailor Services
        </Link>
      </div>

      <nav className="flex flex-row px-5 py-5 bg-[#fff] shadow-md">
        {/* Navigation links */}
        <div className="flex gap-3">
          <Link href={"/"}>Home</Link>
          <Link href="/Product">Product</Link>
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

          {/* Trackoder icon */}
          <div>
          <Link href="/Trackorder" className="relative">
          <CiDeliveryTruck
          className="icon"
          style={{fontSize: "1.5rem"}}

           />
          
          </Link>
          </div>
          
          {/* shoping cart */}
          <div>
          <CiShoppingCart
            className="icon"
            style={{ fontSize: "1.5rem" }}  
            
          />
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
