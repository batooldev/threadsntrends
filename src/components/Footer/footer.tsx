import React from 'react'
import { SlLocationPin } from "react-icons/sl";
import { PiPhoneBold } from "react-icons/pi";
import { HiOutlineMail } from "react-icons/hi";

export default function Footer() {
  return (
    


<footer className="bg-solid_brown text-white py-10">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Logo and Description */}
      <div>
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Threads N Trends Studio Logo" className="h-12" />
          <span className="font-bold text-lg">Threads N Trends Studio</span>
        </div>
        < p className="mt-4 text-sm">
          Discover the perfect blend of style and craftsmanship at Threads N Trends Studio, your ultimate destination for bespoke tailoring and elegant fashion.</p>
      </div>

      <div></div>

      {/* Links Section */}
      <div>
        <h4 className="font-semibold mb-3">Our Store</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="/Product" className="hover:underline">Product</a></li>
          <li><a href="/AboutUs" className="hover:underline">About Us</a></li>
          <li><a href="/ContactUs" className="hover:underline">Contact</a></li>
        </ul>
      </div>

      {/* Contact Section */}
      <div>
        <h4 className="font-semibold mb-3">Get In Touch</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start space-x-2">
            <SlLocationPin className="text-lg" />
            <span>Pakistan Chakdara Ramora</span>
          </li>
          <li className="flex items-start space-x-2">
            <PiPhoneBold className="text-lg" />
            <span>111-22222-333</span>
          </li>
          <li className="flex items-start space-x-2">
            <HiOutlineMail className="text-lg" />
            <span>support@site.com</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-brown-700 mt-6 pt-4 text-center text-sm">
      <p>Copyright &copy; {new Date().getFullYear()} Threads N Trends Studio. All rights reserved.</p>
    </div>
  </div>
</footer>




  )
}

