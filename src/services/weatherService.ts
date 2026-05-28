import { WeatherData, HourlyForecast, DailyForecast, WeatherCondition, PresetCity } from '../types';

export const PRESET_CITIES: PresetCity[] = [
  { id: 'seoul', name: 'Seoul', localName: '서울', country: 'KR', lat: 37.5665, lon: 126.9780 },
  { id: 'busan', name: 'Busan', localName: '부산', country: 'KR', lat: 35.1796, lon: 129.0756 },
  { id: 'jeju', name: 'Jeju', localName: '제주', country: 'KR', lat: 33.4996, lon: 126.5312 },
  { id: 'tokyo', name: 'Tokyo', localName: '도쿄', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { id: 'new_york', name: 'New York', localName: '뉴욕', country: 'US', lat: 40.7128, lon: -74.0060 },
  { id: 'london', name: 'London', localName: '런던', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { id: 'paris', name: 'Paris', localName: '파리', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { id: 'sydney', name: 'Sydney', localName: '시드니', country: 'AU', lat: -33.8688, lon: 151.2093 }
];

// Helper to generate consistent pseudo-random values based on a string seed (for offline/simulate mode)
function cyrb128(str: string): number[] {
  let h1 = 1779033703, h2 = 3024733165, h3 = 3362453659, h4 = 50249321;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function sfc32(a: number, b: number, c: number, d: number) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  }
}

// Make a deterministic RNG for a city name, so it returns identical weather every time you search it in simulated mode.
function getRNG(seed: string) {
  const seeds = cyrb128(seed);
  return sfc32(seeds[0], seeds[1], seeds[2], seeds[3]);
}

// Map OpenWeather code to WeatherCondition
function mapOWMToCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return 'Thunderstorm';
  if (id >= 300 && id < 400) return 'Drizzle';
  if (id >= 500 && id < 600) return 'Rain';
  if (id >= 600 && id < 700) return 'Snow';
  if (id >= 700 && id < 800) return 'Mist';
  if (id === 800) return 'Clear';
  if (id > 800 && id < 900) return 'Clouds';
  return 'Clear';
}

const CONDITION_DESCRIPTIONS_KR: Record<WeatherCondition, string> = {
  Clear: '맑음',
  Clouds: '구름 많음',
  Rain: '비',
  Drizzle: '이슬비',
  Thunderstorm: '뇌우',
  Snow: '눈',
  Mist: '안개',
  Windy: '강풍'
};

const DETAILED_DESCRIPTIONS_KR: Record<WeatherCondition, string[]> = {
  Clear: ['구름 한 점 없는 화창하고 맑은 날씨입니다.', '햇살이 따사롭고 가시거리가 매우 좋습니다.', '야외 활동을 하기에 아주 완벽한 맑은 날입니다.'],
  Clouds: ['하늘이 구름으로 가득 덮여 흐린 분위기입니다.', '간혹 구름 사이로 햇살이 비치는 날씨입니다.', '뭉게구름이 많이 끼어 야외 활동 지수가 보통입니다.'],
  Rain: ['줄기차게 비가 내리고 있습니다. 우산을 꼭 챙기세요.', '대지를 촉촉하게 적시는 비 소식이 있습니다.', '비와 함께 돌풍이 불 수 있으니 안전에 주의하세요.'],
  Drizzle: ['안개비가 부슬부슬 내리고 있어 공기가 매우 습합니다.', '가벼운 이슬비가 내리는 가라앉은 분위기입니다.', '창가에 맑은 이슬비가 맺히는 차분한 날씨입니다.'],
  Thunderstorm: ['엄청난 천둥번개와 함께 무서운 폭우가 몰아치고 있습니다.', '우르릉쾅쾅 번개를 동반한 소나기가 쏟아집니다.', '강력한 뇌우가 내리치므로 실내에 머무르는 것을 권장합니다.'],
  Snow: ['하늘에서 새하얀 함박눈이 부드럽게 날리며 쌓이고 있습니다.', '공기가 차갑고 하얀 눈이 세상을 덮어가고 있습니다.', '소복소복 쌓이는 눈과 함께 낭만적인 겨울 풍경이 펼쳐집니다.'],
  Mist: ['뿌연 안개가 시야를 가려 고요하고 신비로운 풍경입니다.', '안개와 미세 먼지가 섞여 가시거리가 조금 제한됩니다.', '공기 중에 수증기가 꽉 들어차 차분하고 조용한 안개 아침입니다.'],
  Windy: ['강한 바람이 매섭게 몰아치고 있습니다. 겉옷을 단단히 여미세요.', '모자가 날아갈 정도로 시원하면서 거센 강풍이 붑니다.', '바람 소리가 윙윙 소리 내며 불고 있으니 창문을 꼭 닫아주세요.']
};

export interface ResponseData {
  current: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export async function getWeatherData(query: string, useCelsius: boolean = true): Promise<ResponseData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const isPreset = PRESET_CITIES.find(
    c => c.name.toLowerCase() === query.toLowerCase() || c.localName === query
  );

  // If real API key is configured, fetch actual data!
  if (apiKey && apiKey.trim() !== "" && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "VITE_OPENWEATHER_API_KEY") {
    try {
      let lat = 37.5665;
      let lon = 126.9780;
      let name = query;
      let country = 'KR';

      // 1. Convert city query to coordinates via OpenWeather Direct Geocoding api
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) throw new Error('Geocoding search failed');
      const geoData = await geoResponse.json();

      if (geoData && geoData.length > 0) {
        lat = geoData[0].lat;
        lon = geoData[0].lon;
        name = geoData[0].local_names?.ko || geoData[0].name;
        country = geoData[0].country;
      } else {
        // Fallback or throw error if not found
        throw new Error(`도시를 찾을 수 없습니다: ${query}`);
      }

      // 2. Fetch current weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${useCelsius ? 'metric' : 'imperial'}&lang=kr`;
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) throw new Error('Weather fetch failed');
      const weatherDataRaw = await weatherResponse.json();

      // 3. Fetch 5-day / 3-hour forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${useCelsius ? 'metric' : 'imperial'}&lang=kr`;
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) throw new Error('Forecast fetch failed');
      const forecastDataRaw = await forecastResponse.json();

      // Map dynamic weather response
      const condition = mapOWMToCondition(weatherDataRaw.weather[0].id);
      
      const formatTime = (timestampSec: number) => {
        const date = new Date(timestampSec * 1000);
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
      };

      const current: WeatherData = {
        cityName: name,
        countryName: country,
        lat,
        lon,
        temperature: Math.round(weatherDataRaw.main.temp),
        feelsLike: Math.round(weatherDataRaw.main.feels_like),
        minTemp: Math.round(weatherDataRaw.main.temp_min),
        maxTemp: Math.round(weatherDataRaw.main.temp_max),
        condition,
        description: weatherDataRaw.weather[0].description,
        humidity: weatherDataRaw.main.humidity,
        windSpeed: weatherDataRaw.wind.speed,
        pressure: weatherDataRaw.main.pressure,
        uvIndex: 4.5, // Standard mock UV as OpenWeather free tier doesn't serve UV easily
        sunrise: formatTime(weatherDataRaw.sys.sunrise),
        sunset: formatTime(weatherDataRaw.sys.sunset),
        isRealApi: true,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
      };

      // Raw elements map to hourly
      const hourly: HourlyForecast[] = forecastDataRaw.list.slice(0, 8).map((item: any) => {
        const date = new Date(item.dt * 1000);
        return {
          time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
          temp: Math.round(item.main.temp),
          condition: mapOWMToCondition(item.weather[0].id),
          rainProbability: Math.round((item.pop || 0) * 1000) / 10 // pop is 0 to 1
        };
      });

      // Group forecast lists by day for 5-day forecast
      const dailyMap: Record<string, any[]> = {};
      forecastDataRaw.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayLabel = date.toLocaleDateString('ko-KR', { weekday: 'long' });
        if (!dailyMap[dayLabel]) dailyMap[dayLabel] = [];
        dailyMap[dayLabel].push(item);
      });

      const dayNames = Object.keys(dailyMap).slice(0, 5);
      const daily: DailyForecast[] = dayNames.map((dayName) => {
        const list = dailyMap[dayName];
        let max = -999;
        let min = 999;
        let rainSum = 0;
        const conditionCount: Record<string, number> = {};

        list.forEach((item) => {
          if (item.main.temp_max > max) max = item.main.temp_max;
          if (item.main.temp_min < min) min = item.main.temp_min;
          rainSum += item.pop || 0;
          const cond = mapOWMToCondition(item.weather[0].id);
          conditionCount[cond] = (conditionCount[cond] || 0) + 1;
        });

        const mostFrequentCondition = Object.keys(conditionCount).reduce((a, b) => 
          conditionCount[a] > conditionCount[b] ? a : b
        ) as WeatherCondition;

        const maxPop = Math.min(100, Math.round((rainSum / list.length) * 100));

        const dummyDate = new Date(list[0].dt * 1000);
        const formattedDate = dummyDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });

        return {
          dayName,
          date: formattedDate,
          minTemp: Math.round(min),
          maxTemp: Math.round(max),
          condition: mostFrequentCondition,
          rainProbability: maxPop,
          description: list[0].weather[0].description
        };
      });

      return { current, hourly, daily };
    } catch (e) {
      console.warn("API request failed or query not found. Falling back to Simulated Weather.", e);
      // Run fallback simulation if the external query fails
    }
  }

  // SIMULATION MODE
  // We formulate a fully immersive, animated, and realistic weather simulator.
  // Using deterministic seeds, users can type a custom city and get custom, believable weather!
  const matchedPreset = PRESET_CITIES.find(
    c => c.name.toLowerCase() === query.toLowerCase() || c.localName === query
  );

  const cityName = matchedPreset ? matchedPreset.localName : query;
  const countryName = matchedPreset ? matchedPreset.country : 'KR';
  
  // Use a hash of cityName to generate beautiful pseudo-random weather parameters
  const rng = getRNG(cityName);
  const randVal = rng(); // [0.0 - 1.0]

  // Decide predominant weather layout
  const conditions: WeatherCondition[] = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist', 'Windy'];
  let condition: WeatherCondition = 'Clear';
  if (randVal < 0.25) condition = 'Clear';
  else if (randVal < 0.50) condition = 'Clouds';
  else if (randVal < 0.65) condition = 'Rain';
  else if (randVal < 0.73) condition = 'Drizzle';
  else if (randVal < 0.80) condition = 'Thunderstorm';
  else if (randVal < 0.88) condition = 'Snow';
  else if (randVal < 0.94) condition = 'Mist';
  else condition = 'Windy';

  // Certain preset adjustments to make them fit local seasonal averages
  if (matchedPreset) {
    if (matchedPreset.id === 'seoul' || matchedPreset.id === 'busan') {
      // Seoul is warm clear in May (late spring/early summer)
      condition = (randVal < 0.4) ? 'Clear' : (randVal < 0.75) ? 'Clouds' : 'Rain';
    } else if (matchedPreset.id === 'jeju') {
      condition = (randVal < 0.3) ? 'Clear' : (randVal < 0.7) ? 'Clouds' : (randVal < 0.9) ? 'Rain' : 'Windy';
    } else if (matchedPreset.id === 'london') {
      condition = (randVal < 0.5) ? 'Clouds' : (randVal < 0.85) ? 'Drizzle' : 'Rain';
    } else if (matchedPreset.id === 'sydney') {
      // Sydney is in late autumn/winter in May
      condition = (randVal < 0.6) ? 'Clear' : 'Clouds';
    }
  }

  // Temperature ranges based on condition and city hash
  let baseTemp = 18; // base
  if (condition === 'Clear') baseTemp = 23 + Math.round(rng() * 6);
  else if (condition === 'Clouds') baseTemp = 19 + Math.round(rng() * 5);
  else if (condition === 'Rain' || condition === 'Drizzle') baseTemp = 15 + Math.round(rng() * 4);
  // Snow in May only if high altitude/winter hemisphere or just fun simulation
  else if (condition === 'Snow') baseTemp = -2 - Math.round(rng() * 5); 
  else if (condition === 'Thunderstorm') baseTemp = 22 + Math.round(rng() * 5);
  else if (condition === 'Mist') baseTemp = 14 + Math.round(rng() * 4);
  else if (condition === 'Windy') baseTemp = 16 + Math.round(rng() * 5);

  // If Sydney is chosen and it's late autumn, shift lower
  if (matchedPreset?.id === 'sydney') baseTemp -= 6;
  if (!useCelsius) {
    baseTemp = (baseTemp * 9 / 5) + 32;
  }

  const degStep = useCelsius ? 1 : 1.8;
  const currentTemp = Math.round(baseTemp);
  const minTemp = Math.round(baseTemp - (3 + rng() * 4) * degStep);
  const maxTemp = Math.round(baseTemp + (3 + rng() * 4) * degStep);
  const feelsLike = Math.round(baseTemp + (condition === 'Thunderstorm' ? 2 : condition === 'Rain' ? -1 : condition === 'Windy' ? -3 : 1) * degStep);

  const humidity = condition === 'Rain' || condition === 'Thunderstorm' 
    ? 85 + Math.round(rng() * 15) 
    : condition === 'Drizzle' 
    ? 90 + Math.round(rng() * 10) 
    : condition === 'Mist' 
    ? 95 + Math.round(rng() * 5)
    : condition === 'Clear' 
    ? 35 + Math.round(rng() * 20) 
    : 55 + Math.round(rng() * 25);

  const windSpeed = condition === 'Windy' 
    ? 12 + Math.round(rng() * 10) 
    : condition === 'Thunderstorm' 
    ? 9 + Math.round(rng() * 7) 
    : 1.5 + Math.round(rng() * 5);

  const pressure = condition === 'Clear' 
    ? 1018 + Math.round(rng() * 7) 
    : condition === 'Rain' || condition === 'Thunderstorm' 
    ? 998 + Math.round(rng() * 8) 
    : 1008 + Math.round(rng() * 10);

  const uvIndex = condition === 'Clear' 
    ? 7 + Math.round(rng() * 3) 
    : condition === 'Clouds' || condition === 'Windy' 
    ? 3 + Math.round(rng() * 2) 
    : 1;

  // Let's create beautiful dynamic descriptions
  const descOptions = DETAILED_DESCRIPTIONS_KR[condition];
  const descIndex = Math.floor(rng() * descOptions.length);
  const description = descOptions[descIndex];

  const current: WeatherData = {
    cityName,
    countryName,
    temperature: currentTemp,
    feelsLike,
    minTemp,
    maxTemp,
    condition,
    description: `시뮬레이션: ${CONDITION_DESCRIPTIONS_KR[condition]} - ${description}`,
    humidity,
    windSpeed: Math.round(windSpeed * 10) / 10,
    pressure,
    uvIndex,
    sunrise: "05:12 AM",
    sunset: "07:38 PM",
    isRealApi: false,
    timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
  };

  // Generate hourly forecasts
  const hourly: HourlyForecast[] = [];
  const hours = [8, 11, 14, 17, 20, 23, 2, 5];
  const currentHour = new Date().getHours();

  for (let i = 0; i < 8; i++) {
    const targetHour = (currentHour + i * 3) % 24;
    const hourLabel = `${targetHour < 10 ? '0' : ''}${targetHour}:00`;
    
    // diurnal cycle factor - hotter afternoon
    const sinFactor = Math.sin(((targetHour - 6) / 24) * 2 * Math.PI);
    const hourlyOffset = sinFactor * (3 + rng() * 2) * degStep;
    const temp = Math.round(baseTemp + hourlyOffset);

    // Weather condition variation for hourly
    let hCondition = condition;
    if (rng() > 0.75) {
      // Small fluctuation
      const alternativeCons: WeatherCondition[] = ['Clouds', 'Clear', 'Windy'];
      hCondition = alternativeCons[Math.floor(rng() * alternativeCons.length)];
    }

    const rainProbability = hCondition === 'Rain' || hCondition === 'Thunderstorm' 
      ? 80 + Math.round(rng() * 20) 
      : hCondition === 'Drizzle' 
      ? 60 + Math.round(rng() * 30) 
      : hCondition === 'Clouds' 
      ? 15 + Math.round(rng() * 30) 
      : 0;

    hourly.push({
      time: hourLabel,
      temp,
      condition: hCondition,
      rainProbability
    });
  }

  // Generate 5-day forecasts
  const daily: DailyForecast[] = [];
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const todayIndex = new Date().getDay();

  for (let i = 1; i <= 5; i++) {
    const dayIndex = (todayIndex + i) % 7;
    const dayName = weekdays[dayIndex];
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);
    const dateLabel = `${futureDate.getMonth() + 1}월 ${futureDate.getDate()}일`;

    const dayRng = getRNG(`${cityName}_day_${i}`);
    const dayRand = dayRng();
    
    let dayCondition = condition;
    if (dayRand > 0.6) {
      const weatherPool: WeatherCondition[] = ['Clear', 'Clouds', 'Rain', 'Windy'];
      dayCondition = weatherPool[Math.floor(dayRand * weatherPool.length)];
    }

    const maxOffset = (dayRng() * 4 - 2) * degStep;
    const minOffset = (dayRng() * 4 - 2) * degStep;

    const maxT = Math.round(maxTemp + maxOffset);
    const minT = Math.round(minTemp + minOffset);

    const rainProbability = dayCondition === 'Rain' || dayCondition === 'Thunderstorm' 
      ? 70 + Math.round(dayRng() * 30) 
      : dayCondition === 'Clouds' 
      ? 20 + Math.round(dayRng() * 40) 
      : 5;

    daily.push({
      dayName,
      date: dateLabel,
      minTemp: minT,
      maxTemp: maxT,
      condition: dayCondition,
      rainProbability,
      description: CONDITION_DESCRIPTIONS_KR[dayCondition]
    });
  }

  return { current, hourly, daily };
}
