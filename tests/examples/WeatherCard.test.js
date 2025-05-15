import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockApiResponse, mockGeolocation, cleanup } from '../utils/testUtils';
import WeatherCard from '../../src/components/WeatherCard';

describe('WeatherCard', () => {
  beforeEach(() => {
    cleanup();
    mockGeolocation();
  });

  it('renders weather information correctly', async () => {
    const weatherData = {
      temperature: 20,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10
    };

    mockApiResponse(weatherData);

    const { container } = renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/20°C/)).toBeInTheDocument();
      expect(screen.getByText(/Sunny/)).toBeInTheDocument();
      expect(screen.getByText(/60%/)).toBeInTheDocument();
      expect(screen.getByText(/10 km\/h/)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('handles API errors gracefully', async () => {
    mockApiResponse({}, 500);

    const { container } = renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading weather data/)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('updates weather data when refresh button is clicked', async () => {
    const initialData = {
      temperature: 20,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10
    };

    const updatedData = {
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12
    };

    let mockData = initialData;
    global.fetch = jest.fn().mockImplementation(() => 
      mockApiResponse(mockData)
    );

    const { container } = renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/20°C/)).toBeInTheDocument();
    });

    mockData = updatedData;
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() => {
      expect(screen.getByText(/22°C/)).toBeInTheDocument();
      expect(screen.getByText(/Partly Cloudy/)).toBeInTheDocument();
      expect(screen.getByText(/65%/)).toBeInTheDocument();
      expect(screen.getByText(/12 km\/h/)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('handles geolocation errors', async () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success, error) => {
        error(new Error('Geolocation error'));
      }),
      watchPosition: jest.fn(),
      clearWatch: jest.fn()
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true
    });

    const { container } = renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/Error getting location/)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('handles offline state', async () => {
    Object.defineProperty(global.navigator, 'onLine', {
      value: false,
      writable: true
    });

    const { container } = renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/You are offline/)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
}); 