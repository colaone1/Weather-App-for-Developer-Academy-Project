# Universal Testing Utils

A comprehensive, modern testing utilities package for web applications. This package provides a set of tools and utilities to make testing easier, more maintainable, and more efficient, with a focus on performance, reliability, and developer experience.

## Features

- 🎯 **Mocking Utilities**: Create mock functions, objects, and API responses
- 🏭 **Test Data Factories**: Generate consistent test data with ease
- 🔄 **E2E Testing**: Fluent API for writing end-to-end tests
- ⚡ **Performance Testing**: Measure execution time and memory usage
- 🛠️ **Setup Utilities**: Configure test environments and create test resources
- 🧩 **Custom Matchers**: Extended assertions for DOM and more
- 🚦 **CI/CD Ready**: Seamless integration with GitHub Actions and other CI tools

## Installation

```bash
npm install universal-testing-utils --save-dev
```

## Usage Example

Here's how to test a weather component using the utilities:

```typescript
import React from 'react';
import { render, screen } from 'universal-testing-utils';
import { createWeatherFactory } from 'universal-testing-utils/factories/weather';
import { mockWeatherApi } from 'universal-testing-utils/mocks/weatherApi';
import { PerformanceTracker } from 'universal-testing-utils/performance/metrics';
import '@testing-library/jest-dom';

describe('Weather Card Component', () => {
  it('renders weather information correctly', () => {
    const weatherData = createWeatherFactory().build({
      city: 'Budapest',
      temperature: 20,
      description: 'Sunny',
      humidity: 65,
      windSpeed: 15
    });
    render(<WeatherCard weatherData={weatherData} />);
    expect(screen.getByTestId('city-name')).toHaveTextContent('Budapest');
    expect(screen.getByTestId('temperature')).toHaveTextContent('20°C');
  });

  it('handles API data correctly', async () => {
    const mockData = await mockWeatherApi.getCurrentWeather('Budapest');
    render(<WeatherCard weatherData={mockData.data} />);
    expect(screen.getByTestId('city-name')).toHaveTextContent('Budapest');
  });

  it('measures render performance', async () => {
    const weatherData = createWeatherFactory().build();
    const { metrics } = await PerformanceTracker.measureAsync(async () => {
      render(<WeatherCard weatherData={weatherData} />);
    });
    expect(metrics.executionTime).toBeLessThan(100);
  });
});
```

## Test Environment Setup

To get the most out of `universal-testing-utils`, make sure your test environment is configured as follows:

### 1. Jest Configuration

Add the following to your `jest.config.js`:

```js
module.exports = {
  // ...other config
  setupFilesAfterEnv: [
    '<rootDir>/src/setup/environment.ts', // or your setup file path
    '@testing-library/jest-dom'
  ],
  // ...other config
};
```

### 2. Custom Setup File

Create a setup file (e.g., `src/setup/environment.ts`) to configure the testing environment and register custom matchers:

```typescript
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 1000,
});

// Add any global setup or custom matchers here
```

### 3. TypeScript Types

If you use TypeScript, ensure your `tsconfig.json` includes the types:

```json
{
  "compilerOptions": {
    // ...other options
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

## Setup & Configuration

- **Automatic Environment Setup:**
  - Custom matchers and DOM assertions are available globally via Jest setup.
  - See `src/setup/environment.ts` and `src/__tests__/setup.ts` for configuration details.
- **TypeScript Support:**
  - Types for custom matchers are included and auto-registered.
- **CI/CD Integration:**
  - Example GitHub Actions workflow is provided for running tests and collecting coverage.

## Directory Structure

- `src/core/` – Core render and assertion utilities
- `src/factories/` – Test data factories (user, weather, etc.)
- `src/mocks/` – API and data mocking utilities
- `src/performance/` – Performance measurement tools
- `src/e2e/` – End-to-end testing helpers
- `src/setup/` – Test environment and setup utilities

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 