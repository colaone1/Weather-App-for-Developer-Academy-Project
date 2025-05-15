import { fetchWeatherApi } from 'openmeteo';

const weatherapi_url = "https://api.open-meteo.com/v1/forecast";

export class WeatherApiClient {
  constructor() {
    this.cities = [
      { 
        name: "London",
        latitude: 51.5085, 
        longitude: -0.1257 
      },
      { 
        name: "Madrid",
        latitude: 40.4165, 
        longitude: -3.7026 
      },
      { 
        name: "Tokyo", 
        latitude: 35.6895, 
        longitude: 139.6917 
      },
      { 
        name: "New York", 
        latitude: 40.7143, 
        longitude: -74.006 
      },
      { 
        name: "Rio de Janeiro", 
        latitude: -22.9064, 
        longitude: -43.1822
      },
      { 
        name: "Sydney", 
        latitude: -33.8678, 
        longitude: 151.2073
      }
    ];
  }

  async getSingleCityWeather(index) {
    const city = this.cities[index];

    const params = {
      latitude: [city.latitude],
      longitude: [city.longitude],
      daily: ["temperature_2m_max", "wind_speed_10m_max", "precipitation_sum", "precipitation_probability_max", "temperature_2m_min", "weather_code"],
      timezone: "auto",
      wind_speed_unit: "mph"
    };

    try {
      const responses = await fetchWeatherApi(weatherapi_url, params);
      const response = responses[0];
      
      const daily = response.daily();
      const utcOffsetSeconds = response.utcOffsetSeconds();

      return {
        city: city.name,
        coordinates: {
          latitude: response.latitude(),
          longitude: response.longitude(),
        },
        timezone: {
          name: response.timezone(),
          abbreviation: response.timezoneAbbreviation(),
          utcOffset: utcOffsetSeconds
        },
        daily: {
          time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map((_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)),
          temperature2mMax: daily.variables(0).valuesArray(),
          windSpeed10mMax: daily.variables(1).valuesArray(),
          precipitationSum: daily.variables(2).valuesArray(),
          precipitationProbabilityMax: daily.variables(3).valuesArray(),
          temperature2mMin: daily.variables(4).valuesArray(),
          weatherCode: daily.variables(5).valuesArray(),
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch weather data for ${city.name}`);
    }
  }
}

export const weatherApiClient = new WeatherApiClient(); 