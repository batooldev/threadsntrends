"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { HiPhoneArrowUpRight } from "react-icons/hi2";
import { MdMarkEmailRead } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaShop } from "react-icons/fa6";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    alert("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const isFormFilled = !!(formData.name && formData.email && formData.subject && formData.message);

  return (
    <div className="bg-rosy_pink min-h-screen p-6">

       <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        
        <div className="relative  bg-gradient-to-r from-[#f5e3c6] to-[#e0b98d]  mb-10">
         <img 
         src="/images/contactus_background_custom.png" 
         alt="Contact Us Background" 
        className="w-screen h-[300px] object-cover"
        />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 text-black">
      <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
     <p className="text-lg max-w-3xl text-center">
      Welcome to Threads N Trends! Have questions or need custom tailoring? 
      Get in touch—we’re here to help bring your style to life!
     </p>
    </div>
    </div>

         

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10 mt-10">
          {/* Contact Information Section */}

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow p-6 rounded flex items-center gap-4 ">
               <span className="text-2xl"><HiPhoneArrowUpRight /></span>
                <div>
                  <p className="font-bold">Phone</p>
                  <p>222-33333-444</p>
                </div>
              </div>
              <div className="bg-white shadow p-12 rounded flex items-center  gap-4">
                <span className="text-2xl "><IoLogoWhatsapp /></span>
                <div>
                  <p className="font-bold">WhatsApp</p>
                  <p>111-22222-333</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow p-10 rounded flex items-center gap-4">
                <span className="text-2xl"><MdMarkEmailRead /></span>
                <div>
                  <p className="font-bold">Email</p>
                  <p>support@site.com</p>
                </div>
              </div>
              <div className="bg-white shadow p-10 rounded flex items-center gap-4">
                <span className="text-2xl"><FaShop /></span>
                <div>
                  <p className="font-bold">Our Shop</p>
                  <p>Pakistan, Chakdara, Ramora</p>
                </div>
              </div>
            </div>
          
          
          <div className="mt-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.432837936347!2d72.05965697520449!3d34.66902378491272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dc0410fd8f6bd1%3A0xd9a1bdbac1a3aff4!2sUniversity%20of%20Malakand!5e0!3m2!1sen!2s!4v1736163853676!5m2!1sen!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              >

              </iframe>
            </div>

          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow p-8 rounded">
            <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                placeholder="Subject"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded h-32"
                placeholder="Your Message"
                required
              />
            </div>
            <button
            type="submit"
            disabled={!isFormFilled}
            className={`w-full py-2 rounded ${
            isFormFilled ? "bg-[#D19E61] text-white" : "bg-[#D19E61] hover:bg-[#A67B5B] text-gray-700 cursor-not-allowed"
         }`}
        >
        Send Now
        </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;