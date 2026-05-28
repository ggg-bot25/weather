/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Loader2, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Gauge, 
  Sunrise, 
  Sunset,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponseData, PRESET_CITIES } from '../services/weatherService';
import WeatherVisual from './WeatherVisual';
import { WeatherIcon } from './Forecasts';

interface CompareViewProps {
  dataA: ResponseData | null;
  dataB: ResponseData | null;
  isLoadingA: boolean;
  isLoadingB: boolean;
  onSearchA: (city: string) => void;
  onSearchB: (city: string) => void;
  useCelsius: boolean;
}

interface ColumnSearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  currentCity: string;
  side: 'left' | 'right';
}

function ColumnSearch({ onSearch, isLoading, currentCity, side }: ColumnSearchProps) {
  const [val, setVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim()) {
      onSearch(val.trim());
      setVal('');
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={`${side === 'left' ? '도시 A' : '도시 B'} 검색 (예: 제주, 도쿄, Paris)`}
          className="w-full h-11 pl-10 pr-10 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
          disabled={isLoading}
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
          )}
        </button>
      </form>

      {/* Mini Preset Chips */}
      <div className="flex flex-wrap gap-1.5 justify-start">
        {PRESET_CITIES.slice(0, 5).map((city) => {
          const isSelected = currentCity.toLowerCase() === city.localName.toLowerCase() || currentCity.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.id}
              onClick={() => onSearch(city.localName)}
              className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                isSelected
                  ? 'bg-blue-500 text-white border-blue-500 font-semibold'
                  : 'bg-white/80 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-800/60'
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

export default function CompareView({
  dataA,
  dataB,
  isLoadingA,
  isLoadingB,
  onSearchA,
  onSearchB,
  useCelsius
}: CompareViewProps) {
  const formatTemp = (val: number) => `${val}°${useCelsius ? 'C' : 'F'}`;

  return (
    <div id="compare-split-dashboard" className="space-y-6">
      
      {/* Visual compare banner note */}
      <div className="flex items-center gap-2 p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 rounded-2xl">
        <ArrowRightLeft className="w-4 h-4 text-blue-500" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          좌우로 분할된 대시보드에서 두 도시의 오프라인 시뮬레이션 및 실시간 기상 상태를 직관적으로 상호 비교하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* COLUMN A (LEFT) */}
        <div id="compare-col-a" className="flex flex-col space-y-4">
          <div className="p-4 bg-slate-100/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">
                City A (Left)
              </span>
              {dataA && (
                <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-full font-mono">
                  {dataA.current.cityName}
                </span>
              )}
            </div>
            <ColumnSearch 
              onSearch={onSearchA} 
              isLoading={isLoadingA} 
              currentCity={dataA?.current?.cityName || '서울'} 
              side="left" 
            />
          </div>

          {/* Column A Weather Panel */}
          {dataA ? (
            <div className="flex-1 flex flex-col space-y-4">
              {/* Visual Frame */}
              <div className="relative min-h-[240px] rounded-3xl overflow-hidden shadow-md">
                <WeatherVisual condition={dataA.current.condition} />
                {/* Visual content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white z-10 select-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black font-display drop-shadow">
                        {dataA.current.cityName}
                      </h3>
                      <p className="text-[10px] text-white/70 font-mono">
                        {dataA.current.countryName} • {dataA.current.timestamp}
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      dataA.current.isRealApi ? 'bg-green-500 text-white' : 'bg-sky-950/80 text-sky-200 border border-sky-500/30'
                    }`}>
                      {dataA.current.isRealApi ? 'LIVE' : 'MOCK'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1 pointer-events-none">
                      <span className="text-5xl font-black font-display tracking-tight drop-shadow">
                        {dataA.current.temperature}
                      </span>
                      <span className="text-xl font-light drop-shadow">
                        °{useCelsius ? 'C' : 'F'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold drop-shadow-sm mt-1">
                      {dataA.current.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats list */}
              <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/35 border border-slate-100 dark:border-slate-800 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase flex items-center justify-between">
                  <span>핵심 기후 지표</span>
                  <span className="text-[10px] font-mono text-slate-500 normal-case font-medium">최저 {dataA.current.minTemp}° / 최고 {dataA.current.maxTemp}°</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/30">
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    <div>
                      <p className="text-[10px] text-slate-400">체감 온도</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 font-display">{formatTemp(dataA.current.feelsLike)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/30">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-[10px] text-slate-400">대기 습도</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 font-display">{dataA.current.humidity}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/30">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <div>
                      <p className="text-[10px] text-slate-400">풍속</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 font-display">{dataA.current.windSpeed} m/s</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/30">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-[10px] text-slate-400">자외선 지수</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 font-display">{dataA.current.uvIndex} / 10</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-day simplified forecast timeline */}
              <div className="p-4 rounded-3xl bg-white/75 dark:bg-slate-900/35 border border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase font-display">일간 예보 비교</h4>
                <div className="space-y-2">
                  {dataA.daily.slice(0, 3).map((day, idx) => (
                    <div key={`col-a-day-${idx}`} className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-500 dark:text-slate-400 font-medium min-w-[50px]">{day.dayName.slice(0, 3)}</span>
                      <div className="flex items-center gap-1.5 justify-center">
                        <WeatherIcon condition={day.condition} className="w-4 h-4" />
                        <span className="text-[10px] text-slate-400">{day.description.split(' - ').pop()?.slice(0, 10) || day.description}</span>
                      </div>
                      <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">{day.minTemp}° / {day.maxTemp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse flex items-center justify-center text-sm text-slate-400">
              City A 데이터 검색 중...
            </div>
          )}
        </div>

        {/* COLUMN B (RIGHT) */}
        <div id="compare-col-b" className="flex flex-col space-y-4">
          <div className="p-4 bg-slate-100/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">
                City B (Right)
              </span>
              {dataB && (
                <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold px-2 py-0.5 rounded-full font-mono">
                  {dataB.current.cityName}
                </span>
              )}
            </div>
            <ColumnSearch 
              onSearch={onSearchB} 
              isLoading={isLoadingB} 
              currentCity={dataB?.current?.cityName || '뉴욕'} 
              side="right" 
            />
          </div>

          {/* Column B Weather Panel */}
          {dataB ? (
            <div className="flex-1 flex flex-col space-y-4">
              {/* Visual Frame */}
              <div className="relative min-h-[240px] rounded-3xl overflow-hidden shadow-md">
                <WeatherVisual condition={dataB.current.condition} />
                {/* Visual content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white z-10 select-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black font-display drop-shadow">
                        {dataB.current.cityName}
                      </h3>
                      <p className="text-[10px] text-white/70 font-mono">
                        {dataB.current.countryName} • {dataB.current.timestamp}
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      dataB.current.isRealApi ? 'bg-green-500 text-white' : 'bg-sky-950/80 text-sky-200 border border-sky-500/30'
                    }`}>
                      {dataB.current.isRealApi ? 'LIVE' : 'MOCK'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1 pointer-events-none">
                      <span className="text-5xl font-black font-display tracking-tight drop-shadow border-none">
                        {dataB.current.temperature}
                      </span>
                      <span className="text-xl font-light drop-shadow">
                        °{useCelsius ? 'C' : 'F'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold drop-shadow-sm mt-1">
                      {dataB.current.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats list */}
              <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/35 border border-slate-100 dark:border-slate-800 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase flex items-center justify-between">
                  <span>핵심 기후 지표</span>
                  <span className="text-[10px] font-mono text-slate-500 normal-case font-medium">최저 {dataB.current.minTemp}° / 최고 {dataB.current.maxTemp}°</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/30">
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    <div>
                      <p className="text-[10px] text-slate-400">체감 온도</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 font-display">{formatTemp(dataB.current.feelsLike)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/30">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-[10px] text-slate-400">대기 습도</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 font-display">{dataB.current.humidity}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/30">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <div>
                      <p className="text-[10px] text-slate-400">풍속</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 font-display">{dataB.current.windSpeed} m/s</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/30">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-[10px] text-slate-400">자외선 지수</p>
                      <p className="font-bold text-slate-700 dark:text-slate-300 font-display">{dataB.current.uvIndex} / 10</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-day simplified forecast timeline */}
              <div className="p-4 rounded-3xl bg-white/75 dark:bg-slate-900/35 border border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase font-display">일간 예보 비교</h4>
                <div className="space-y-2">
                  {dataB.daily.slice(0, 3).map((day, idx) => (
                    <div key={`col-b-day-${idx}`} className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-500 dark:text-slate-400 font-medium min-w-[50px]">{day.dayName.slice(0, 3)}</span>
                      <div className="flex items-center gap-1.5 justify-center">
                        <WeatherIcon condition={day.condition} className="w-4 h-4" />
                        <span className="text-[10px] text-slate-400">{day.description.split(' - ').pop()?.slice(0, 10) || day.description}</span>
                      </div>
                      <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">{day.minTemp}° / {day.maxTemp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse flex items-center justify-center text-sm text-slate-400">
              City B 데이터 검색 중...
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
