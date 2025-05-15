import { combineReducers } from '@reduxjs/toolkit';

// Initial state for weather
const initialWeatherState = {
  currentWeather: null,
  forecast: [],
  loading: false,
  error: null
};

// Weather reducer
const weatherReducer = (state = initialWeatherState, action) => {
  switch (action.type) {
    case 'FETCH_WEATHER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_WEATHER_SUCCESS':
      return {
        ...state,
        currentWeather: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_WEATHER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  weather: weatherReducer
});

export default rootReducer; 