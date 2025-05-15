export const createWeatherData = (overrides = {}) => ({
  coord: {
    lon: 24.9355,
    lat: 60.1695,
  },
  weather: [
    {
      id: 801,
      main: 'Clouds',
      description: 'Few Clouds',
      icon: '02d',
    },
  ],
  base: 'stations',
  main: {
    temp: 5.36,
    feels_like: 1.28,
    temp_min: 4.69,
    temp_max: 6.13,
    pressure: 1010,
    humidity: 62,
  },
  visibility: 10000,
  wind: {
    speed: 6.17,
    deg: 310,
  },
  clouds: {
    all: 20,
  },
  dt: 1667130606,
  sys: {
    type: 2,
    id: 2011913,
    country: 'FI',
    sunrise: 1667108234,
    sunset: 1667140226,
  },
  timezone: 7200,
  id: 658225,
  name: 'Helsinki',
  cod: 200,
  ...overrides
});

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