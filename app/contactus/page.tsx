"use client";

import { useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPaperPlane, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add your form submission logic here
    console.log({ name, email, message });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#38411C]/10 rounded-full text-[#38411C] text-xs font-semibold tracking-wider uppercase mb-4">
              Get In Touch
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1A202C] mb-3">
              Contact Us
            </h1>
            <p className="text-[#4A5568] max-w-md mx-auto">
              Have a question or need help? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Contact Info Cards */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E5E5E5]/20">
                <div className="w-10 h-10 bg-[#38411C]/10 rounded-xl flex items-center justify-center mb-3">
                  <FaEnvelope className="text-[#38411C]" />
                </div>
                <h3 className="text-[#1A202C] font-semibold text-sm">Email</h3>
                
              </div>

              <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E5E5E5]/20">
                <div className="w-10 h-10 bg-[#38411C]/10 rounded-xl flex items-center justify-center mb-3">
                  <FaMapMarkerAlt className="text-[#38411C]" />
                </div>
                <h3 className="text-[#1A202C] font-semibold text-sm">Location</h3>
               
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E5E5E5]/20"
              >
                {submitted ? (
                  <div className="text-center py-8">
                    
                    <h3 className="text-xl font-bold text-[#38411C] mb-2">Message Sent!</h3>
                    <p className="text-[#4A5568] text-sm">We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#4A5568] mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#E5E5E5]/30 rounded-xl text-[#1A202C] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#38411C] focus:border-transparent transition-all text-sm"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#4A5568] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#E5E5E5]/30 rounded-xl text-[#1A202C] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#38411C] focus:border-transparent transition-all text-sm"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-[#4A5568] mb-1.5">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#E5E5E5]/30 rounded-xl text-[#1A202C] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#38411C] focus:border-transparent transition-all text-sm h-32 resize-none"
                        placeholder="Tell us how we can help..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#38411C] text-[#FFFFFF] rounded-xl hover:bg-[#FFFFFF] hover:text-[#38411C] border border-[#38411C] transition-all font-bold text-sm inline-flex items-center justify-center gap-2"
                    >
                      <FaPaperPlane className="text-xs" />
                      Send Message
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5]/10 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[#1A202C] font-bold text-lg">
              Har <span className="text-[#88914C]">Grant Plus</span>
          </span>
        </div>

        <div className="flex justify-center gap-5 text-lg mb-4">
          <a href="#" className="text-[#718096] hover:text-[#38411C] transition-colors" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="#" className="text-[#718096] hover:text-[#38411C] transition-colors" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="#" className="text-[#718096] hover:text-[#38411C] transition-colors" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="#" className="text-[#718096] hover:text-[#38411C] transition-colors" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>

        <p className="text-[#718096] text-sm">
          <img src="/har-impact-logo.png" 
          alt="Har Impact - Potential Made Real" 
          className="h-14 mx-auto mb-3 opacity-70 hover:opacity-100 transition-opacity"
/>

          © {new Date().getFullYear()} Har Grant plus. All rights reserved.
        </p>
      </footer>
    </div>
  );
}