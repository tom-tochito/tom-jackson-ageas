import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeatherCard } from './WeatherCard'

describe('WeatherCard', () => {
  const mockWeatherData = {
    date: '2024-02-28',
    dayOfWeek: 'Wednesday',
    temperature: {
      max: 20,
      min: 10,
    },
    condition: 'Clear sky',
    windSpeed: 15,
    precipitation: {
      probability: 20,
      sum: 0.5,
    },
    sunrise: '07:00',
    sunset: '19:00',
  }

  it('renders the weather card component', () => {
    render(<WeatherCard weather={mockWeatherData} />)
    expect(screen.getByText('Wednesday')).toBeInTheDocument()
  })

  it('displays temperature information', () => {
    render(<WeatherCard weather={mockWeatherData} />)
    expect(screen.getByText('20°')).toBeInTheDocument()
    expect(screen.getByText('10°')).toBeInTheDocument()
  })
}) 