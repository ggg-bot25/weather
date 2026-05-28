/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Settings, 
  HelpCircle, 
  RefreshCw, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as weatherService from './services/weatherService';
import { ResponseData } from './services/weatherService';
import CitySearch from './components/CitySearch';
import WeatherVisual from './components/WeatherVisual';
import WeatherDetails from './components/WeatherDetails';
import Forecasts from './components/Forecasts';

export default function App() {
  const [query, setQuery] = useState('서울');
  const [data, setData] = useState<ResponseData | null>(null);
  const [useCelsius, setUseCelsius] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  // Check if API key is set in env
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const isApiConfigured = !!(apiKey && apiKey.trim() !== "" && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "VITE_OPENWEATHER_API_KEY");

  const loadWeather = async (targetCity: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await weatherService.getWeatherData(targetCity, useCelsius);
      setData(response);
      setQuery(targetCity);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '날씨 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger load on query or metric switch
  useEffect(() => {
    loadWeather(query);
  }, [useCelsius]);

  const handleSearch = (city: string) => {
    loadWeather(city);
  };

  const handleRefresh = () => {
    loadWeather(query);
  };

  return (
    <div id="main-app-container" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans py-8 px-4 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* UPPER TITLE / NAV BAR */}
        <header id="app-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60 gap-4">
          <div className="flex items-center gap-3 pointer-events-none">
            <div id="app-logo-bg" className="p-2.5 bg-blue-500 rounded-2xl shadow-md shadow-blue-500/20 text-white">
              <CloudSun className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Aether Weather
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-sans">
                실시간 기상 대기 경험 대시보드
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Celsius/Fahrenheit Metric Switcher */}
            <div id="metric-switch" className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              <button
                type="button"
                onClick={() => setUseCelsius(true)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all font-semibold font-display ${
                  useCelsius 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setUseCelsius(false)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all font-semibold font-display ${
                  !useCelsius 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                °F
              </button>
            </div>

            {/* Help / Guide button */}
            <button
              id="guide-toggle-btn"
              type="button"
              onClick={() => setShowConfigGuide(!showConfigGuide)}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2.5 rounded-xl border transition-all ${
                showConfigGuide 
                  ? 'border-blue-500/30 bg-blue-50/50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' 
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Settings className="w-3.5 h-3.5 animate-spin-slow" />
              <span className="font-semibold hidden sm:inline">API 연동 가이드</span>
            </button>

            {/* Refresh Button */}
            <button
              id="refresh-btn"
              type="button"
              onClick={handleRefresh}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-all active:scale-95"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* API CONFIGURE GUIDE (COLLAPSED BY DEFAULT) */}
        <AnimatePresence>
          {showConfigGuide && (
            <motion.div
              id="guide-box"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-500/10 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">
                      OpenWeatherMap 실시간 날씨 외부 API 연동 안내
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      이 날씨 앱은 API 검색을 편리하게 연동할 수 있도록 설계되어 있습니다. 현재는 고품질 <strong>시뮬레이션 가상 데이터 생성 알고리즘</strong>으로 작동 중입니다.
                      어떤 도시를 새로 검색해도 지리적 특성을 수학적으로 해싱해 일관되고 현실적인 날씨 상태와 5일 시간예보를 즉시 변환 생성해 줍니다!
                    </p>
                  </div>
                </div>

                <div className="pl-8 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">실시간 데이터 수신 방법:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li><a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenWeatherMap</a>에 로그인 후 API Key를 발급받습니다.</li>
                    <li>애플리케이션 프로젝트 파일 시스템의 <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-blue-500">.env</code> 파일에 변수를 구성해 넣습니다:</li>
                    <pre className="bg-slate-800 text-slate-200 p-2.5 rounded-lg mt-1 overflow-x-auto font-mono text-[11px]">
                      VITE_OPENWEATHER_API_KEY="본인의_API_키"
                    </pre>
                    <li>변수를 저장하면 앱이 자동으로 이를 감지하여 위성 Geolocation 좌표 변환을 활성화하고 전 세계의 실시간 기상 관측 데이터를 즉시 받아옵니다.</li>
                  </ol>
                </div>

                <div className="flex gap-2 items-center pl-8">
                  {isApiConfigured ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      실시간 OpenWeather API 가동 중
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" />
                      일기 시뮬레이션 작동 중 (키 미등록)
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CITY SEARCH */}
        <section id="search-section">
          <CitySearch 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            currentCityName={data?.current?.cityName || query} 
          />
        </section>

        {/* ERROR FIELD */}
        {errorMsg && (
          <div id="error-message-box" className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        {/* CORE GRID CONTENT */}
        <div id="app-grid-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: VISUAL SKY CARD (lg:col-span-4) */}
          <section id="visual-showcase" className="lg:col-span-5 h-full">
            {data?.current ? (
              <div className="relative h-full flex flex-col justify-between">
                
                {/* Embedded Visual Sky container */}
                <WeatherVisual condition={data.current.condition} />

                {/* Overlaid Info (Glassmorphism layout inside visual weather frame) */}
                <div id="visual-card-text-overlay" className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 text-white z-10 select-none">
                  
                  {/* Top line metadata */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold tracking-wide uppercase font-display bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                          {data.current.cityName}
                        </span>
                        <span className="text-xs font-semibold text-slate-100 bg-slate-800/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/5 font-mono">
                          {data.current.countryName}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/70 font-mono pl-0.5">
                        동기화 시간: {data.current.timestamp}
                      </p>
                    </div>

                    {/* API Mode Indicator */}
                    <div>
                      {data.current.isRealApi ? (
                        <span className="text-[10px] bg-green-500 text-white font-bold px-2 py-1 rounded-md shadow-sm uppercase font-sans animate-pulse">
                          LIVE
                        </span>
                      ) : (
                        <span className="text-[10px] bg-sky-950/80 text-sky-200 border border-sky-500/30 font-bold px-2 py-1 rounded-md shadow-sm font-sans">
                          SIMULATED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle representation: Temp & status */}
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-1 select-none pointer-events-none">
                      <h2 className="text-6xl md:text-7xl font-extrabold tracking-tight font-display drop-shadow-md">
                        {data.current.temperature}
                      </h2>
                      <span className="text-3xl font-light drop-shadow-sm pointer-events-none">
                        °{useCelsius ? 'C' : 'F'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg md:text-xl font-bold tracking-tight font-display drop-shadow-sm">
                        {data.current.condition === 'Clear' ? '맑음 (Clear)' :
                         data.current.condition === 'Clouds' ? '구름많음 (Clouds)' :
                         data.current.condition === 'Rain' ? '비 (Rain)' :
                         data.current.condition === 'Drizzle' ? '이슬비 (Drizzle)' :
                         data.current.condition === 'Thunderstorm' ? '낙뢰천둥 (Thunderstorm)' :
                         data.current.condition === 'Snow' ? '눈 (Snow)' :
                         data.current.condition === 'Mist' ? '안개 (Mist)' : '강풍 (Windy)'}
                      </h3>
                      <p className="text-xs md:text-sm text-white/85 leading-relaxed drop-shadow-sm font-sans max-w-sm">
                        {data.current.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom metrics summary strip */}
                  <div className="pt-4 border-t border-white/15 flex justify-between text-xs text-white/90">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>최저: <strong>{data.current.minTemp}°</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <span>최고: <strong>{data.current.maxTemp}°</strong></span>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              // Loading visual placeholder skeleton
              <div className="w-full h-[400px] rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse flex items-center justify-center">
                <p className="text-sm text-slate-400">일기 분석 중...</p>
              </div>
            )}
          </section>

          {/* RIGHT: DETAILS, HOURLY & WEEKLY PREVIEW (lg:col-span-8) */}
          <main id="weather-forecast-details" className="lg:col-span-7 space-y-6">
            {data ? (
              <>
                {/* 6 Grid details list widgets */}
                <WeatherDetails data={data.current} useCelsius={useCelsius} />

                {/* Subsections: Hourly & Daily */}
                <Forecasts hourly={data.hourly} daily={data.daily} useCelsius={useCelsius} />
              </>
            ) : (
              // Loading details placeholder
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-900 animate-pulse" />
                  ))}
                </div>
                <div className="h-44 rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse" />
                <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse" />
              </div>
            )}
          </main>

        </div>

        {/* LOWER FOOTER */}
        <footer id="app-footer" className="pt-8 pb-4 text-center text-xs text-slate-400 dark:text-slate-500 pointer-events-none border-t border-slate-100 dark:border-slate-800">
          <p>© 2026 Aether Weather. Crafted with extreme precision for Google AI Studio Web App.</p>
        </footer>

      </div>
    </div>
  );
}
