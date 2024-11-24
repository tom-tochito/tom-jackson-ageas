import { WeatherData, WeatherResponse } from '../types/weather';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';
const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

export interface LocationSuggestion {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const getWeatherCode = (code: number): string => {
  switch (code) {
    case 0:
      return 'Clear sky';
    case 1:
      return 'Mainly clear';
    case 2:
      return 'Partly cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Foggy';
    case 51:
    case 53:
    case 55:
      return 'Drizzle';
    case 56:
    case 57:
      return 'Freezing Drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain';
    case 66:
    case 67:
      return 'Freezing Rain';
    case 71:
    case 73:
    case 75:
      return 'Snow';
    case 77:
      return 'Snow grains';
    case 80:
    case 81:
    case 82:
      return 'Rain showers';
    case 85:
    case 86:
      return 'Snow showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Thunderstorm with hail';
    default:
      return 'Unknown';
  }
};

export const getLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  if (!query.trim() || query.length < 2) return [];

  try {
    const response = await fetch(
      `${GEO_BASE_URL}/search?` + new URLSearchParams({
        name: query,
        count: '5',
        language: 'en',
        format: 'json'
      })
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    const data = await response.json();
    
    if (!data.results?.length) return [];
    
    return data.results.map((result: any) => ({
      name: result.name,
      country: result.country,
      admin1: result.admin1,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone
    }));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

export const getWeatherForecast = async (location: LocationSuggestion): Promise<WeatherData[]> => {
  try {
    const url = new URL(`${WEATHER_BASE_URL}/forecast`);
    url.searchParams.set('latitude', location.latitude.toString());
    url.searchParams.set('longitude', location.longitude.toString());
    url.searchParams.set('timezone', location.timezone);
    url.searchParams.set('forecast_days', '5');
    
    url.searchParams.append('daily', 'temperature_2m_max');
    url.searchParams.append('daily', 'temperature_2m_min');
    url.searchParams.append('daily', 'weathercode');
    url.searchParams.append('daily', 'windspeed_10m_max');
    url.searchParams.append('daily', 'precipitation_probability_max');
    url.searchParams.append('daily', 'precipitation_sum');
    url.searchParams.append('daily', 'sunrise');
    url.searchParams.append('daily', 'sunset');

    const weatherResponse = await fetch(url.toString());

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error('Weather API error:', errorText);
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData: WeatherResponse = await weatherResponse.json();
    
    return weatherData.daily.time.map((date, index) => ({
      date: new Date(date).toLocaleDateString(),
      dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
      temperature: {
        max: Math.round(weatherData.daily.temperature_2m_max[index]),
        min: Math.round(weatherData.daily.temperature_2m_min[index])
      },
      condition: getWeatherCode(weatherData.daily.weathercode[index]),
      windSpeed: Math.round(weatherData.daily.windspeed_10m_max[index]),
      precipitation: {
        probability: weatherData.daily.precipitation_probability_max[index],
        sum: Math.round(weatherData.daily.precipitation_sum[index] * 10) / 10
      },
      sunrise: new Date(weatherData.daily.sunrise[index]).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sunset: new Date(weatherData.daily.sunset[index]).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));
  } catch (error) {
    console.error('Error in getWeatherForecast:', error);
    throw error;
  }
}; 