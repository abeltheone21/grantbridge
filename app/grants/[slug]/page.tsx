"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase/client";
import LoginModal from "@/components/LoginModal";
import Link from "next/link";
import { FaArrowLeft, FaCheckCircle, FaLock, FaExternalLinkAlt } from "react-icons/fa";

interface GrantDetail {
  id: string;
  title: string;
  teaser: string;
  full_description?: string;
  eligibility_summary?: string;
  eligibility_checklist?: any;
  max_amount?: number;
  currency: string;
  location?: string;
  deadline?: string;
  status: string;
  image?: string | null;
  application_link?: string;
  slug: string;
}

export default function GrantDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [grant, setGrant] = useState<GrantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchGrantDetails();
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchGrantDetails();
    });

    return () => subscription.unsubscribe();
  }, [slug]);

  async function fetchGrantDetails() {
    setLoading(true);
    try {
      // Try to fetch full details first (RLS will filter this if not authenticated)
      const { data, error } = await supabase
        .from('grants')
        .select('*')
        .eq('slug', slug)
        .not('published_at', 'is', null)
        .maybeSingle();

      if (data) {
        setGrant(data as GrantDetail);
        setRequiresAuth(false);
      } else {
        // If no data, try to fetch from public view (teaser only)
        const { data: publicData, error: publicError } = await supabase
          .from('public_grants')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (publicData) {
          setGrant(publicData as GrantDetail);
          setRequiresAuth(true);
        } else {
          throw new Error("Grant not found or access denied");
        }
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getImageUrl(image: any): string {
    if (!image) return '';
    return image;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#88914C]"></div>
      </div>
    );
  }

  if (error || !grant) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex flex-col items-center justify-center p-4">
        <p className="text-red-400 text-xl mb-4">{error || "Grant not found"}</p>
        <Link href="/grants" className="text-[#88914C] hover:underline">← Back to Grants</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] pt-20 pb-20">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/grants" className="inline-flex items-center text-[#4A5568] hover:text-[#88914C] mb-8 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Grants
        </Link>

        {/* Hero Section */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5]/20 overflow-hidden mb-8">
          {grant.image && (
            <div className="h-64 sm:h-80 w-full relative">
              <img src={getImageUrl(grant.image)} alt={grant.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] to-transparent"></div>
            </div>
          )}
          
          <div className={`p-8 sm:p-10 ${grant.image ? '-mt-20 relative z-10' : ''}`}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-xs rounded-full font-semibold ${grant.status === 'active' ? 'bg-[#88914C]/30 text-[#88914C]' : 'bg-[#E5E5E5]/10 text-[#4A5568]'}`}>
                {grant.status === 'active' ? 'Open' : grant.status === 'urgent' ? 'Urgent' : 'Closed'}
              </span>
              {grant.location && (
                <span className="px-3 py-1 bg-[#F7FAFC] text-[#4A5568] text-xs rounded-full border border-[#E5E5E5]/30">
                  {grant.location}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A202C] mb-6 leading-tight">
              {grant.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F7FAFC] p-6 rounded-xl border border-[#E5E5E5]/20">
              <div>
                <p className="text-[#718096] text-xs uppercase tracking-wider mb-1">Funding Amount</p>
                <p className="text-[#88914C] text-xl font-bold">
                  {grant.max_amount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: grant.currency || 'USD', minimumFractionDigits: 0 }).format(grant.max_amount) : 'Variable'}
                </p>
              </div>
              <div>
                <p className="text-[#718096] text-xs uppercase tracking-wider mb-1">Deadline</p>
                <p className="text-[#1A202C] text-xl font-bold">
                  {grant.deadline ? new Date(grant.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Deadline'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5]/20 p-8">
              <h2 className="text-xl font-bold text-[#1A202C] mb-4">Summary</h2>
              <p className="text-[#4A5568] leading-relaxed text-lg">{grant.teaser}</p>
            </div>

            {requiresAuth ? (
              <div className="bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF]/50 rounded-2xl border border-[#88914C]/30 p-8 text-center relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-[#88914C]/5">
                  <FaLock size={150} />
                </div>
                <FaLock className="text-[#88914C] text-4xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#1A202C] mb-2">Unlock Full Details</h3>
                <p className="text-[#4A5568] mb-8 max-w-md mx-auto">
                  Sign in or create a free account to view full eligibility criteria, detailed descriptions, and apply directly.
                </p>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                 
                  className="px-8 py-4 bg-[#38411C] text-[#FFFFFF] rounded-xl hover:bg-[#FFFFFF] hover:text-[#38411C] border border-[#38411C] transition-all font-bold text-lg inline-block"
                >
                  Sign In to Access
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5]/20 p-8 prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold text-[#1A202C] mb-4">Full Description</h2>
                  <div className="text-[#4A5568] leading-relaxed whitespace-pre-wrap">
                    {grant.full_description}
                  </div>
                </div>

                {grant.eligibility_summary && (
                  <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5]/20 p-8">
                    <h2 className="text-xl font-bold text-[#1A202C] mb-4">Eligibility</h2>
                    <p className="text-[#4A5568] leading-relaxed">{grant.eligibility_summary}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {!requiresAuth && grant.application_link && (
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5]/20 p-6">
                <h3 className="text-lg font-bold text-[#1A202C] mb-4">Ready to apply?</h3>
                <a
                  href={grant.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#38411C] text-[#FFFFFF] rounded-xl hover:bg-[#FFFFFF] hover:text-[#38411C] border border-[#38411C] transition-all font-bold text-lg"
                >
                  Apply Externally <FaExternalLinkAlt className="text-sm" />
                </a>
              </div>
            )}
            
            {!requiresAuth && (
               <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5]/20 p-6">
                  <h3 className="text-lg font-bold text-[#1A202C] mb-4">Submit Application</h3>
                  <p className="text-xs text-[#4A5568] mb-4">
                     Apply directly through GrantBridge by providing a statement of support.
                  </p>
                  <Link href={`/grants/${grant.slug}/apply`} className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-[#88914C] text-[#88914C] rounded-xl hover:bg-[#88914C]/10 transition-all font-bold text-sm">
                     Write Statement
                  </Link>
               </div>
            )}

            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5]/20 p-6">
              <h3 className="text-sm font-bold text-[#1A202C] uppercase tracking-wider mb-4">Share this Grant</h3>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-[#F7FAFC] text-[#38411C] hover:bg-[#38411C] hover:text-[#FFFFFF] border border-[#38411C] rounded-lg text-sm transition-all font-medium">Copy Link</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
