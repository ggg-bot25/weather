/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { PRESET_CITIES } from '../services/weatherService';
import { PresetCity } from '../types';

interface CitySearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  currentCityName: string;
}

export default function CitySearch({ onSearch, isLoading, currentCityName }: CitySearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handlePresetClick = (city: PresetCity) => {
    onSearch(city.localName);
    setQuery('');
  };

  return (
    <div id="city-search-component" className="w-full space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="도시명을 한글 또는 영어로 검색하세요 (예: 서울, 대구, New York)"
          className="w-full h-14 pl-12 pr-12 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans text-sm md:text-base placeholder-slate-400"
          disabled={isLoading}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-full py-1 px-2.5 transition-colors"
          >
            지우기
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 text-blue-500" />
          )}
        </button>
      </form>

      {/* Preset Cities Suggestions */}
      <div id="preset-cities-container" className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 font-display pointer-events-none mr-1">
          인기 도시:
        </span>
        {PRESET_CITIES.map((city) => {
          const isActive = currentCityName.toLowerCase() === city.localName.toLowerCase() || currentCityName.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              type="button"
              key={city.id}
              id={`preset-city-${city.id}`}
              onClick={() => handlePresetClick(city)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                isActive
                  ? 'bg-blue-500 text-white border-blue-500 font-semibold shadow-sm'
                  : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              {city.localName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
