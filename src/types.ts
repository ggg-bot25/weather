/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WeatherCondition =
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Drizzle'
  | 'Thunderstorm'
  | 'Snow'
  | 'Mist'
  | 'Windy';

export interface WeatherData {
  cityName: string;
  countryName: string;
  lat?: number;
  lon?: number;
  temperature: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  condition: WeatherCondition;
  description: string;
  humidity: number; // in %
  windSpeed: number; // in m/s
  pressure: number; // in hPa
  uvIndex: number;
  sunrise: string; // e.g. "05:24"
  sunset: string; // e.g. "19:42"
  isRealApi: boolean;
  timestamp: string; // e.g. "9:41 AM"
}

export interface HourlyForecast {
  time: string; // e.g. "12:00"
  temp: number;
  condition: WeatherCondition;
  rainProbability: number; // in %
}

export interface DailyForecast {
  dayName: string; // e.g. "Monday"
  date: string; // e.g. "May 28"
  minTemp: number;
  maxTemp: number;
  condition: WeatherCondition;
  rainProbability: number; // in %
  description: string;
}

export interface PresetCity {
  id: string;
  name: string;
  localName: string;
  country: string;
  lat: number;
  lon: number;
}
