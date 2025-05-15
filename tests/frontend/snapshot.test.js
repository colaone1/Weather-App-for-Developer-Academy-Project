import React from 'react';
import { render } from '@testing-library/react';
import CityCard from '../../frontend/src/components/cityCard/CityCard';

describe('Snapshot Tests', () => {
  const mockProps = {
    city: 'London',
    main: {
      temp: 20,
      pressure: 1013,
      temp_min: 18,
      temp_max: 22,
      feels_like: 19,
      humidity: 65
    },
    weather: [{
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }],
    wind: {
      speed: 5.2,
      deg: 280
    },
    visibility: 10000,
    deleteCity: jest.fn(),
    id: 1
  };

  it('should match snapshot for CityCard component', () => {
    const { container } = render(<CityCard {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for flipped CityCard', () => {
    const { container } = render(<CityCard {...mockProps} />);
    const card = container.querySelector('.flipped-container');
    card.click();
    expect(container).toMatchSnapshot();
  });
}); 