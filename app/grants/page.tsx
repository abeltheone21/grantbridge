"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaChevronUp, FaTimes, FaDownload, FaBookmark, FaTrash, FaFilter } from "react-icons/fa";
import { supabase } from "@/lib/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";
import LoginModal from "@/components/LoginModal";

interface Grant {
  id: string;
  title: string;
  teaser: string;
  full_description?: any;
  max_amount?: number;
  min_amount?: number;
  currency: string;
  location?: string;
  deadline?: string;
  status: string;
  created_at: string;
  updated_at: string;
  slug: string;
  sector?: string;
  category?: string;
  implementation_area?: string;
  image?: string | null;
}

interface SavedSearch {
  id: number;
  name: string;
  search_query: string;
  filters: any;
  created_at: string;
}

const statusOptions = [
  { value: "urgent", label: "Urgent" },
  { value: "active", label: "Open" },
  { value: "closed", label: "Closed" },
];

const sectorOptions = [
  { value: "agriculture", label: "Agriculture & Food Security", pillar: "Development" },
  { value: "health", label: "Health & Nutrition", pillar: "Development" },
  { value: "education", label: "Education", pillar: "Development" },
  { value: "wash", label: "WASH", pillar: "Development" },
  { value: "peacebuilding", label: "Peacebuilding & Governance", pillar: "Development" },
  { value: "environment", label: "Environment & Climate Action", pillar: "Development" },
  { value: "social_protection", label: "Social Protection", pillar: "Development" },
  { value: "audio_visual", label: "Audio-Visual & Digital Media", pillar: "Creative" },
  { value: "performing_arts", label: "Performing Arts", pillar: "Creative" },
  { value: "visual_arts", label: "Visual Arts", pillar: "Creative" },
  { value: "fashion_design", label: "Fashion & Design", pillar: "Creative" },
  { value: "cultural_heritage", label: "Cultural Heritage", pillar: "Creative" },
  { value: "literature", label: "Literature & Publishing", pillar: "Creative" },
  { value: "fintech", label: "Fintech", pillar: "Startups" },
  { value: "agtech", label: "Ag-Tech", pillar: "Startups" },
  { value: "edtech", label: "Ed-Tech", pillar: "Startups" },
  { value: "healthtech", label: "Health-Tech", pillar: "Startups" },
  { value: "manufacturing", label: "Manufacturing & Industrial", pillar: "Startups" },
  { value: "ecommerce", label: "E-commerce & Retail", pillar: "Startups" },
  { value: "greentech", label: "Green Tech", pillar: "Startups" },
];

const eligibilityOptions = [
  { value: "local_cso", label: "Local CSO/CBO" },
  { value: "individual_creative", label: "Individual Creative" },
  { value: "early_startup", label: "Early-Stage Startup" },
  { value: "growth_startup", label: "Growth-Stage Startup" },
];

const fundingRangeOptions = [
  { value: "micro", label: "Under $5,000" },
  { value: "seed", label: "$5,000 – $50,000" },
  { value: "scale", label: "$50,000+" },
];

const geographicOptions = [
  { value: "local", label: "Local" },
  { value: "national", label: "National" },
  { value: "regional", label: "Regional" },
  { value: "continental", label: "Pan-African" },
];

export default function Grants() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["active"]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedEligibility, setSelectedEligibility] = useState<string[]>([]);
  const [selectedFundingRanges, setSelectedFundingRanges] = useState<string[]>([]);
  const [selectedGeographic, setSelectedGeographic] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedGrantSlug, setSelectedGrantSlug] = useState("");
  const [openSections, setOpenSections] = useState<string[]>(["status", "sector"]);
  const [andLogic, setAndLogic] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState("");
  const [savingSearch, setSavingSearch] = useState(false);

  useEffect(() => {
    fetchGrants();
    fetchSavedSearches();
  }, [debouncedSearch, selectedStatuses, selectedSectors, selectedEligibility, selectedFundingRanges, selectedGeographic]);

  function toggleSection(section: string) { setOpenSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]); }
  function toggleFilter(setter: any, value: string) { setter((prev: string[]) => prev.includes(value) ? prev.filter((v: string) => v !== value) : [...prev, value]); }
  function removeFilter(type: string, value: string) {
    switch(type) {
      case 'status': setSelectedStatuses(prev => prev.filter(v => v !== value)); break;
      case 'sector': setSelectedSectors(prev => prev.filter(v => v !== value)); break;
      case 'eligibility': setSelectedEligibility(prev => prev.filter(v => v !== value)); break;
      case 'funding': setSelectedFundingRanges(prev => prev.filter(v => v !== value)); break;
      case 'geographic': setSelectedGeographic(prev => prev.filter(v => v !== value)); break;
    }
  }
  function clearAllFilters() {
    setSelectedStatuses(["active"]); setSelectedSectors([]); setSelectedEligibility([]);
    setSelectedFundingRanges([]); setSelectedGeographic([]); setSearchQuery("");
  }

  const allActiveFilters = [
    ...selectedStatuses.filter(s => s !== 'active').map(v => ({ type: 'status', value: v, label: statusOptions.find(o => o.value === v)?.label || v })),
    ...selectedSectors.map(v => ({ type: 'sector', value: v, label: sectorOptions.find(o => o.value === v)?.label || v })),
    ...selectedEligibility.map(v => ({ type: 'eligibility', value: v, label: eligibilityOptions.find(o => o.value === v)?.label || v })),
    ...selectedFundingRanges.map(v => ({ type: 'funding', value: v, label: fundingRangeOptions.find(o => o.value === v)?.label || v })),
    ...selectedGeographic.map(v => ({ type: 'geographic', value: v, label: geographicOptions.find(o => o.value === v)?.label || v })),
  ];
  const hasActiveFilters = allActiveFilters.length > 0;

  async function fetchSavedSearches() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('saved_searches').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setSavedSearches(data);
    } catch (err) {}
  }

  async function saveSearch() {
    if (!saveSearchName.trim()) { alert('Please enter a name.'); return; }
    setSavingSearch(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { alert('Please log in to save searches.'); setSavingSearch(false); return; }
      await supabase.from('saved_searches').insert({
        user_id: user.id, name: saveSearchName.trim(), search_query: searchQuery,
        filters: { selectedStatuses, selectedSectors, selectedEligibility, selectedFundingRanges, selectedGeographic },
      });
      alert('✅ Search saved!'); setSaveSearchName(''); setShowSaveDialog(false); fetchSavedSearches();
    } catch { alert('Failed to save search.'); } finally { setSavingSearch(false); }
  }

  function loadSearch(saved: SavedSearch) {
    const f = saved.filters || {};
    setSearchQuery(saved.search_query || ''); setSelectedStatuses(f.selectedStatuses || ['active']);
    setSelectedSectors(f.selectedSectors || []); setSelectedEligibility(f.selectedEligibility || []);
    setSelectedFundingRanges(f.selectedFundingRanges || []); setSelectedGeographic(f.selectedGeographic || []);
  }

  async function deleteSearch(id: number) {
    await supabase.from('saved_searches').delete().eq('id', id);
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  }

  function exportToCSV() {
    const headers = ["Title", "Teaser", "Amount", "Deadline", "Status", "Location", "Sector"];
    const rows = grants.map(g => [g.title, g.teaser, g.max_amount ? `${g.currency} ${g.max_amount}` : 'N/A', g.deadline || 'N/A', g.status, g.location || 'N/A', g.sector || 'N/A']);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `grantbridge-export-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function getImageUrl(image: any): string {
  if (!image) return '';
  return image;
}

  async function fetchGrants() {
    setLoading(true); setError(null);
    try {
      const queryParams = new URLSearchParams({ limit: '100' });
      if (debouncedSearch) queryParams.append('search', debouncedSearch);
      if (selectedStatuses.length > 0) queryParams.append('status', selectedStatuses[0]);

      const res = await fetch(`/api/grants/public?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch grants');
      const json = await res.json();
      
      let filteredData = (json.grants || []) as Grant[];
      if (selectedSectors.length > 0) filteredData = filteredData.filter(g => { const gs = g.sector?.toLowerCase() || ''; return selectedSectors.some(s => gs.includes(s)); });
      if (selectedFundingRanges.length > 0) filteredData = filteredData.filter(g => { const a = g.max_amount || 0; return selectedFundingRanges.some(r => r === 'micro' ? a < 5000 : r === 'seed' ? a >= 5000 && a <= 50000 : a > 50000); });
      
      setGrants(filteredData);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen bg-[#12150F] pt-14 sm:pt-16">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-[#1C2117] border-r border-[#4E5B2A]/20 hidden md:flex flex-col shrink-0" style={{ height: 'calc(100vh - 56px)', position: 'sticky', top: '56px' }}>
        <div className="p-5 border-b border-[#4E5B2A]/20">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-[#E7E4D8] text-lg">Filters</h2>
            {hasActiveFilters && <button onClick={clearAllFilters} className="text-xs text-[#C6A15B] hover:text-[#d4b46d]">Clear all</button>}
          </div>
          <label className="flex items-center gap-2 text-xs text-[#A6A99F] cursor-pointer">
            <input type="checkbox" checked={andLogic} onChange={() => setAndLogic(!andLogic)} className="accent-[#C6A15B]" /> Must include all (AND)
          </label>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-1">
          <FilterSection title="Opportunity Status" isOpen={openSections.includes('status')} onToggle={() => toggleSection('status')}>
            {statusOptions.map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedStatuses.includes(o.value)} onChange={() => toggleFilter(setSelectedStatuses, o.value)} />)}
          </FilterSection>
          <FilterSection title="Focus Area (Sector)" isOpen={openSections.includes('sector')} onToggle={() => toggleSection('sector')}>
            {["Development", "Creative", "Startups"].map(p => (
              <div key={p} className="mb-2"><p className="text-[#C6A15B] text-xs font-semibold mb-1">{p}</p>
                {sectorOptions.filter(s => s.pillar === p).map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedSectors.includes(o.value)} onChange={() => toggleFilter(setSelectedSectors, o.value)} />)}
              </div>))}
          </FilterSection>
          <FilterSection title="Eligibility Type" isOpen={openSections.includes('eligibility')} onToggle={() => toggleSection('eligibility')}>
            {eligibilityOptions.map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedEligibility.includes(o.value)} onChange={() => toggleFilter(setSelectedEligibility, o.value)} />)}
          </FilterSection>
          <FilterSection title="Funding Range ($)" isOpen={openSections.includes('funding')} onToggle={() => toggleSection('funding')}>
            {fundingRangeOptions.map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedFundingRanges.includes(o.value)} onChange={() => toggleFilter(setSelectedFundingRanges, o.value)} />)}
          </FilterSection>
          <FilterSection title="Geographic Scope" isOpen={openSections.includes('geographic')} onToggle={() => toggleSection('geographic')}>
            {geographicOptions.map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedGeographic.includes(o.value)} onChange={() => toggleFilter(setSelectedGeographic, o.value)} />)}
          </FilterSection>
        </div>
        <SidebarButtons exportToCSV={exportToCSV} showSaveDialog={showSaveDialog} setShowSaveDialog={setShowSaveDialog} savedSearches={savedSearches} showSavedSearches={showSavedSearches} setShowSavedSearches={setShowSavedSearches} saveSearchName={saveSearchName} setSaveSearchName={setSaveSearchName} saveSearch={saveSearch} savingSearch={savingSearch} loadSearch={loadSearch} deleteSearch={deleteSearch} />
      </aside>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#1C2117] shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-[#1C2117] z-10 p-5 border-b border-[#4E5B2A]/20 flex justify-between items-center">
              <h2 className="font-bold text-[#E7E4D8] text-lg">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#12150F] border border-[#4E5B2A]/30 text-[#A6A99F] hover:text-[#E7E4D8]" aria-label="Close filters">
                <FaTimes size={14} />
              </button>
            </div>
            <div className="p-5">
              <label className="flex items-center gap-2 text-xs text-[#A6A99F] mb-4 cursor-pointer">
                <input type="checkbox" checked={andLogic} onChange={() => setAndLogic(!andLogic)} className="accent-[#C6A15B]" /> Must include all (AND)
              </label>
              <FilterSection title="Status" isOpen={true} onToggle={() => {}}>
                {statusOptions.map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedStatuses.includes(o.value)} onChange={() => toggleFilter(setSelectedStatuses, o.value)} />)}
              </FilterSection>
              <FilterSection title="Sector" isOpen={openSections.includes('sector')} onToggle={() => toggleSection('sector')}>
                {["Development", "Creative", "Startups"].map(p => (
                  <div key={p} className="mb-2"><p className="text-[#C6A15B] text-xs font-semibold mb-1">{p}</p>
                    {sectorOptions.filter(s => s.pillar === p).map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedSectors.includes(o.value)} onChange={() => toggleFilter(setSelectedSectors, o.value)} />)}
                  </div>))}
              </FilterSection>
              <FilterSection title="Eligibility" isOpen={openSections.includes('eligibility')} onToggle={() => toggleSection('eligibility')}>
                {eligibilityOptions.map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedEligibility.includes(o.value)} onChange={() => toggleFilter(setSelectedEligibility, o.value)} />)}
              </FilterSection>
              <FilterSection title="Funding Range" isOpen={openSections.includes('funding')} onToggle={() => toggleSection('funding')}>
                {fundingRangeOptions.map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedFundingRanges.includes(o.value)} onChange={() => toggleFilter(setSelectedFundingRanges, o.value)} />)}
              </FilterSection>
              <FilterSection title="Geographic" isOpen={openSections.includes('geographic')} onToggle={() => toggleSection('geographic')}>
                {geographicOptions.map(o => <FilterCheckbox key={o.value} label={o.label} checked={selectedGeographic.includes(o.value)} onChange={() => toggleFilter(setSelectedGeographic, o.value)} />)}
              </FilterSection>
              <div className="mt-6 space-y-2">
                <button onClick={exportToCSV} className="w-full px-4 py-2.5 bg-[#3F4F24] text-[#E7E4D8] rounded-lg text-sm flex items-center justify-center gap-2"><FaDownload /> Export CSV</button>
                <button onClick={() => setShowSaveDialog(true)} className="w-full px-4 py-2.5 bg-[#C6A15B] text-[#12150F] rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><FaBookmark /> Save Search</button>
              </div>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="mt-4 w-full px-4 py-2.5 border border-red-500/30 text-red-400 rounded-lg text-sm">Clear All Filters</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-6 lg:p-10 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#E7E4D8] truncate">Available Grants</h1>
          <button onClick={exportToCSV} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#1C2117] border border-[#4E5B2A]/30 text-[#C6A15B] rounded-lg hover:bg-[#242A1D] transition text-xs sm:text-sm shrink-0">
            <FaDownload className="text-xs" /> Export CSV
          </button>
        </div>

        <div className="flex gap-2 mb-3 sm:mb-4">
          <div className="relative flex-1 min-w-0">
            <input type="text" placeholder="Search grants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2.5 pl-10 sm:px-4 sm:py-3 sm:pl-12 bg-[#1C2117] border border-[#4E5B2A]/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C6A15B] text-[#E7E4D8] placeholder-[#6C6F66] text-sm" />
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#6C6F66] text-xs sm:text-sm" />
          </div>
          <button onClick={() => setShowMobileFilters(true)} className="md:hidden px-3 py-2.5 bg-[#1C2117] border border-[#4E5B2A]/30 rounded-lg text-[#E7E4D8] shrink-0 flex items-center gap-1.5 text-sm">
            <FaFilter className="text-xs" /> Filters {hasActiveFilters && `(${allActiveFilters.length})`}
          </button>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
            {allActiveFilters.map((f, i) => (
              <span key={i} className="px-2 py-1 bg-[#3F4F24]/20 text-[#C6A15B] text-[10px] sm:text-xs rounded-full flex items-center gap-1 border border-[#4E5B2A]/30">
                <span className="truncate max-w-[100px] sm:max-w-none">{f.label}</span>
                <button type="button" title={`Remove ${f.label}`} onClick={() => removeFilter(f.type, f.value)} className="hover:text-[#d4b46d] shrink-0"><FaTimes className="text-[8px] sm:text-[10px]" aria-hidden="true" /></button>
              </span>
            ))}
            <button onClick={clearAllFilters} className="text-[10px] sm:text-xs text-[#A6A99F] hover:text-[#C6A15B] underline px-1">Clear all</button>
          </div>
        )}

        {!loading && <p className="text-xs sm:text-sm text-[#A6A99F] mb-3 sm:mb-4">Found {grants.length} grant{grants.length !== 1 ? 's' : ''}</p>}
        {error && <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-3 py-2 rounded text-sm mb-4">Error: {error}</div>}

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C6A15B]"></div></div>
        ) : grants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {grants.map((g) => (
              <div key={g.id} className="bg-[#1C2117] rounded-xl border border-[#4E5B2A]/20 hover:border-[#C6A15B]/30 hover:bg-[#242A1D] transition overflow-hidden flex flex-col group">
                <div className="h-40 sm:h-48 bg-[#12150F] relative overflow-hidden">
                  {g.image ? <img src={getImageUrl(g.image)} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <div className="w-full h-full flex items-center justify-center"><span className="text-3xl opacity-30">📋</span></div>}
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h2 className="text-base sm:text-lg font-semibold text-[#E7E4D8] line-clamp-2 flex-1">{g.title}</h2>
                    <span className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-full whitespace-nowrap shrink-0 ${g.status === 'active' ? 'bg-[#3F4F24]/30 text-[#C6A15B]' : 'bg-[#4E5B2A]/10 text-[#A6A99F]'}`}>
                      {g.status === 'active' ? 'Open' : g.status === 'urgent' ? 'Urgent' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-[#A6A99F] text-xs sm:text-sm line-clamp-2 mb-3">{g.teaser}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {g.max_amount && <span className="px-2 py-0.5 bg-[#3F4F24]/20 text-[#C6A15B] text-[10px] sm:text-xs rounded-full border border-[#4E5B2A]/30">{new Intl.NumberFormat('en-US', { style: 'currency', currency: g.currency || 'USD', minimumFractionDigits: 0 }).format(g.max_amount)}</span>}
                    {g.location && <span className="px-2 py-0.5 bg-[#3F4F24]/20 text-[#A6A99F] text-[10px] sm:text-xs rounded-full border border-[#4E5B2A]/30 truncate max-w-[120px] sm:max-w-none">{g.location.split('(')[0].trim()}</span>}
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#6C6F66] mt-2">Deadline: {g.deadline ? new Date(g.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'}</p>
                  <Link href={`/grants/${g.slug}`} className="mt-3 w-full px-3 py-2 sm:py-2.5 bg-[#C6A15B] text-[#12150F] rounded-lg hover:bg-[#d4b46d] transition text-xs sm:text-sm font-semibold text-center block">View Details →</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#A6A99F] text-sm sm:text-lg">No grants found</p>
            {hasActiveFilters && <button onClick={clearAllFilters} className="mt-3 text-xs sm:text-sm text-[#C6A15B] hover:text-[#d4b46d] underline">Clear all filters</button>}
          </div>
        )}
      </main>
    </div>
  );
}

// Sidebar Buttons Component
function SidebarButtons({ exportToCSV, showSaveDialog, setShowSaveDialog, savedSearches, showSavedSearches, setShowSavedSearches, saveSearchName, setSaveSearchName, saveSearch, savingSearch, loadSearch, deleteSearch }: any) {
  return (
    <div className="p-5 border-t border-[#4E5B2A]/20 space-y-2 shrink-0">
      <button onClick={exportToCSV} className="w-full px-4 py-2.5 bg-[#3F4F24] text-[#E7E4D8] rounded-lg hover:bg-[#4E5B2A] transition text-sm flex items-center justify-center gap-2"><FaDownload className="text-xs" /> Export as .csv</button>
      <button onClick={() => setShowSaveDialog(true)} className="w-full px-4 py-2.5 bg-[#C6A15B] text-[#12150F] rounded-lg hover:bg-[#d4b46d] transition text-sm font-semibold flex items-center justify-center gap-2"><FaBookmark className="text-xs" /> Save Search</button>
      {savedSearches.length > 0 && (
        <button onClick={() => setShowSavedSearches(!showSavedSearches)} className="w-full px-4 py-2.5 text-[#A6A99F] text-xs hover:text-[#C6A15B] transition text-center">{showSavedSearches ? 'Hide' : 'Show'} Saved ({savedSearches.length})</button>
      )}
      {showSaveDialog && (
        <div className="pt-3">
          <input type="text" value={saveSearchName} onChange={(e) => setSaveSearchName(e.target.value)} placeholder="e.g., Health grants" className="w-full px-3 py-2 bg-[#12150F] border border-[#4E5B2A]/30 rounded-lg text-[#E7E4D8] text-xs mb-2" onKeyDown={(e) => e.key === 'Enter' && saveSearch()} />
          <div className="flex gap-2">
            <button onClick={saveSearch} disabled={savingSearch} className="flex-1 px-3 py-1.5 bg-[#C6A15B] text-[#12150F] rounded-lg text-xs font-semibold">{savingSearch ? 'Saving...' : 'Save'}</button>
            <button onClick={() => { setShowSaveDialog(false); setSaveSearchName(''); }} className="px-3 py-1.5 border border-[#4E5B2A]/30 text-[#A6A99F] rounded-lg text-xs">Cancel</button>
          </div>
        </div>
      )}
      {showSavedSearches && savedSearches.length > 0 && (
        <div className="max-h-40 overflow-y-auto space-y-1.5 pt-2">
          {savedSearches.map((s: SavedSearch) => (
            <div key={s.id} className="flex items-center justify-between gap-2 group">
              <button onClick={() => loadSearch(s)} className="text-xs text-[#C6A15B] hover:text-[#d4b46d] text-left flex-1 truncate">{s.name}</button>
              <button onClick={() => deleteSearch(s.id)} className="text-[#6C6F66] hover:text-red-400 text-xs shrink-0 opacity-0 group-hover:opacity-100"><FaTrash /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#4E5B2A]/10 pb-2 mb-2">
      <button onClick={onToggle} aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`} className="flex items-center justify-between w-full text-left py-2 text-[#E7E4D8] font-semibold text-xs sm:text-sm hover:text-[#C6A15B] transition-colors">
        {title}
        {isOpen ? <FaChevronUp className="text-[10px] shrink-0" aria-hidden="true" /> : <FaChevronDown className="text-[10px] shrink-0" aria-hidden="true" />}
      </button>
      {isOpen && <div className="space-y-0.5 mt-1">{children}</div>}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer hover:text-[#C6A15B] transition-colors text-[11px] sm:text-xs text-[#A6A99F]">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-[#C6A15B] rounded shrink-0" />
      <span className="leading-tight">{label}</span>
    </label>
  );
}