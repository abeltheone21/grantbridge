"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  const text: string = "Welcome to GrantBridge";
  const [displayText, setDisplayText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [loopNum, setLoopNum] = useState<number>(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout; 
    
    let interval: NodeJS.Timeout;
    const handleTyping = () => {
      let i: number = isDeleting ? text.length : 0;
      if (!isDeleting) {
        // Typing effect
        interval = setInterval(() => {
          setDisplayText(text.slice(0, i + 1));
          i++;

          if (i > text.length) {
            clearInterval(interval);
            // Wait 10 seconds before starting to delete
            timeout= setTimeout(() => {
              setIsDeleting(true);
            }, 10000);
          }
        }, 80);
      } else {
        // Deleting effect
        interval = setInterval(() => {
          setDisplayText(text.slice(0, i - 1));
          i--;

          if (i === 0) {
            clearInterval(interval);
            setIsDeleting(false);
            setLoopNum(prev=>prev+1);
          }
        }, 50);
      }
    };

    handleTyping();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    }
  }, [isDeleting]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
     
     {/* Hero Section landing page "what the user first lands on" */}
<div className="relative w-full min-h-[600px] sm:min-h-[700px] flex items-start pt-16 sm:pt-24 lg:pt-28">
  
  
  <div className="absolute inset-0 w-full h-full">
    <Image
      src="/landing.jpg"
      alt="African landscape"
      fill
      className="object-cover"
      priority
    />
    
    <div className="absolute inset-0 bg-gradient-to-r from-[#0D1626] via-[#0D1626]/40 to-transparent"></div>
  </div>

  <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
    <div className="max-w-4xl mx-auto text-center lg:text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto lg:mx-0 min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem] drop-shadow-lg">
        {displayText}
        <span className="animate-pulse">|</span>
      </h1>

      <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-white/90 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto lg:mx-0 drop-shadow-md">
        Discover and apply for grants across Africa. Empower your organization
        with funding opportunities.
      </p>

      <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col xs:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md mx-auto lg:mx-0">
        <Link
          href="/login"
          className="w-full xs:w-auto px-6 py-3 bg-white text-[#0D1626] rounded-full hover:bg-blue-50 transition text-sm sm:text-base text-center font-semibold"
        >
          Get Started
        </Link>

        <Link
          href="/grants"
          className="w-full xs:w-auto px-6 py-3 border-2 border-white text-white rounded-full hover:bg-white/10 transition text-sm sm:text-base text-center font-semibold"
        >
          Explore Grants
        </Link>
      </div>
    </div>
  </div>
</div>

      {/* About section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
          About GrantBridge
        </h2>

        <p className="text-center text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4">
          GrantBridge is a platform designed to help NGOs, startups, and organizations
          across Ethiopia and Africa easily discover and apply for funding opportunities.
          We simplify access to grants and connect innovators with global funding bodies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mt-8 sm:mt-12 px-4 sm:px-0">
          {/* Mission Card */}
          <div className="text-center p-5 sm:p-6 border rounded-xl bg-white shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md hover:border-blue-300">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Our Mission</h3>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">
              Make funding accessible to every organization.
            </p>
          </div>

          {/* Vision Card */}
          <div className="text-center p-5 sm:p-6 border rounded-xl bg-white shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md hover:border-blue-300">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Our Vision</h3>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">
              Empower African innovation through funding access.
            </p>
          </div>

          {/* Impact Card */}
          <div className="text-center p-5 sm:p-6 border rounded-xl bg-white shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md hover:border-blue-300">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Our Impact</h3>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">
              Connecting thousands of projects with global support.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-10">
          Why GrantBridge?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="p-5 sm:p-6 bg-gray-50 rounded-xl hover:shadow transition">
            <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
              Smart Grant Discovery
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Find funding opportunities tailored to your sector and region.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-gray-50 rounded-xl hover:shadow transition">
            <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
              Simple Application Flow
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Apply easily with a guided and simple process.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-gray-50 rounded-xl hover:shadow transition">
            <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
              Africa-Focused Impact
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Built for NGOs and organizations across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-10">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow hover:shadow-md transition text-center">
            <div className="text-blue-600 text-xl sm:text-2xl font-bold mb-2">1</div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Browse Grants</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Explore available funding opportunities.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow hover:shadow-md transition text-center">
            <div className="text-blue-600 text-xl sm:text-2xl font-bold mb-2">2</div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Filter Results</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Narrow down by sector, funding, and region.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow hover:shadow-md transition text-center">
            <div className="text-blue-600 text-xl sm:text-2xl font-bold mb-2">3</div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">View Details</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Open full grant information.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow hover:shadow-md transition text-center">
            <div className="text-blue-600 text-xl sm:text-2xl font-bold mb-2">4</div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Apply</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Sign in and submit your application.
            </p>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA  icons */}
      <section className="bg-white py-8 sm:py-10 border-t">
        <div className="text-center px-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
            Connect With Us
          </h2>

          <div className="flex justify-center gap-6 sm:gap-8 text-xl sm:text-2xl">
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-600 transition transform hover:scale-110"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>

            <a 
              href="#" 
              className="text-gray-600 hover:text-sky-500 transition transform hover:scale-110"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-700 transition transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a 
              href="#" 
              className="text-gray-600 hover:text-pink-500 transition transform hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
            Empowering African organizations through funding opportunities.
          </p>
        </div>
      </section>

      {/* the footer */}
      <footer className="bg-white border-t p-6 sm:p-8 text-center">
        <p className="text-gray-500 text-xs sm:text-sm">
          © {new Date().getFullYear()} GrantBridge. All rights reserved.
        </p>
      </footer>
    </div>
  );
}