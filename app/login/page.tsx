"use client";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-10 rounded-2xl shadow w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-blue-600">
          GrantBridge
        </h1>

        <p className="text-center text-gray-500 mt-2">
          {isLogin ? "Welcome back" : "Create an account"}
        </p>

        {/* Toggle */}
        <div className="flex mt-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg ${
              isLogin ? "bg-white shadow text-gray-500" : "text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg ${
              !isLogin ? "bg-white shadow text-gray-500" : " text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="mt-6 space-y-4">
          
          {/* Only show name if SIGN UP */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3  border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 text-gray-800 focus:ring-blue-500"
          />

          {/* Button */}
          <Link
            href="/grants"
            className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <hr className="flex-1" />
            <span className="text-sm text-gray-400">or</span>
            <hr className="flex-1" />
          </div>

          {/* Google */}
          <Link
            href="/grants"
            className="block w-full text-center text-gray-400 py-3 border rounded-lg hover:bg-blue-50"
          >
            Continue with Google
          </Link>

        </div>

        {/* Footer */}
        <p className="text-sm text-center mt-6 text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-blue-600"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

      </div>
    </div>
    {/* SOCIAL MEDIA */}
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
    
          {/* FOOTER */}
          <footer className="bg-white border-t p-6 sm:p-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} GrantBridge. All rights reserved.
            </p>
          </footer>

    </>
    
  );
}