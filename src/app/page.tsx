import Image from 'next/image';
import Link from 'next/link';

export default function AboutUs() {
  return (

    <div className="min-h-screen bg-[#F5F0EA] text-gray-800">
      

    {/* Intro Section */}
    <section className="pl-6 md:pl-16 lg:pl-32">
        <div className="flex flex-row items-center max-md:flex-col gap-8 w-full">
          <div className="space-y-6 max-w-[18rem] py-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Shop New Arrivals</h2>
            <p className="text-lg leading-relaxed  font-light">
            "Discover the latest boutique arrivals at Threads N Trends! Our exclusive collection showcases elegant and unique designs, 
            perfect for elevating your style with sophistication and charm."
            </p>
            <Link href="Product">
            <button className="bg-[#D19E61] hover:bg-[#A67B5B] text-white px-6 py-3 rounded-lg shadow-md mt-4">
              Shop Now
            </button>
            </Link>
          </div>
          <div className='relative w-full h-full'>
            <img
              src="/images/download (9).jfif" // Update with actual path
              alt="Tailored Display"
              // width={500}
              // height={500}
              className="rounded-lg shadow-lg h-[800px] w-full "
            />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <div className="relative ">
        <img
          src="/images/p1.png" // Update with actual path
          alt="Threads N Trends Boutique"
         // width={1600}
          //height={800}
          className="object-cover w-full h-[50vh] rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center  ">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">Threads N Trends</h1>
        </div>
      </div>

            {/* Featured Categories */}
            <section className="py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Adventure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
         
          {/* first image*/}
         <div className="flex flex-col items-center space-y-4">
         <div className="aspect-[3/4] w-full max-w-md rounded-t-full overflow-hidden shadow-lg">
            <div className="w-full h-full bg-cover bg-center transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: "url('/images/p15.webp')" }}></div>
            </div>
            <h3 className="text-lg font-medium tracking-wide text-gray-800">Women</h3>
            <button className="underline text-[#D19E61] hover:text-[#A67B5B]">Shop Here</button>
          </div>
             
              {/* second image */}
          <div className="flex flex-col items-center space-y-4">
          <div className="aspect-[3/4] w-full max-w-md rounded-t-full overflow-hidden shadow-lg">
            <div className="w-full h-full bg-cover bg-center transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: "url('/images/Men.jfif')" }}></div>
           </div>
            <h3 className="text-lg font-medium tracking-wide text-gray-800">Men</h3>
            <button className="underline text-[#D19E61] hover:text-[#A67B5B]">Shop Here</button>
          </div>

           {/* third image */}
          <div className="flex flex-col items-center space-y-4">
          <div className="aspect-[3/4] w-full max-w-md rounded-t-full overflow-hidden shadow-lg">
            <div className="w-full h-full bg-cover bg-center transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: "url('/images/event.jfif')" }}></div>
            </div>
            <h3 className="text-lg font-medium tracking-wide text-gray-800">Events</h3>
            <button className="underline text-[#D19E61] hover:text-[#A67B5B]">Sign Up Here</button>
          </div>

        </div>
      </section>


      {/* Instagram / Featured Picks */}
      <section className="py-16 px-6 md:px-16 lg:px-32 bg-[#FAF8F5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className='space-y-6 max-w-[20rem] py-16 text-center'>
            <h2 className="text-3xl font-bold mb-6">As Seen on Instagram</h2>
            <p className="leading-relaxed text-lg ">
              Threads N Trends is your destination for boutique fashion with a personalized touch.
              Explore our curated collection every season, and follow us for the latest trends.
            </p>
            <Link href="Product">
            <button className="bg-[#D19E61] hover:bg-[#A67B5B] text-white px-6 py-3 mt-4 rounded-lg">
              Shop Now
            </button>
            </Link>
          </div>
          <div>
            <img
              src="/images/pp.jpg" // Update with actual path
              alt="Featured Picks"
              width={500}
              height={500}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </section>
    </div>
    
  );
}
