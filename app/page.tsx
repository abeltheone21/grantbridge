"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import LoginModal from "@/components/LoginModal";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.6, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

interface RecentGrant {
  id: number; title: string; summary: string; amount?: number; currency: string;
  location?: string; deadline?: string; slug: string; featured_image_id?: number;
  featured_image?: { filename: string; url?: string } | null;
}

export default function Home() {
  const text: string = "Welcome to GrantBridge";
  const [displayText, setDisplayText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [recentGrants, setRecentGrants] = useState<RecentGrant[]>([]);

  useEffect(() => {
    let timeout: NodeJS.Timeout; let interval: NodeJS.Timeout;
    const handleTyping = () => {
      let i: number = isDeleting ? text.length : 0;
      if (!isDeleting) {
        interval = setInterval(() => { setDisplayText(text.slice(0, i + 1)); i++; if (i > text.length) { clearInterval(interval); timeout = setTimeout(() => setIsDeleting(true), 10000); } }, 80);
      } else {
        interval = setInterval(() => { setDisplayText(text.slice(0, i - 1)); i--; if (i === 0) { clearInterval(interval); setIsDeleting(false); } }, 50);
      }
    };
    handleTyping();
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [isDeleting]);

  useEffect(() => { fetchRecentGrants(); }, []);

  async function fetchRecentGrants() {
    try {
      const { data: grantsData } = await supabase.from('grants').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3);
      if (grantsData) {
        const imageIds = grantsData.map(g => g.featured_image_id).filter((id): id is number => id !== null && id !== undefined);
        let imageMap = new Map();
        if (imageIds.length > 0) { const { data: mediaData } = await supabase.from('media').select('*').in('id', imageIds); if (mediaData) mediaData.forEach(media => imageMap.set(media.id, media)); }
        setRecentGrants(grantsData.map(grant => ({ ...grant, featured_image: grant.featured_image_id ? imageMap.get(grant.featured_image_id) || null : null })));
      }
    } catch (err) {}
  }

  function getGrantImageUrl(image: any): string {
    if (!image) return '';
    const payloadUrl = 'http://localhost:3001';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (image.filename && supabaseUrl) return `${supabaseUrl}/storage/v1/object/public/media/${encodeURIComponent(image.filename)}`;
    if (image.filename) return `${payloadUrl}/api/media/file/${encodeURIComponent(image.filename)}`;
    if (image.url?.startsWith('http')) return image.url;
    if (image.url?.startsWith('/')) return `${payloadUrl}${image.url}`;
    return '';
  }

  const services = [
    { title: "Smart Grant Discovery", desc: "Find funding opportunities tailored to your sector and region with intelligent matching." },
    { title: "Simple Application Flow", desc: "Apply easily with a guided, step-by-step process designed for nonprofits." },
    { title: "Africa-Focused Impact", desc: "Built specifically for NGOs, startups, and organizations across Africa." },
    { title: "Verified & Secure", desc: "All grants are verified. Your data is protected with enterprise-grade security." },
    { title: "Real-Time Tracking", desc: "Monitor your application status and get updates in real-time." },
    { title: "Dedicated Support", desc: "Our team helps you find the right grants and complete applications." },
  ];

  const steps = [
    { step: "01", title: "Browse Grants", desc: "Explore curated funding opportunities across sectors" },
    { step: "02", title: "Filter & Match", desc: "Narrow down by sector, funding range, and region" },
    { step: "03", title: "View Details", desc: "Access full grant information and requirements" },
    { step: "04", title: "Apply Instantly", desc: "Sign in and submit your application in minutes" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#12150F]">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <Image src="/landing.png" alt="African landscape" fill className="object-cover" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12150F]/95 via-[#12150F]/80 to-[#12150F]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#12150F] via-[#12150F]/30 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#C6A15B]/10 backdrop-blur-sm border border-[#C6A15B]/20 rounded-full text-[#C6A15B] text-sm mb-6">
                <span className="w-2 h-2 bg-[#C6A15B] rounded-full animate-pulse" /> Empowering African Innovation
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold max-w-4xl mx-auto lg:mx-0 min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem] leading-tight">
                <span className="text-[#E7E4D8] drop-shadow-lg">{displayText}</span>
                <span className="animate-pulse text-[#C6A15B] drop-shadow-lg">|</span>
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-6 text-base sm:text-lg lg:text-xl text-[#A6A99F] max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow">
                Discover and apply for grants across Africa. Empower your organization with funding opportunities that create lasting impact.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => setIsLoginModalOpen(true)} className="group px-8 py-4 bg-[#C6A15B] text-[#12150F] rounded-xl hover:bg-[#d4b46d] transition-all font-bold text-lg shadow-lg shadow-[#C6A15B]/20 hover:shadow-xl hover:shadow-[#C6A15B]/30 inline-flex items-center justify-center gap-2">
                  Get Started <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/grants" className="px-8 py-4 bg-[#1C2117] backdrop-blur-sm border border-[#C6A15B]/20 text-[#C6A15B] rounded-xl hover:bg-[#242A1D] hover:border-[#C6A15B]/40 transition-all font-semibold text-lg text-center">Explore Grants</Link>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }} className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-[#A6A99F] text-sm justify-center lg:justify-start">
                {["Verified Grants", "Free to Apply", "Secure Platform"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><FaCheckCircle className="text-[#C6A15B]" />{item}</div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-10 border-2 border-[#C6A15B]/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-[#C6A15B] rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#12150F]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C6A15B]/10 rounded-full text-[#C6A15B] text-xs font-semibold tracking-wider uppercase mb-4">About Us</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#E7E4D8] mb-4">About GrantBridge</h2>
            <p className="text-[#A6A99F] max-w-2xl mx-auto text-lg leading-relaxed">GrantBridge is a platform designed to help NGOs, startups, and organizations across Ethiopia and Africa easily discover and apply for funding opportunities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ title: "Our Mission", desc: "Make funding accessible to every organization across Africa." },{ title: "Our Vision", desc: "Empower African innovation through seamless funding access." },{ title: "Our Impact", desc: "Connecting projects with global support and funding opportunities." }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.4 }} whileHover={{ y: -6 }} className="group bg-[#1C2117] rounded-2xl p-8 border border-[#4E5B2A]/20 hover:border-[#C6A15B]/30 hover:bg-[#242A1D] transition-all duration-300">
                <div className="w-10 h-1 bg-[#C6A15B] rounded-full mb-5 group-hover:w-16 transition-all duration-300"></div>
                <h3 className="text-lg font-bold text-[#E7E4D8] mb-2">{item.title}</h3>
                <p className="text-[#A6A99F] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {recentGrants.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#12150F]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C6A15B]/10 rounded-full text-[#C6A15B] text-xs font-semibold tracking-wider uppercase mb-4">Latest Opportunities</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#E7E4D8] mb-4">Recent Grants</h2>
              <p className="text-[#A6A99F] max-w-2xl mx-auto">Explore our latest funding opportunities for African organizations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {recentGrants.map((grant, i) => (
                <motion.div key={grant.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }} whileHover={{ y: -6 }} className="group bg-[#1C2117] rounded-2xl overflow-hidden border border-[#4E5B2A]/20 hover:border-[#C6A15B]/30 hover:bg-[#242A1D] transition-all duration-300">
                  <div className="h-40 bg-[#12150F] relative overflow-hidden">
                    {grant.featured_image ? <img src={getGrantImageUrl(grant.featured_image)} alt={grant.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-3xl opacity-40">📋</span></div>}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#E7E4D8] mb-2 line-clamp-2 group-hover:text-[#C6A15B] transition-colors">{grant.title}</h3>
                    <p className="text-[#A6A99F] text-sm line-clamp-2 mb-3">{grant.summary}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {grant.amount && <span className="px-2 py-1 bg-[#3F4F24]/20 text-[#C6A15B] text-xs rounded-full border border-[#4E5B2A]/30">{new Intl.NumberFormat('en-US', { style: 'currency', currency: grant.currency || 'USD', minimumFractionDigits: 0 }).format(grant.amount)}</span>}
                      {grant.location && <span className="px-2 py-1 bg-[#3F4F24]/20 text-[#A6A99F] text-xs rounded-full border border-[#4E5B2A]/30">{grant.location.split('(')[0].trim()}</span>}
                    </div>
                    {grant.deadline && <p className="text-xs text-[#6C6F66]">{new Date(grant.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/grants" className="inline-flex items-center gap-2 px-8 py-4 bg-[#C6A15B] text-[#12150F] rounded-xl hover:bg-[#d4b46d] transition-all font-bold text-lg shadow-lg shadow-[#C6A15B]/20 hover:shadow-xl hover:shadow-[#C6A15B]/30">View More Grants <FaArrowRight /></Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3F4F24] to-[#1C2117]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C6A15B]/10 rounded-full text-[#C6A15B] text-xs font-semibold tracking-wider uppercase mb-4">Platform Stats</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#E7E4D8] mb-10">Built for <span className="text-[#C6A15B]">Impact</span></h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{ title: "New Platform", desc: "Fresh & Modern" },{ title: "Curated Grants", desc: "Carefully Selected" },{ title: "100% Free", desc: "No Hidden Costs" },{ title: "Pan-African", desc: "Growing Coverage" }].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }} whileHover={{ scale: 1.03 }} className="text-center p-6 bg-[#1C2117]/50 backdrop-blur-sm rounded-2xl border border-[#4E5B2A]/20 hover:border-[#C6A15B]/30 hover:bg-[#242A1D] transition-all group">
                <div className="w-8 h-1 bg-[#C6A15B] rounded-full mx-auto mb-4 group-hover:w-12 transition-all duration-300"></div>
                <div className="text-[#C6A15B] font-bold text-lg mb-1">{stat.title}</div>
                <div className="text-[#A6A99F] text-sm">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#12150F]">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C6A15B]/10 rounded-full text-[#C6A15B] text-xs font-semibold tracking-wider uppercase mb-4">Why Choose Us</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#E7E4D8] mb-4">Why GrantBridge?</h2>
          <p className="text-[#A6A99F] max-w-2xl mx-auto">Everything you need to find and secure funding for your organization</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }} whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(198, 161, 91, 0.06)" }} className="group bg-[#1C2117] rounded-2xl p-6 sm:p-8 border border-[#4E5B2A]/20 hover:border-[#C6A15B]/30 hover:bg-[#242A1D] transition-all duration-300">
              <div className="w-10 h-1 bg-[#C6A15B] rounded-full mb-4 group-hover:w-16 transition-all duration-300"></div>
              <h3 className="text-lg font-bold text-[#E7E4D8] mb-2">{service.title}</h3>
              <p className="text-[#A6A99F] text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#12150F]">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C6A15B]/10 rounded-full text-[#C6A15B] text-xs font-semibold tracking-wider uppercase mb-4">Process</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#E7E4D8] mb-4">How it works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.4 }} className="relative group">
              <div className="bg-[#1C2117] rounded-2xl p-6 text-center border border-[#4E5B2A]/20 hover:border-[#C6A15B]/30 hover:bg-[#242A1D] transition-all duration-300">
                <div className="text-5xl font-bold text-[#3F4F24]/30 mb-4 group-hover:text-[#3F4F24]/50 transition-colors">{item.step}</div>
                <h3 className="text-lg font-bold text-[#E7E4D8] mb-2">{item.title}</h3>
                <p className="text-[#A6A99F] text-sm">{item.desc}</p>
              </div>
              {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-3 text-2xl text-[#C6A15B]/20">→</div>}
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3F4F24] to-[#1C2117]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#E7E4D8] mb-4">Ready to Find Your Next Grant?</h2>
            <p className="text-[#A6A99F] text-lg mb-8">Join organizations already using GrantBridge to secure funding.</p>
            <button onClick={() => setIsLoginModalOpen(true)} className="px-8 py-4 bg-[#C6A15B] text-[#12150F] rounded-xl hover:bg-[#d4b46d] transition-all font-bold text-lg shadow-xl hover:shadow-2xl inline-flex items-center gap-2">Get Started Free <FaArrowRight /></button>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 text-center bg-[#0f120c] border-t border-[#4E5B2A]/10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[#E7E4D8] font-bold text-lg">Grant<span className="text-[#C6A15B]">Bridge</span></span>
        </div>
        <div className="flex justify-center gap-5 text-xl mb-4">
          <a href="#" className="text-[#6C6F66] hover:text-[#C6A15B] transition-colors" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" className="text-[#6C6F66] hover:text-[#C6A15B] transition-colors" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" className="text-[#6C6F66] hover:text-[#C6A15B] transition-colors" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="#" className="text-[#6C6F66] hover:text-[#C6A15B] transition-colors" aria-label="Instagram"><FaInstagram /></a>
        </div>
        <p className="text-[#6C6F66] text-sm">© {new Date().getFullYear()} GrantBridge. All rights reserved.</p>
      </footer>
    </div>
  );
}