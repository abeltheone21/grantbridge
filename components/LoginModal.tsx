"use client";

import { useState } from "react";
import { FaTimes, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { name } }
        });
        if (error) throw error;
        // if email confirmation is on, they might need to confirm.
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Frosted Glass Modal */}
      <div className="relative z-10 w-full max-w-md">
        {/* Decorative glow behind modal */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#88914C]/10 via-transparent to-[#88914C]/10 rounded-3xl blur-2xl -z-10"></div>
        
        {/* Main card */}
        <div className="relative bg-[#FFFFFF]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/40 border border-[#E5E5E5]/30 p-6 sm:p-8">
          
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F7FAFC] border border-[#E5E5E5]/30 text-[#718096] hover:text-[#1A202C] hover:border-[#88914C]/40 transition-all"
          >
            <FaTimes size={14} />
          </button>

          {/* Logo */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-1">
            <img
            src="/har-impact-icon.png"
            alt="Har Impact"
            className="h-8 opacity-80"/>
            <span className="text-xl font-bold">
            <span className="text-[#1A202C]">Har </span>
            <span className="text-[#88914C]">Grant Plus</span>
            </span>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex bg-[#F7FAFC] rounded-xl p-1.5 mb-6 border border-[#E5E5E5]/20">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                isLogin 
                 ? "bg-[#38411C] text-[#FFFFFF] shadow-lg" 
                : "text-[#4A5568] hover:text-[#38411C]"
                  }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                !isLogin 
                 ? "bg-[#38411C] text-[#FFFFFF] shadow-lg" 
                 : "text-[#4A5568] hover:text-[#38411C]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs">
                {error}
              </div>
            )}
            
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#4A5568] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#E5E5E5]/30 rounded-xl text-[#1A202C] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#88914C] focus:border-transparent transition-all text-sm"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4A5568] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#E5E5E5]/30 rounded-xl text-[#1A202C] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#88914C] focus:border-transparent transition-all text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#4A5568] mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#E5E5E5]/30 rounded-xl text-[#1A202C] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#88914C] focus:border-transparent transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#38411C] text-[#FFFFFF] rounded-xl hover:bg-[#FFFFFF] hover:text-[#38411C] border border-[#38411C] transition-all font-bold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              {!loading && <FaArrowRight className="text-xs" />}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E5E5E5]/30"></div>
              <span className="text-xs text-[#718096]">or continue with</span>
              <div className="flex-1 h-px bg-[#E5E5E5]/30"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-[#F7FAFC] border border-[#E5E5E5]/30 text-[#1A202C] rounded-xl hover:bg-[#F7FAFC] hover:border-[#88914C]/40 transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
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

          {/* Toggle Link */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-[#4A5568] hover:text-[#88914C] transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-[#88914C] hover:text-[#38411C] font-medium">
                {isLogin ? "Sign up" : "Login"}
              </span>
            </button>
          </div>

          <p className="text-xs text-[#718096] text-center mt-4">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-[#88914C] transition-colors" onClick={onClose}>Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-[#88914C] transition-colors" onClick={onClose}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}