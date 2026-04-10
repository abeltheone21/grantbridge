"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="p-4 shadow bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* LOGO */}
        <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          GrantBridge
        </div>

        {/* all the pages that are on the navbar*/}
        <div className="hidden md:flex space-x-10 text-gray-600 dark:text-gray-300">
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
          <Link href="/login" className="hover:text-blue-500 transition">Login</Link>
          <Link href="/dashboard" className="hover:text-blue-500 transition">Dashboard</Link>
          <Link href="/grants" className="hover:text-blue-500 transition">Grants</Link>
          <Link href="/contactus" className="hover:text-blue-500 transition">Contact Us</Link>
        </div>

        {/* the three bar menue for phone */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-3xl text-gray-600 focus:outline-none">
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            style={{ top: '73px' }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="md:hidden fixed left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50" style={{ top: '73px' }}>
            <div className="flex flex-col py-2">
              <Link href="/" onClick={() => setIsOpen(false)} className="py-4 px-6 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-center">Home</Link>
              <Link href="/login" onClick={() => setIsOpen(false)} className="py-4 px-6 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-center">Login</Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="py-4 px-6 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-center">Dashboard</Link>
              <Link href="/grants" onClick={() => setIsOpen(false)} className="py-4 px-6 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-center">Grants</Link>
              <Link href="/contactus" onClick={() => setIsOpen(false)} className="py-4 px-6 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-center">Contact Us</Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}