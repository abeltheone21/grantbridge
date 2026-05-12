"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase handles the URL hash/query automatically.
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      } else {
        // Fallback if session takes a moment to process
        setTimeout(async () => {
          const { data: { session: delayedSession } } = await supabase.auth.getSession();
          if (delayedSession) {
            router.push("/");
          } else {
            router.push("/login");
          }
        }, 1500);
      }
    };
    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#12150F] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C6A15B] mx-auto mb-4"></div>
        <h2 className="text-[#E7E4D8] text-xl">Completing sign in...</h2>
      </div>
    </div>
  );
}
