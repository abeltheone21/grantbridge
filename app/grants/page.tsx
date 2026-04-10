"use client";

import Link from "next/link";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Grants() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const grants = [
    {
      id: 1,
      title: "Agriculture Innovation Fund",
      org: "African Development Fund",
      deadline: "Dec 30, 2026",
      sector: "Agriculture",
      funding: "$20k–$100k",
      area: "Ethiopia",
    },
    {
      id: 2,
      title: "Education Support Grant",
      org: "UNESCO",
      deadline: "Jan 15, 2027",
      sector: "Education",
      funding: "$5k–$20k",
      area: "Pan-African",
    },
    {
      id: 3,
      title: "Healthcare Access Initiative",
      org: "WHO Foundation",
      deadline: "Mar 10, 2027",
      sector: "Health",
      funding: "$20k–$100k",
      area: "Ethiopia",
    },
    {
      id: 4,
      title: "Clean Water Project Grant",
      org: "Water.org",
      deadline: "Feb 28, 2027",
      sector: "Health",
      funding: "$5k–$20k",
      area: "Pan-African",
    },
  ];

  // Filter grants based on search query
  const filteredGrants = grants.filter((grant) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      grant.title.toLowerCase().includes(searchTerm) ||
      grant.org.toLowerCase().includes(searchTerm) ||
      grant.sector.toLowerCase().includes(searchTerm) ||
      grant.area.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Filters */}
      <aside className="w-64 bg-white p-6 shadow hidden md:block">
        <h2 className="font-bold mb-4 text-gray-700">Filters</h2>

        <div className="space-y-6 text-sm text-gray-600">
          {/* Sector */}
          <div>
            <p className="font-semibold mb-2">Sector</p>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Agriculture
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Education
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Health
            </label>
          </div>

          {/* Funding Range */}
          <div>
            <p className="font-semibold mb-2">Funding Range</p>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              $5k-$20k
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              $20k-$100k
            </label>
          </div>

          {/* Area checkbox */}
          <div>
            <p className="font-semibold mb-2">Area</p>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Ethiopia
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Pan-African
            </label>
          </div>
        </div>
      </aside>

      {/* Grants given*/}
      <main className="flex-1 p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-600">
          Grants
        </h1>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search grants by title, organization, sector, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Search Results Count */}
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredGrants.length} grant{filteredGrants.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Mobile Filter Button - Optional */}
        <button className="md:hidden mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 w-full">
          Show Filters
        </button>

        {/* Grants Grid */}
        {filteredGrants.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredGrants.map((g) => (
              <div
                key={g.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-gray-800">{g.title}</h2>
                <p className="text-gray-600 mt-1">{g.org}</p>
                
                {/* Additional Info */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {g.sector}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {g.funding}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {g.area}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mt-3">
                  Deadline: {g.deadline}
                </p>

                <Link href={"/login"}>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                    View More
                  </button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No grants found matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 underline"
            >
              Clear search
            </button>
          </div>
        )}
        
      </main>
      
    </div>
  );
}