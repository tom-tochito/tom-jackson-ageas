export interface WeatherData {
  date: string;
  dayOfWeek: string;
  temperature: {
    max: number;
    min: number;
  };
  condition: string;
  windSpeed: number;
  precipitation: {
    probability: number;
    sum: number;
  };
  sunrise: string;
  sunset: string;
}

export interface WeatherResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    windspeed_10m_max: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
  };
} 