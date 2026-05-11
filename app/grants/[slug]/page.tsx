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
      <div className="min-h-screen bg-[#12150F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C6A15B]"></div>
      </div>
    );
  }

  if (error || !grant) {
    return (
      <div className="min-h-screen bg-[#12150F] flex flex-col items-center justify-center p-4">
        <p className="text-red-400 text-xl mb-4">{error || "Grant not found"}</p>
        <Link href="/grants" className="text-[#C6A15B] hover:underline">← Back to Grants</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12150F] pt-20 pb-20">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/grants" className="inline-flex items-center text-[#A6A99F] hover:text-[#C6A15B] mb-8 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Grants
        </Link>

        {/* Hero Section */}
        <div className="bg-[#1C2117] rounded-2xl border border-[#4E5B2A]/20 overflow-hidden mb-8">
          {grant.image && (
            <div className="h-64 sm:h-80 w-full relative">
              <img src={getImageUrl(grant.image)} alt={grant.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C2117] to-transparent"></div>
            </div>
          )}
          
          <div className={`p-8 sm:p-10 ${grant.image ? '-mt-20 relative z-10' : ''}`}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-xs rounded-full font-semibold ${grant.status === 'active' ? 'bg-[#3F4F24]/30 text-[#C6A15B]' : 'bg-[#4E5B2A]/10 text-[#A6A99F]'}`}>
                {grant.status === 'active' ? 'Open' : grant.status === 'urgent' ? 'Urgent' : 'Closed'}
              </span>
              {grant.location && (
                <span className="px-3 py-1 bg-[#12150F] text-[#A6A99F] text-xs rounded-full border border-[#4E5B2A]/30">
                  {grant.location}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E7E4D8] mb-6 leading-tight">
              {grant.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#12150F] p-6 rounded-xl border border-[#4E5B2A]/20">
              <div>
                <p className="text-[#6C6F66] text-xs uppercase tracking-wider mb-1">Funding Amount</p>
                <p className="text-[#C6A15B] text-xl font-bold">
                  {grant.max_amount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: grant.currency || 'USD', minimumFractionDigits: 0 }).format(grant.max_amount) : 'Variable'}
                </p>
              </div>
              <div>
                <p className="text-[#6C6F66] text-xs uppercase tracking-wider mb-1">Deadline</p>
                <p className="text-[#E7E4D8] text-xl font-bold">
                  {grant.deadline ? new Date(grant.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Deadline'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1C2117] rounded-2xl border border-[#4E5B2A]/20 p-8">
              <h2 className="text-xl font-bold text-[#E7E4D8] mb-4">Summary</h2>
              <p className="text-[#A6A99F] leading-relaxed text-lg">{grant.teaser}</p>
            </div>

            {requiresAuth ? (
              <div className="bg-gradient-to-r from-[#1C2117] to-[#1C2117]/50 rounded-2xl border border-[#C6A15B]/30 p-8 text-center relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-[#C6A15B]/5">
                  <FaLock size={150} />
                </div>
                <FaLock className="text-[#C6A15B] text-4xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#E7E4D8] mb-2">Unlock Full Details</h3>
                <p className="text-[#A6A99F] mb-8 max-w-md mx-auto">
                  Sign in or create a free account to view full eligibility criteria, detailed descriptions, and apply directly.
                </p>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-8 py-4 bg-[#C6A15B] text-[#12150F] rounded-xl hover:bg-[#d4b46d] transition-all font-bold text-lg shadow-lg hover:shadow-xl inline-block"
                >
                  Sign In to Access
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#1C2117] rounded-2xl border border-[#4E5B2A]/20 p-8 prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold text-[#E7E4D8] mb-4">Full Description</h2>
                  <div className="text-[#A6A99F] leading-relaxed whitespace-pre-wrap">
                    {grant.full_description}
                  </div>
                </div>

                {grant.eligibility_summary && (
                  <div className="bg-[#1C2117] rounded-2xl border border-[#4E5B2A]/20 p-8">
                    <h2 className="text-xl font-bold text-[#E7E4D8] mb-4">Eligibility</h2>
                    <p className="text-[#A6A99F] leading-relaxed">{grant.eligibility_summary}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {!requiresAuth && grant.application_link && (
              <div className="bg-[#1C2117] rounded-2xl border border-[#4E5B2A]/20 p-6">
                <h3 className="text-lg font-bold text-[#E7E4D8] mb-4">Ready to apply?</h3>
                <a
                  href={grant.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#C6A15B] text-[#12150F] rounded-xl hover:bg-[#d4b46d] transition-all font-bold text-lg"
                >
                  Apply Externally <FaExternalLinkAlt className="text-sm" />
                </a>
              </div>
            )}
            
            {!requiresAuth && (
               <div className="bg-[#1C2117] rounded-2xl border border-[#4E5B2A]/20 p-6">
                  <h3 className="text-lg font-bold text-[#E7E4D8] mb-4">Submit Application</h3>
                  <p className="text-xs text-[#A6A99F] mb-4">
                     Apply directly through GrantBridge by providing a statement of support.
                  </p>
                  <Link href={`/grants/${grant.slug}/apply`} className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-[#C6A15B] text-[#C6A15B] rounded-xl hover:bg-[#C6A15B]/10 transition-all font-bold text-sm">
                     Write Statement
                  </Link>
               </div>
            )}

            <div className="bg-[#1C2117] rounded-2xl border border-[#4E5B2A]/20 p-6">
              <h3 className="text-sm font-bold text-[#E7E4D8] uppercase tracking-wider mb-4">Share this Grant</h3>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-[#12150F] text-[#A6A99F] hover:text-[#E7E4D8] border border-[#4E5B2A]/30 rounded-lg text-sm transition">Copy Link</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
