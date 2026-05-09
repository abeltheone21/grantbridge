"use client";

import { useState } from "react";
import { FaTimes, FaArrowRight } from "react-icons/fa";

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
  
  // Need supabase client
  const { supabase } = require("@/lib/supabase/client");

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
        <div className="absolute inset-0 bg-gradient-to-br from-[#C6A15B]/10 via-transparent to-[#3F4F24]/10 rounded-3xl blur-2xl -z-10"></div>
        
        {/* Main card */}
        <div className="relative bg-[#1C2117]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/40 border border-[#4E5B2A]/30 p-6 sm:p-8">
          
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#12150F] border border-[#4E5B2A]/30 text-[#6C6F66] hover:text-[#E7E4D8] hover:border-[#C6A15B]/40 transition-all"
          >
            <FaTimes size={14} />
          </button>

          {/* Logo */}
          <div className="text-center mb-5">
            <span className="text-xl font-bold">
              <span className="text-[#E7E4D8]">Grant</span>
              <span className="text-[#C6A15B]">Bridge</span>
            </span>
          </div>

          {/* Toggle */}
          <div className="flex bg-[#12150F] rounded-xl p-1.5 mb-6 border border-[#4E5B2A]/20">
            <button
              type="button"
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
              type="button"
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs">
                {error}
              </div>
            )}
            
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#A6A99F] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#12150F] border border-[#4E5B2A]/30 rounded-xl text-[#E7E4D8] placeholder-[#6C6F66] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent transition-all text-sm"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#A6A99F] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#12150F] border border-[#4E5B2A]/30 rounded-xl text-[#E7E4D8] placeholder-[#6C6F66] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent transition-all text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#A6A99F] mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#12150F] border border-[#4E5B2A]/30 rounded-xl text-[#E7E4D8] placeholder-[#6C6F66] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C6A15B] text-[#12150F] rounded-xl hover:bg-[#d4b46d] transition-all font-bold text-sm shadow-lg shadow-[#C6A15B]/20 hover:shadow-xl hover:shadow-[#C6A15B]/30 inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              {!loading && <FaArrowRight className="text-xs" />}
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
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-[#12150F] border border-[#4E5B2A]/30 text-[#E7E4D8] rounded-xl hover:bg-[#242A1D] hover:border-[#C6A15B]/40 transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
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
              className="text-sm text-[#A6A99F] hover:text-[#C6A15B] transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-[#C6A15B] hover:text-[#d4b46d] font-medium">
                {isLogin ? "Sign up" : "Login"}
              </span>
            </button>
          </div>

          <p className="text-xs text-[#6C6F66] text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}