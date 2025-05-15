import { BaseFactory } from './base';

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
  timestamp: number;
}

export class WeatherFactory extends BaseFactory<WeatherData> {
  protected generate(): WeatherData {
    return {
      temperature: Math.floor(Math.random() * 30) - 10, // -10 to 20 degrees
      description: this.getRandomDescription(),
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 30),
      city: this.getRandomCity(),
      country: 'Hungary',
      timestamp: Date.now(),
    };
  }

  private getRandomDescription(): string {
    const descriptions = [
      'Clear sky',
      'Partly cloudy',
      'Cloudy',
      'Light rain',
      'Heavy rain',
      'Snow',
      'Fog',
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private getRandomCity(): string {
    const cities = ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs'];
    return cities[Math.floor(Math.random() * cities.length)];
  }
}

export const createWeatherFactory = () => new WeatherFactory(); 