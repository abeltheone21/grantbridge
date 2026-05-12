"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import LoginModal from "@/components/LoginModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    }
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const publicLinks = [
    // the home page 
    //{ href: "/", label: "Home" },
    { href: "/grants", label: "Grants" },
    { href: "/contactus", label: "Contact Us" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FFFFFF]/95 backdrop-blur-lg shadow-lg shadow-black/30 border-b border-[#E5E5E5]/20"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
      <Link href="/grants" className="flex items-center gap-2 group">
  <img 
    src="/har-impact-logo.png" 
    alt="Har Impact" 
    className="h-10 opacity-80 group-hover:opacity-100 transition-opacity"
  />
  <span className="text-xl font-bold">
    <span className="text-[#1A202C]">Grant</span>
    <span className="text-[#88914C]">Bridge</span>
  </span>
</Link>

        <div className="hidden md:flex items-center space-x-1">
          {/* Public Links */}
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                isActive(link.href)
                  ? "text-[#88914C]"
                  : "text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F7FAFC]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-[#88914C] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {/* Dashboard - Only visible when logged in */}
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className={`relative px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                isActive("/dashboard")
                  ? "text-[#88914C]"
                  : "text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F7FAFC]"
              }`}
            >
              Dashboard
              {isActive("/dashboard") && (
                <motion.div
                  layoutId="activeNavDash"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-[#88914C] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          )}
          {/* Auth Buttons */ }
          <div className="pl-4 ml-4 border-l border-[#E5E5E5]/30">
            {isLoggedIn ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
                className="px-4 py-2 text-sm font-semibold text-[#4A5568] hover:text-[#1A202C] transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 text-sm font-semibold bg-[#88914C] text-[#FFFFFF] rounded-lg hover:bg-[#38411C] transition-colors shadow-lg shadow-[#88914C]/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-[#1A202C] hover:bg-[#F7FAFC] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            style={{ top: "65px" }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="md:hidden fixed left-0 right-0 bg-[#FFFFFF]/98 backdrop-blur-lg shadow-xl z-50 border-t border-[#E5E5E5]/20"
            style={{ top: "65px" }}
          >
            <div className="flex flex-col py-2">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-4 px-6 transition text-center font-medium ${
                    isActive(link.href)
                      ? "text-[#88914C] bg-[#88914C]/5"
                      : "text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F7FAFC]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Dashboard - Only in mobile when logged in */}
              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`py-4 px-6 transition text-center font-medium ${
                    isActive("/dashboard")
                      ? "text-[#88914C] bg-[#88914C]/5"
                      : "text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F7FAFC]"
                  }`}
                >
                  Dashboard
                </Link>
              )}
              {/* Auth Buttons Mobile */}
              <div className="py-4 px-6 border-t border-[#E5E5E5]/20 mt-2 text-center">
                {isLoggedIn ? (
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setIsOpen(false);
                    }}
                    className="w-full py-2 text-[#4A5568] hover:text-[#1A202C] font-medium"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full py-3 bg-[#88914C] text-[#FFFFFF] rounded-xl font-bold"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Dynamic import of LoginModal or we can just import it at the top */}
    </nav>
      {isLoginModalOpen && (
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      )}
    </>
  );
}