/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  Snowflake, 
  CloudFog, 
  Wind, 
  Droplet 
} from 'lucide-react';
import { HourlyForecast, DailyForecast, WeatherCondition } from '../types';

export function WeatherIcon({ condition, className = "w-6 h-6" }: { condition: WeatherCondition; className?: string }) {
  switch (condition) {
    case 'Clear':
      return <Sun className={`${className} text-amber-500`} />;
    case 'Clouds':
      return <Cloud className={`${className} text-slate-400`} />;
    case 'Rain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'Drizzle':
      return <CloudDrizzle className={`${className} text-sky-400`} />;
    case 'Thunderstorm':
      return <CloudLightning className={`${className} text-purple-500`} />;
    case 'Snow':
      return <Snowflake className={`${className} text-sky-300`} />;
    case 'Mist':
      return <CloudFog className={`${className} text-zinc-400`} />;
    case 'Windy':
      return <Wind className={`${className} text-teal-500`} />;
    default:
      return <Sun className={`${className} text-amber-500`} />;
  }
}

interface ForecastsProps {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  useCelsius: boolean;
}

export default function Forecasts({ hourly, daily, useCelsius }: ForecastsProps) {
  const formatTemp = (val: number) => `${val}°`;

  // Get localized short name of weather
  const getConditionName = (cond: WeatherCondition) => {
    const map: Record<WeatherCondition, string> = {
      Clear: '맑음',
      Clouds: '흐림',
      Rain: '비',
      Drizzle: '이슬비',
      Thunderstorm: '뇌우',
      Snow: '눈',
      Mist: '안개',
      Windy: '강풍'
    };
    return map[cond] || cond;
  };

  return (
    <div id="forecasts" className="space-y-6">
      {/* Hourly Forecast */}
      <div id="hourly-forecast-widget" className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-display mb-4 flex items-center gap-2 pointer-events-none">
          <span className="w-1.5 h-3 bg-blue-500 rounded-full" />
          시간별 예보 (24시간)
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {hourly.map((hour, idx) => (
            <div
              key={`hour-${idx}`}
              id={`hour-item-${idx}`}
              className="flex flex-col items-center justify-between p-3 min-w-[76px] rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-slate-100/50 dark:border-slate-800/50 text-center"
            >
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono mb-2">
                {hour.time}
              </span>
              <WeatherIcon condition={hour.condition} className="w-7 h-7 mb-2" />
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">
                  {formatTemp(hour.temp)}
                </span>
                {hour.rainProbability > 0 ? (
                  <span className="text-[9px] font-medium text-blue-500 flex items-center gap-0.5 mt-0.5 font-mono">
                    <Droplet className="w-2 h-2 fill-current" />
                    {hour.rainProbability}%
                  </span>
                ) : (
                  <span className="text-[9px] font-sans text-slate-400 mt-0.5">
                    -
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div id="weekly-forecast-widget" className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-display mb-4 flex items-center gap-2 pointer-events-none">
          <span className="w-1.5 h-3 bg-teal-500 rounded-full" />
          중기 예보 (5일간)
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {daily.map((day, idx) => (
            <div
              key={`day-${idx}`}
              id={`day-item-${idx}`}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
            >
              {/* Day & Date info */}
              <div className="flex flex-col justify-start min-w-[100px]">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display">
                  {day.dayName}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {day.date}
                </span>
              </div>

              {/* Weather status */}
              <div className="flex items-center gap-3 justify-center text-center">
                <WeatherIcon condition={day.condition} className="w-6 h-6" />
                <span className="text-xs text-slate-600 dark:text-slate-400 min-w-[50px] text-left">
                  {getConditionName(day.condition)}
                </span>
                {day.rainProbability > 10 && (
                  <span className="text-[10px] text-blue-500 font-medium font-mono flex items-center gap-0.5 min-w-[40px]">
                    <Droplet className="w-2.5 h-2.5 fill-current" />
                    {day.rainProbability}%
                  </span>
                )}
              </div>

              {/* Temperature min/max range */}
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-slate-400 dark:text-slate-500">
                  {formatTemp(day.minTemp)}
                </span>
                {/* Visual horizontal track */}
                <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 left-[20%] right-[30%] bg-gradient-to-r from-blue-400 to-amber-400 rounded-full" />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {formatTemp(day.maxTemp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
