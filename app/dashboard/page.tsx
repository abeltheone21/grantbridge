"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaSearch, FaBookmark, FaFileAlt, FaSignOutAlt, FaArrowRight } from "react-icons/fa";
import { supabase } from "@/lib/supabase/client";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGrants: 0,
    savedSearches: 0,
    applications: 0,
  });

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/?login=true");
        return;
      }
      
      setUser(user);
      await fetchUserData(user.id);
      setLoading(false);
    }
    
    checkUser();
  }, [router]);

  async function fetchUserData(userId: string) {
    try {
      // Get total grants
      const { count: grantCount } = await supabase
        .from('grants')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Get saved searches count
      const { count: searchCount } = await supabase
        .from('saved_searches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      setStats({
        totalGrants: grantCount || 0,
        savedSearches: searchCount || 0,
        applications: 0, // TODO: Add applications table
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#88914C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A202C]">
              Welcome back
            </h1>
            <p className="text-[#4A5568] text-sm mt-1">{user?.email}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition text-sm flex items-center gap-2"
          >
            <FaSignOutAlt className="text-xs" />
            Sign Out
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5E5]/20 hover:border-[#88914C]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#88914C]/30 rounded-xl flex items-center justify-center">
                <FaFileAlt className="text-[#88914C]" />
              </div>
              <span className="text-3xl font-bold text-[#88914C]">{stats.totalGrants}</span>
            </div>
            <h3 className="text-[#1A202C] font-semibold text-sm">Total Grants</h3>
            <p className="text-[#4A5568] text-xs mt-1">Available opportunities</p>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5E5]/20 hover:border-[#88914C]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#88914C]/30 rounded-xl flex items-center justify-center">
                <FaBookmark className="text-[#88914C]" />
              </div>
              <span className="text-3xl font-bold text-[#88914C]">{stats.savedSearches}</span>
            </div>
            <h3 className="text-[#1A202C] font-semibold text-sm">Saved Searches</h3>
            <p className="text-[#4A5568] text-xs mt-1">Your saved filters</p>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5E5]/20 hover:border-[#88914C]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#88914C]/30 rounded-xl flex items-center justify-center">
                <FaFileAlt className="text-[#88914C]" />
              </div>
              <span className="text-3xl font-bold text-[#88914C]">{stats.applications}</span>
            </div>
            <h3 className="text-[#1A202C] font-semibold text-sm">Applications</h3>
            <p className="text-[#4A5568] text-xs mt-1">Submitted applications</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/grants"
            className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5E5]/20 hover:border-[#88914C]/30 hover:bg-[#F7FAFC] transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="w-10 h-10 bg-[#88914C]/10 rounded-xl flex items-center justify-center mb-3">
                  <FaSearch className="text-[#88914C]" />
                </div>
                <h3 className="text-[#1A202C] font-bold text-lg mb-1">Browse Grants</h3>
                <p className="text-[#4A5568] text-sm">Explore available funding opportunities</p>
              </div>
              <FaArrowRight className="text-[#88914C] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/grants"
            className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5E5]/20 hover:border-[#88914C]/30 hover:bg-[#F7FAFC] transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="w-10 h-10 bg-[#88914C]/10 rounded-xl flex items-center justify-center mb-3">
                  <FaBookmark className="text-[#88914C]" />
                </div>
                <h3 className="text-[#1A202C] font-bold text-lg mb-1">Saved Searches</h3>
                <p className="text-[#4A5568] text-sm">View and manage your saved filters</p>
              </div>
              <FaArrowRight className="text-[#88914C] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
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