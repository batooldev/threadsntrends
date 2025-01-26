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
            <p className="text-lg leading-relaxed">
              Located in the heart of style and elegance, Threads N Trends offers a handpicked selection
              of tailored fashion and boutique collections. Discover our finest designs crafted for
              individuality and timeless beauty.
            </p>
            <Link href="Product">
            <button className="bg-[#D19E61] hover:bg-[#A67B5B] text-white px-6 py-3 rounded-lg shadow-md mt-2">
              Shop Now
            </button>
            </Link>
          </div>
          <div className='w-full h-full'>
            <img
              src="/images/pp.jpg" // Update with actual path
              alt="Tailored Display"
              // width={500}
              // height={500}
              className="rounded-lg shadow-lg h-[800px] w-full"
            />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <div className="relative s">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-16 lg:px-32">
          <div className="flex flex-col items-center space-y-4">
            <img src="/images/AB.jpeg" alt="Fashion" width={300} height={300} className="rounded-full" />
            <h3 className="text-xl font-semibold">Women</h3>
            <button className="underline text-[#D19E61] hover:bg-[#A67B5B]">Shop Here</button>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <img src="/images/AB.jpeg" alt="Home Decor" width={300} height={300} className="rounded-full" />
            <h3 className="text-xl font-semibold">Men</h3>
            <button className="underline text-[#D19E61] hover:bg-[#A67B5B]">Shop Here</button>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <img src="/images/AB.jpeg" alt="Events" width={300} height={300} className="rounded-full" />
            <h3 className="text-xl font-semibold">Events</h3>
            <button className="underline text-[#D19E61] hover:bg-[#A67B5B]">Sign Up Here</button>
          </div>
        </div>
      </section>

      {/* Instagram / Featured Picks */}
      <section className="py-16 px-6 md:px-16 lg:px-32 bg-[#FAF8F5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
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
              src="/images/AB.jpeg" // Update with actual path
              alt="Featured Picks"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
    
  );
}
