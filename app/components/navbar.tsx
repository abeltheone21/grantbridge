"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    { href: "/", label: "Home" },
    { href: "/grants", label: "Grants" },
    { href: "/contactus", label: "Contact Us" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#12150F]/95 backdrop-blur-lg shadow-lg shadow-black/30 border-b border-[#4E5B2A]/20"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold">
            <span className="text-[#E7E4D8]">Grant</span>
            <span className="text-[#C6A15B]">Bridge</span>
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
                  ? "text-[#C6A15B]"
                  : "text-[#A6A99F] hover:text-[#E7E4D8] hover:bg-[#1C2117]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-[#C6A15B] rounded-full"
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
                  ? "text-[#C6A15B]"
                  : "text-[#A6A99F] hover:text-[#E7E4D8] hover:bg-[#1C2117]"
              }`}
            >
              Dashboard
              {isActive("/dashboard") && (
                <motion.div
                  layoutId="activeNavDash"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-[#C6A15B] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-[#E7E4D8] hover:bg-[#1C2117] transition-colors"
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
            className="md:hidden fixed left-0 right-0 bg-[#12150F]/98 backdrop-blur-lg shadow-xl z-50 border-t border-[#4E5B2A]/20"
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
                      ? "text-[#C6A15B] bg-[#C6A15B]/5"
                      : "text-[#A6A99F] hover:text-[#E7E4D8] hover:bg-[#1C2117]"
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
                      ? "text-[#C6A15B] bg-[#C6A15B]/5"
                      : "text-[#A6A99F] hover:text-[#E7E4D8] hover:bg-[#1C2117]"
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}