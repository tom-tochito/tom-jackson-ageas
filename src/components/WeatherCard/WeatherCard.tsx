import { WeatherData } from '../../types/weather';
import styles from './WeatherCard.module.css';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear sky':
        return '/images/clear-sky.svg';
      case 'mainly clear':
      case 'partly cloudy':
        return '/images/cloudy.svg';
      case 'overcast':
        return '/images/overcast.svg';
      case 'rain':
      case 'rain showers':
      case 'drizzle':
        return '/images/rain.svg';
      case 'snow':
      case 'snow grains':
      case 'snow showers':
        return '/images/snow.svg';
      case 'thunderstorm':
      case 'thunderstorm with hail':
        return '/images/thunderstorms.svg';
      case 'foggy':
        return '/images/wind.svg';
      default:
        return '/images/cloudy.svg';
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.day}>{weather.dayOfWeek}</h2>
      <p className={styles.date}>{weather.date}</p>
      <div className={styles.details}>
        <img 
          src={getWeatherIcon(weather.condition)} 
          alt={weather.condition}
          className={styles.weatherIcon}
        />
        <div className={styles.temperature}>
          <span className={styles.tempMax}>{weather.temperature.max}°</span>
          <span className={styles.tempMin}>{weather.temperature.min}°</span>
        </div>
        <p className={styles.condition}>{weather.condition}</p>
        <p className={styles.wind}>Wind: {weather.windSpeed} km/h</p>
        <div className={styles.precipitation}>
          <p>Precipitation: {weather.precipitation.sum}mm</p>
          <p>Chance: {weather.precipitation.probability}%</p>
        </div>
        <div className={styles.sunTime}>
          <p>🌅 {weather.sunrise}</p>
          <p>🌇 {weather.sunset}</p>
        </div>
      </div>
    </div>
  );
}; 