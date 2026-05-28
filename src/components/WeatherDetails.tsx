/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Wind, 
  Droplets, 
  Sun, 
  Gauge, 
  Sunrise, 
  Sunset, 
  Thermometer, 
  Info 
} from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherDetailsProps {
  data: WeatherData;
  useCelsius: boolean;
}

export default function WeatherDetails({ data, useCelsius }: WeatherDetailsProps) {
  const formatTemp = (val: number) => `${val}°${useCelsius ? 'C' : 'F'}`;

  const detailItems = [
    {
      id: 'feels-like',
      icon: <Thermometer className="w-5 h-5 text-rose-500" />,
      label: '체감 온도',
      value: formatTemp(data.feelsLike),
      description: `실제 피부로 느끼는 온도입니다.`,
      color: 'bg-rose-500/5 border-rose-500/10'
    },
    {
      id: 'humidity',
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      label: '습도',
      value: `${data.humidity}%`,
      description: data.humidity > 70 
        ? '공기 중 수증기가 많아 다소 꿉꿉합니다.' 
        : data.humidity < 40 
        ? '실내가 건조하므로 수분을 보충하세요.' 
        : '활동하기에 쾌적하고 맑은 습도입니다.',
      color: 'bg-blue-500/5 border-blue-500/10'
    },
    {
      id: 'wind',
      icon: <Wind className="w-5 h-5 text-teal-500" />,
      label: '바람 속도',
      value: `${data.windSpeed} m/s`,
      description: data.windSpeed > 8 
        ? '바람이 강해 체감 온도가 낮아질 수 있습니다.' 
        : data.windSpeed > 4 
        ? '나뭇잎이 가볍게 흔들릴 정도입니다.' 
        : '바람이 거의 없는 고요한 상태입니다.',
      color: 'bg-teal-500/5 border-teal-500/10'
    },
    {
      id: 'uv',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      label: '자외선 지수',
      value: `${data.uvIndex} / 10`,
      description: data.uvIndex > 5 
        ? '햇빛이 강하니 선크림을 꼭 바르세요.' 
        : '보통 수준이며, 장시간 노출만 피하세요.',
      color: 'bg-amber-500/5 border-amber-500/10'
    },
    {
      id: 'pressure',
      icon: <Gauge className="w-5 h-5 text-indigo-500" />,
      label: '기압',
      value: `${data.pressure} hPa`,
      description: data.pressure > 1013 
        ? '대기 상태가 안정적인 고기압 권역입니다.' 
        : '비나 눈이 몰려올 가능성이 있는 저기압입니다.',
      color: 'bg-indigo-500/5 border-indigo-500/10'
    },
    {
      id: 'sun-cycle',
      icon: <Sunrise className="w-5 h-5 text-orange-500" />,
      label: '일출 / 일몰',
      value: data.sunrise.replace(' AM', '') + ' / ' + data.sunset.replace(' PM', ''),
      description: `오늘의 해 뜨는 시각과 지는 시각입니다.`,
      color: 'bg-orange-500/5 border-orange-500/10'
    }
  ];

  return (
    <div id="weather-details-grid" className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {detailItems.map((item) => (
        <div
          key={item.id}
          id={`detail-widget-${item.id}`}
          className={`flex flex-col justify-between p-4 rounded-2xl border ${item.color} backdrop-blur-md bg-white/70 dark:bg-slate-900/50 transition-all hover:scale-[1.02] duration-300 shadow-sm`}
        >
          <div className="flex items-center justify-between pointer-events-none mb-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-display">
              {item.label}
            </span>
            {item.icon}
          </div>
          <div className="pointer-events-none">
            <h4 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display mb-1">
              {item.value}
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
