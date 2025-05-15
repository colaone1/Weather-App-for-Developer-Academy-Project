/// <reference types="../../types/testing" />
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '../../core/render';
import { createWeatherFactory } from '../../factories/weather';
import { mockWeatherApi } from '../../mocks/weatherApi';
import { PerformanceTracker } from '../../performance/metrics';
import '../setup';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

// Example Weather Card Component
const WeatherCard = ({ weatherData }: { weatherData: WeatherData }) => {
  return (
    <div data-testid="weather-card">
      <h2 data-testid="city-name">{weatherData.city}</h2>
      <div data-testid="temperature">{weatherData.temperature}°C</div>
      <div data-testid="description">{weatherData.description}</div>
      <div data-testid="humidity">Humidity: {weatherData.humidity}%</div>
      <div data-testid="wind-speed">Wind: {weatherData.windSpeed} km/h</div>
    </div>
  );
};

describe('Weather Card Component', () => {
  it('renders weather information correctly', () => {
    // Create test data using our weather factory
    const weatherData = createWeatherFactory().build({
      city: 'Budapest',
      temperature: 20,
      description: 'Sunny',
      humidity: 65,
      windSpeed: 15
    });

    // Render the component with test data
    render(<WeatherCard weatherData={weatherData} />);

    // Assert the rendered content
    const cityName = screen.getByTestId('city-name');
    const temperature = screen.getByTestId('temperature');
    const description = screen.getByTestId('description');
    const humidity = screen.getByTestId('humidity');
    const windSpeed = screen.getByTestId('wind-speed');

    expect(cityName).toHaveTextContent('Budapest');
    expect(temperature).toHaveTextContent('20°C');
    expect(description).toHaveTextContent('Sunny');
    expect(humidity).toHaveTextContent('Humidity: 65%');
    expect(windSpeed).toHaveTextContent('Wind: 15 km/h');
  });

  it('handles API data correctly', async () => {
    // Mock API response
    const mockData = await mockWeatherApi.getCurrentWeather('Budapest');
    
    // Render with API data
    render(<WeatherCard weatherData={mockData.data} />);

    // Assert the rendered content
    const cityName = screen.getByTestId('city-name');
    const temperature = screen.getByTestId('temperature');
    const description = screen.getByTestId('description');

    expect(cityName).toHaveTextContent('Budapest');
    expect(temperature).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('measures render performance', async () => {
    const weatherData = createWeatherFactory().build();
    
    // Measure render performance
    const { metrics } = await PerformanceTracker.measureAsync(async () => {
      render(<WeatherCard weatherData={weatherData} />);
    });

    // Assert performance metrics
    expect(metrics.executionTime).toBeLessThan(100); // Should render in less than 100ms
  });

  it('handles multiple weather cards', () => {
    // Create multiple weather data points
    const weatherDataList = createWeatherFactory().buildMany(3, {
      city: 'Budapest'
    });

    // Render multiple cards
    render(
      <div data-testid="weather-cards">
        {weatherDataList.map((data, index) => (
          <WeatherCard key={index} weatherData={data} />
        ))}
      </div>
    );

    // Assert all cards are rendered
    const cards = screen.getAllByTestId('weather-card');
    expect(cards).toHaveLength(3);
  });
}); 