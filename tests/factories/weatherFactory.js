export const createWeatherData = (overrides = {}) => ({
  weather: [{
    id: 800,
    main: 'Clear',
    description: 'clear sky',
    icon: '01d'
  }],
  main: {
    temp: 20,
    feels_like: 19,
    temp_min: 18,
    temp_max: 22,
    pressure: 1015,
    humidity: 65
  },
  wind: {
    speed: 5.2,
    deg: 180
  },
  clouds: {
    all: 0
  },
  sys: {
    country: 'GB',
    sunrise: 1600000000,
    sunset: 1600040000
  },
  name: 'London',
  ...overrides
});

export const createForecastData = (overrides = {}) => ({
  list: [
    {
      dt: 1600000000,
      main: {
        temp: 20,
        feels_like: 19,
        temp_min: 18,
        temp_max: 22,
        pressure: 1015,
        humidity: 65
      },
      weather: [{
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      clouds: {
        all: 0
      },
      wind: {
        speed: 5.2,
        deg: 180
      },
      visibility: 10000,
      pop: 0,
      dt_txt: '2023-01-01 12:00:00'
    }
  ],
  city: {
    id: 2643743,
    name: 'London',
    country: 'GB',
    population: 1000000,
    timezone: 0,
    sunrise: 1600000000,
    sunset: 1600040000
  },
  ...overrides
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