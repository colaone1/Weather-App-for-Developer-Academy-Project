import { createWeatherFactory } from '../factories/weather';

export const mockWeatherApi = {
  getCurrentWeather: (city: string) => {
    const weatherData = createWeatherFactory().build({ city });
    return Promise.resolve({
      status: 200,
      data: weatherData,
    });
  },

  getForecast: (city: string, days: number = 5) => {
    const forecast = createWeatherFactory().buildMany(days, { city });
    return Promise.resolve({
      status: 200,
      data: forecast,
    });
  },

  mockError: () => {
    return Promise.reject({
      status: 404,
      message: 'City not found',
    });
  },
};

export const setupWeatherApiMocks = () => {
  // This can be used to set up global mocks for the weather API
  // Implementation will depend on how the weather app makes API calls
  return {
    restore: () => {
      // Cleanup function
    },
  };
}; 