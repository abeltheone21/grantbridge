"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { FaArrowLeft, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  
  const [grantId, setGrantId] = useState<string | null>(null);
  const [grantTitle, setGrantTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [supportStatement, setSupportStatement] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Redirect to grant page to login
        router.push(`/grants/${slug}`);
        return;
      }
      fetchGrantId(session.access_token);
    });
  }, [slug, router]);

  async function fetchGrantId(token: string) {
    try {
      const res = await fetch(`/api/grants/${slug}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load grant details");
      const json = await res.json();
      if (json.requires_auth) {
        router.push(`/grants/${slug}`);
        return;
      }
      setGrantId(json.grant.id);
      setGrantTitle(json.grant.title);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!grantId) return;
    
    setError(null);
    setSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expired. Please log in again.");

      const payload = {
        grant_id: grantId,
        support_statement: supportStatement,
        source_page: window.location.href,
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit application");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12150F] flex items-center justify-center">
        <FaSpinner className="animate-spin text-[#C6A15B] text-4xl" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#12150F] flex flex-col items-center justify-center p-4">
        <FaCheckCircle className="text-[#C6A15B] text-6xl mb-6" />
        <h1 className="text-3xl font-bold text-[#E7E4D8] mb-4">Application Submitted!</h1>
        <p className="text-[#A6A99F] mb-8 text-center max-w-md">
          Your statement of support for "{grantTitle}" has been received. Our team will review it shortly.
        </p>
        <Link href={`/grants/${slug}`} className="px-8 py-3 bg-[#C6A15B] text-[#12150F] rounded-xl font-bold">
          Return to Grant
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12150F] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href={`/grants/${slug}`} className="inline-flex items-center text-[#A6A99F] hover:text-[#C6A15B] mb-8 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Grant Details
        </Link>

        <div className="bg-[#1C2117] rounded-2xl border border-[#4E5B2A]/20 p-8 sm:p-10 shadow-xl">
          <div className="mb-8 border-b border-[#4E5B2A]/20 pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#E7E4D8] mb-2">Submit Application</h1>
            <p className="text-[#C6A15B] font-semibold">{grantTitle}</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="supportStatement" className="block text-[#E7E4D8] font-semibold mb-2">
                Statement of Support
              </label>
              <p className="text-[#A6A99F] text-sm mb-3">
                Please explain why your organization is a good fit for this grant and how you intend to utilize the funds. (Min 50 characters)
              </p>
              <textarea
                id="supportStatement"
                required
                minLength={50}
                maxLength={5000}
                rows={8}
                value={supportStatement}
                onChange={(e) => setSupportStatement(e.target.value)}
                className="w-full bg-[#12150F] border border-[#4E5B2A]/50 rounded-xl p-4 text-[#E7E4D8] focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Start writing your statement here..."
              />
              <div className="text-right text-xs mt-2 text-[#6C6F66]">
                {supportStatement.length} / 5000
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || supportStatement.length < 50}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                submitting || supportStatement.length < 50
                  ? "bg-[#3F4F24] text-[#A6A99F] cursor-not-allowed"
                  : "bg-[#C6A15B] text-[#12150F] hover:bg-[#d4b46d] shadow-lg hover:shadow-xl hover:shadow-[#C6A15B]/20"
              }`}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
