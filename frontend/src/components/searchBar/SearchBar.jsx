import React, { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import './SearchBar.css';

const SearchBar = memo(({ onSearch, onLocationClick }) => {
  const [inputValue, setInputValue] = useState('');

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim()) {
        onSearch(value);
      }
    }, 500),
    [onSearch]
  );

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  }, [inputValue, onSearch]);

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input-field"
        placeholder="Enter city name..."
        value={inputValue}
        onChange={handleInputChange}
        aria-label="City search"
      />
      <button type="submit" className="btn-search">
        Search
      </button>
      <button
        type="button"
        className="btn-location"
        onClick={onLocationClick}
        aria-label="Get weather for current location"
      >
        <span role="img" aria-label="location">📍</span>
      </button>
    </form>
  );
});

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onLocationClick: PropTypes.func.isRequired,
};

export default SearchBar; 