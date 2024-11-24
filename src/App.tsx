import { useState } from 'react'
import { SearchBar } from './components/SearchBar/SearchBar'
import { WeatherCard } from './components/WeatherCard/WeatherCard'
import { getWeatherForecast, LocationSuggestion } from './services/weatherService'
import { WeatherData } from './types/weather'
import styles from './App.module.css'

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSearch = async (location: LocationSuggestion) => {
    try {
      setIsLoading(true)
      setError('')
      const forecast = await getWeatherForecast(location)
      setWeatherData(forecast)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
      setWeatherData([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>5-Day Weather Forecast</h1>
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.weatherGrid}>
        {weatherData.map((weather) => (
          <WeatherCard key={weather.date} weather={weather} />
        ))}
      </div>
    </div>
  )
}

export default App
