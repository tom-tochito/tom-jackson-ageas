import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = vi.fn()

  it('renders search input', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />)
    expect(screen.getByPlaceholderText('Enter city name...')).toBeInTheDocument()
  })

  it('renders search button', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />)
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })
}) 