"use client";

import { useState } from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#12150F] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Frosted Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          {/* Glass effect card */}
          <div className="relative z-10 bg-[#1C2117]/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[#4E5B2A]/30 shadow-2xl shadow-black/40">
            
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold">
                  <span className="text-[#E7E4D8]">Grant</span>
                  <span className="text-[#C6A15B]">Bridge</span>
                </span>
              </div>
              <p className="text-[#A6A99F] text-sm">
                {isLogin ? "Welcome back to your funding journey" : "Start discovering grants today"}
              </p>
            </div>

            {/* Toggle */}
            <div className="flex bg-[#12150F] rounded-xl p-1.5 mb-6 border border-[#4E5B2A]/20">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isLogin 
                    ? "bg-[#C6A15B] text-[#12150F] shadow-lg shadow-[#C6A15B]/20" 
                    : "text-[#A6A99F] hover:text-[#E7E4D8]"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  !isLogin 
                    ? "bg-[#C6A15B] text-[#12150F] shadow-lg shadow-[#C6A15B]/20" 
                    : "text-[#A6A99F] hover:text-[#E7E4D8]"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-[#12150F] border border-[#4E5B2A]/30 rounded-xl text-[#E7E4D8] placeholder-[#6C6F66] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent transition-all text-sm"
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-[#12150F] border border-[#4E5B2A]/30 rounded-xl text-[#E7E4D8] placeholder-[#6C6F66] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent transition-all text-sm"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-[#12150F] border border-[#4E5B2A]/30 rounded-xl text-[#E7E4D8] placeholder-[#6C6F66] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent transition-all text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#C6A15B] text-[#12150F] rounded-xl hover:bg-[#d4b46d] transition-all font-bold text-sm shadow-lg shadow-[#C6A15B]/20 hover:shadow-xl hover:shadow-[#C6A15B]/30 inline-flex items-center justify-center gap-2"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <FaArrowRight className="text-xs" />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#4E5B2A]/30"></div>
                <span className="text-xs text-[#6C6F66]">or continue with</span>
                <div className="flex-1 h-px bg-[#4E5B2A]/30"></div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full py-3 bg-[#12150F] border border-[#4E5B2A]/30 text-[#E7E4D8] rounded-xl hover:bg-[#242A1D] hover:border-[#C6A15B]/40 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Footer Toggle */}
            <p className="text-sm text-center mt-6 text-[#A6A99F]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-[#C6A15B] hover:text-[#d4b46d] font-medium transition-colors"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>

          {/* Decorative glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#C6A15B]/10 via-transparent to-[#3F4F24]/10 rounded-3xl blur-2xl -z-10"></div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-[#4E5B2A]/10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[#E7E4D8] font-bold text-lg">
            Grant<span className="text-[#C6A15B]">Bridge</span>
          </span>
        </div>

        <div className="flex justify-center gap-5 text-lg mb-4">
          <a href="#" className="text-[#6C6F66] hover:text-[#C6A15B] transition-colors" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="#" className="text-[#6C6F66] hover:text-[#C6A15B] transition-colors" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="#" className="text-[#6C6F66] hover:text-[#C6A15B] transition-colors" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="#" className="text-[#6C6F66] hover:text-[#C6A15B] transition-colors" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>

        <p className="text-[#6C6F66] text-sm">
          © {new Date().getFullYear()} GrantBridge. All rights reserved.
        </p>
      </footer>
    </div>
  );
}