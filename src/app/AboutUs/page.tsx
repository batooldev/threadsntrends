import React from 'react';


const AboutUs = () => {
  const projects = [
    
    { number: '45+', label: 'Design Awards' },
    { number: '12+', label: 'Years Experience' },
    { number: '98%', label: 'Client Satisfaction' }
  ];

  const services = [
    {
      title: 'Brand Identity',
      description: 'Crafting unique visual languages that speak to your audience'
    },
    {
      title: 'Digital Design',
      description: 'Creating seamless digital experiences that inspire and engage'
    },
    {
      title: 'Art Direction',
      description: 'Guiding creative vision to tell compelling visual stories'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F4F0]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-light mb-8 tracking-tight">
              We craft beautiful
              <span className="block font-normal text-[#D19E61]">digital experiences</span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              A boutique design studio focused on creating meaningful and memorable brand experiences. 
              We believe in the power of minimalist design to tell compelling stories.
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
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light mb-8">Our Design Philosophy</h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                We believe that exceptional design lies in the perfect balance of form and function. 
                Every pixel, every interaction, and every element serves a purpose in telling your brand's story.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Our approach combines minimalist aesthetics with innovative solutions, 
                creating designs that not only look beautiful but deliver meaningful results.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 bg-[#F2E8DF] rounded-lg" />
              <div className="h-64 bg-[#E4D5C3] rounded-lg mt-8" />
              <div className="h-64 bg-[#D19E61] rounded-lg -mt-8" />
              <div className="h-64 bg-[#A67B5B] rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16">Our Expertise</h2>
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
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light mb-8">Let's Create Together</h2>
          <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto">
            We're always excited to collaborate with forward-thinking brands and ambitious clients.
          </p>
          <button className="bg-[#D19E61] text-white px-8 py-4 rounded-lg hover:bg-[#A67B5B] transition-colors duration-300">
            Start a Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;