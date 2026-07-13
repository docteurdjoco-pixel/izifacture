"use client";

import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';

const DashboardFilters = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-4">
      {/* Search Bar with Animation */}
      <div 
        className={`relative flex items-center transition-all duration-300 ease-in-out group ${
          isSearchFocused ? 'w-full md:w-[450px]' : 'w-full md:w-[350px]'
        }`}
      >
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md ${isSearchFocused ? 'opacity-100' : ''}`}></div>
        <div className="relative w-full flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden group-hover:border-purple-400 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all duration-300">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${isSearchFocused ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-500'}`} />
          <input 
            type="text" 
            placeholder="Rechercher une facture, un client..." 
            className="w-full bg-transparent pl-12 pr-4 py-3 text-sm outline-none text-gray-700 placeholder-gray-400"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      {/* Date Selectors */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:flex-none group">
           <div className="absolute inset-0 rounded-xl bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
           <div className="relative flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden group-hover:border-green-400 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition-all duration-300">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-green-500 pointer-events-none" />
             <input 
              type="date" 
              className="w-full md:w-[140px] bg-transparent pl-10 pr-3 py-2.5 text-sm outline-none text-gray-700 cursor-pointer"
             />
           </div>
        </div>
        <span className="text-gray-400 font-medium px-1">à</span>
        <div className="relative flex-1 md:flex-none group">
           <div className="absolute inset-0 rounded-xl bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
           <div className="relative flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden group-hover:border-green-400 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition-all duration-300">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-green-500 pointer-events-none" />
             <input 
              type="date" 
              className="w-full md:w-[140px] bg-transparent pl-10 pr-3 py-2.5 text-sm outline-none text-gray-700 cursor-pointer"
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
