import { useState, useEffect, useRef } from 'react';
import { getLocationSuggestions, LocationSuggestion } from '../../services/weatherService';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (location: LocationSuggestion) => void;
  isLoading: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (location.trim().length >= 2) {
      searchTimeout.current = setTimeout(async () => {
        try {
          const results = await getLocationSuggestions(location);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && !isLoading) {
      if (suggestions.length > 0 && selectedIndex === -1) {
        handleSuggestionClick(suggestions[0]);
      } else if (selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex]);
      }
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const locationString = `${suggestion.name}, ${suggestion.admin1 ? `${suggestion.admin1}, ` : ''}${suggestion.country}`;
    setLocation(locationString);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter city name..."
          className={styles.searchInput}
          disabled={isLoading}
        />
        <button type="submit" className={styles.searchButton} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.name}-${suggestion.country}`}
              className={`${styles.suggestionItem} ${index === selectedIndex ? styles.selected : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}
              <span className={styles.locationDetails}>
                {suggestion.admin1 ? `${suggestion.admin1}, ` : ''}{suggestion.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 