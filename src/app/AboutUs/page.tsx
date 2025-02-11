import React from 'react';
import Link from "next/link"; 


const AboutUs = () => {
  const projects = [
    
    { number: '500+', label: 'unique Designs' },
    { number: '12+', label: 'Years of Expertise' },
    { number: '95%', label: 'Client Satisfaction' }
  ];

  const services = [
    {
      title: 'Custom Tailoring',
      description: 'Expert tailoring services to craft outfits that fit you perfectly and reflect your style.'
    },
    {
      title: 'Exclusive Collections',
      description: 'Discover handpicked, exclusive collections designed for elegance and individuality.'
    },
    {
      title: 'Personal Styling',
      description: 'Our styling experts help you create the perfect look for every occasion.'
    }
  ];

  return (
    <div className="min-h-screen bg-rosy_pink">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-light mb-8 tracking-tight">
            Style Redefined
              <span className="block font-normal text-[#D19E61]">for Every Occasion</span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
             Welcome to Threads N Trends, where fashion meets craftsmanship. We specialize in creating elegant, timeless, and bespoke clothing that celebrates individuality.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F2E8DF] -skew-x-12 transform origin-top-right" />
      </div>

      {/* Stats Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {projects.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-[#D19E61] mb-2">{stat.number}</div>
                <div className="text-sm text-neutral-600 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-rosy_pink py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light mb-8">Our Design Philosophy</h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                At Threads N Trends, we believe that clothing is more than fabric—it's a form of self-expression. Our goal is to bring your vision to life with precision and creativity.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                 Combining tradition with modernity, our designs are crafted to make every moment special, blending elegance with comfort.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div className="h-[60vh]  rounded-lg ">
                <img src="/images/p14.webp" alt="Philosophy Image 1" className="w-full h-[60vh] object-cover rounded-lg" />
              </div>
              <div className="h-[60vh]  rounded-lg  ">
                <img src="/images/p15.webp" alt="Philosophy Image 2" className="w-full h-[60vh] object-cover rounded-lg" />
              </div>
              <div className="h-[60vh]  rounded-lg ">
                <img src="/images/p13.jpg" alt="Philosophy Image 3" className="w-full h-[60vh] object-cover rounded-lg" />
              </div>
              <div className="h-[60vh]  rounded-lg">
                <img src="/images/p12.webp" alt="Philosophy Image 4" className="w-full h-[60vh] object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16">Our services</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <div key={index} className="group hover:bg-[#F2E8DF] p-8 rounded-lg transition-all duration-300">
                <h3 className="text-xl font-medium mb-4 group-hover:text-[#D19E61] transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-neutral-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      

      {/* Contact Section */}
      <div className=" bg-rosy_pink py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light mb-8">Let’s Style You</h2>
          <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto">
             Whether it’s a wedding, a party, or everyday elegance, we’re here to create outfits that make you shine.
          </p>
          <Link href="ContactUs">
          <button className="bg-[#D19E61] text-white px-8 py-4 rounded-lg hover:bg-[#A67B5B] transition-colors duration-300">
              Contact Us
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;