const createWeatherData = (overrides = {}) => ({
  name: 'London',
  main: {
    temp: 20,
    feels_like: 19,
    humidity: 65,
    pressure: 1015,
  },
  weather: [{
    id: 800,
    main: 'Clear',
    description: 'clear sky',
    icon: '01d',
  }],
  wind: {
    speed: 5.2,
    deg: 280,
  },
  sys: {
    country: 'GB',
    sunrise: 1600000000,
    sunset: 1600040000,
  },
  ...overrides,
});

const createForecastData = (overrides = {}) => ({
  list: [
    {
      dt: 1600000000,
      main: {
        temp: 20,
        feels_like: 19,
        humidity: 65,
        pressure: 1015,
      },
      weather: [{
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      }],
      wind: {
        speed: 5.2,
        deg: 280,
      },
    },
  ],
  city: {
    name: 'London',
    country: 'GB',
    sunrise: 1600000000,
    sunset: 1600040000,
  },
  ...overrides,
});

module.exports = {
  createWeatherData,
  createForecastData,
};

export const createErrorResponse = (status = 404, message = 'Not Found') => ({
  status,
  message,
  error: true
});

export const createTestCities = () => [
  'London',
  'Paris',
  'New York',
  'Tokyo',
  'Sydney',
  'Berlin',
  'Rome',
  'Madrid',
  'Amsterdam',
  'Vienna'
]; 