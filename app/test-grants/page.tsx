"use client";

import { useState } from "react";

const dummyGrants = [
  { id: 1, title: "Agricultural Innovation Fund", org: "GIZ", sector: "Agriculture", amount: 50000, deadline: "2026-08-15", country: "Ethiopia", projectId: "AG-2026-001" },
  { id: 2, title: "Water Access Program", org: "WFP", sector: "Water & Sanitation", amount: 75000, deadline: "2026-09-01", country: "Kenya", projectId: "WTR-2026-042" },
  { id: 3, title: "Girls Education Initiative", org: "UNICEF", sector: "Education", amount: 30000, deadline: "2026-07-20", country: "Ethiopia", projectId: "EDU-2026-118" },
  { id: 4, title: "Renewable Energy Project", org: "EU Commission", sector: "Energy", amount: 100000, deadline: "2026-10-10", country: "Tanzania", projectId: "ENR-2026-073" },
  { id: 5, title: "Small Business Support", org: "Mastercard Foundation", sector: "Economic Development", amount: 25000, deadline: "2026-08-30", country: "Ethiopia", projectId: "SME-2026-029" },
  { id: 6, title: "Climate Resilience Fund", org: "GCF", sector: "Climate", amount: 200000, deadline: "2026-11-15", country: "Uganda", projectId: "CLM-2026-005" },
  { id: 7, title: "Digital Health Platform", org: "Gates Foundation", sector: "Health", amount: 150000, deadline: "2026-09-20", country: "Ethiopia", projectId: "HLT-2026-091" },
];

const sectors = ["All", ...new Set(dummyGrants.map(g => g.sector))];
const countries = ["All", ...new Set(dummyGrants.map(g => g.country))];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Deadline (closest)", value: "deadline" },
  { label: "Amount (highest)", value: "amount-high" },
  { label: "Amount (lowest)", value: "amount-low" },
];

export default function TestGrants() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [country, setCountry] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  let filtered = dummyGrants.filter((grant) => {
    const matchesSearch = grant.title.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sector === "All" || grant.sector === sector;
    const matchesCountry = country === "All" || grant.country === country;
    return matchesSearch && matchesSector && matchesCountry;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "deadline": return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "amount-high": return b.amount - a.amount;
      case "amount-low": return a.amount - b.amount;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#F7FAFC]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="bg-[#88914C] text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">Grants</h1>
          <p className="text-white/80 text-sm mt-1">Find funding opportunities for your organization</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[10px] p-4 shadow-sm border border-[#E5E5E5] mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by keywords"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-[10px] text-[#1A202C] placeholder-[#718096] focus:outline-none focus:border-[#88914C]"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-[#E5E5E5] rounded-[10px] text-[#1A202C] bg-white focus:outline-none focus:border-[#88914C] text-sm"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-[#E5E5E5] rounded-[10px] text-[#1A202C] hover:bg-[#F7FAFC] text-sm font-medium"
            >
              {showFilters ? "Hide Filters ▲" : "Advanced Filters ▼"}
            </button>
          </div>
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t border-[#E5E5E5]">
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="flex-1 px-4 py-3 border border-[#E5E5E5] rounded-[10px] text-[#1A202C] bg-white focus:outline-none focus:border-[#88914C] text-sm">
                {sectors.map((s) => (<option key={s} value={s}>{s === "All" ? "All Sectors" : s}</option>))}
              </select>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="flex-1 px-4 py-3 border border-[#E5E5E5] rounded-[10px] text-[#1A202C] bg-white focus:outline-none focus:border-[#88914C] text-sm">
                {countries.map((c) => (<option key={c} value={c}>{c === "All" ? "All Countries" : c}</option>))}
              </select>
            </div>
          )}
        </div>

        <p className="text-[#718096] text-sm mb-4">{filtered.length} {filtered.length === 1 ? "grant" : "grants"} found</p>

        <div className="space-y-3">
          {filtered.map((grant) => (
            <div key={grant.id} className="bg-white rounded-[10px] p-5 border border-[#E5E5E5] hover:border-[#88914C] hover:shadow-sm transition-all">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#1A202C]">{grant.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[#4A5568]">
                    <span>{grant.org}</span>
                    <span className="text-[#718096]">|</span>
                    <span>{grant.country}</span>
                  </div>
                  <p className="text-xs text-[#718096] mt-1">Project ID: {grant.projectId}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#88914C]">${grant.amount.toLocaleString()}</p>
                  <p className="text-xs text-[#718096]">Deadline: {new Date(grant.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#718096] text-lg">No grants found</p>
            <p className="text-[#A0AEC0] text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}