import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaRuler, FaUserCheck, FaTshirt } from "react-icons/fa";
import Link from "next/link";

const services = [
  { title: "Online Measurement", icon: <FaRuler size={50} />, description: "Accurate online measurement services for a perfect fit." },
];

const measurementSteps = [
  { title: "Step 1: Provide Basic Info", icon: <FaUserCheck size={40} />, description: "Enter your height, weight, and body type details." },
  { title: "Step 2: Take Measurements", icon: <FaTshirt size={40} />, description: "Follow our guided process to measure key body parts." },
  { title: "Step 3: Confirm & Submit", icon: <FaTshirt size={40} />, description: "Review your measurements and submit them for processing." }
];

export default function TailorServices() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white text-gray-700">
      {/* Hero Section */}
      <header className="relative w-full bg-rosy_pink  py-32 text-center text-gray-700 shadow-lg flex flex-col items-center">
        <h1 className="text-6xl font-light mb-4 opacity-50  text-black animate-fadeIn">
          Get Measured Online
        </h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto  animate-fadeIn delay-300">
          Experience precise, hassle-free measurements from your home with our expert-guided process.
        </p>
      </header>
      
      {/* Service Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center bg-white">
        <h2 className="text-5xl font-semibold text-gray-800 mb-6 opacity-70 animate-fadeIn">
          Our Tailoring Service
        </h2>
        <p className="text-lg text-gray-600 mb-12 opacity-0 animate-fadeIn delay-300">
          Simple, efficient, and accurate measurements tailored to you.
        </p>
        
        <div className="flex justify-center mt-8 ">
          <div className="transform transition duration-500 hover:scale-105">
            <Card className="p-8 bg-white shadow-xl rounded-2xl hover:shadow-2xl border-l-8 border-[#D1B09D] flex flex-col items-center">
              <CardHeader className="text-[#D1B09D] text-6xl">{services[0].icon}</CardHeader>
              <CardContent>
                <CardTitle className="text-3xl font-medium mb-4">{services[0].title}</CardTitle>
                <p className="text-gray-600 text-lg">{services[0].description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Measurement Process Section */}
      <section className="bg-rosy_pink  py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-light text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {measurementSteps.map((step, index) => (
              <Card key={index} className="p-8 bg-white shadow-md rounded-lg flex flex-col items-center transform transition hover:scale-105">
                <CardHeader className="text-[#D1B09D] text-5xl mb-4">{step.icon}</CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-semibold mb-2">{step.title}</CardTitle>
                  <p className="text-gray-700 text-lg">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative bg-white text-gray-700 py-20 text-center">
        <h2 className="text-5xl font-light mb-6">
          Start Your Measurement
        </h2>
        <p className="text-xl mb-8 max-w-xl mx-auto">
          Click below to begin your precise measurement process with ease.
        </p>
        <div>
         <Link href="/auth/measurement"> <Button className="bg-light_brown text-gray-700 px-10 py-4 text-lg font-medium rounded-full shadow-lg hover:bg-gray-100 transition-all">
            Get Started
          </Button> </Link>
        </div>
      </section>
    </div>
  );
}
