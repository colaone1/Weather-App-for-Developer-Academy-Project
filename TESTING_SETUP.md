# Testing Setup Documentation

This document provides a comprehensive guide to the testing setup used in this project. The setup is designed to be reusable across different projects and includes various types of testing.

## Table of Contents
1. [Setup Overview](#setup-overview)
2. [Test Types](#test-types)
3. [Running Tests](#running-tests)
4. [Test Utilities](#test-utilities)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)

## Setup Overview

The testing setup includes:
- Jest for unit and integration testing
- React Testing Library for component testing
- Cypress for E2E testing
- Performance testing utilities
- Snapshot testing
- Mock utilities

### Key Files
- `tests/setup/setupTests.js`: Global test configuration
- `tests/utils/testUtils.js`: Common testing utilities
- `tests/factories/`: Test data factories
- `cypress/`: E2E test configuration and specs

## Test Types

### 1. Unit Tests
```javascript
// Example unit test
describe('WeatherService', () => {
  it('should fetch weather data', async () => {
    const weather = await WeatherService.getWeather('London');
    expect(weather).toHaveProperty('temperature');
  });
});
```

### 2. Component Tests
```javascript
// Example component test
describe('CityCard', () => {
  it('should render city information', () => {
    const { getByText } = render(<CityCard city="London" />);
    expect(getByText('London')).toBeInTheDocument();
  });
});
```

### 3. Integration Tests
```javascript
// Example integration test
describe('Weather App Integration', () => {
  it('should update weather when searching', async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    await userEvent.type(getByPlaceholderText('Enter city'), 'London');
    await userEvent.click(getByText('Search'));
    expect(getByText('London')).toBeInTheDocument();
  });
});
```

### 4. E2E Tests
```javascript
// Example E2E test
describe('Weather App E2E', () => {
  it('should search for weather', () => {
    cy.visit('/');
    cy.get('input').type('London');
    cy.get('button').click();
    cy.contains('London').should('be.visible');
  });
});
```

## Running Tests

### Available Scripts
```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run E2E tests with UI
npm run cypress:open
```

### Test Coverage
- Coverage reports are generated automatically
- View coverage by running `npm run test:coverage`
- Coverage thresholds are set in `jest.config.js`

## Test Utilities

### Common Utilities
```javascript
import { renderWithProviders, mockFetch, wait } from '../utils/testUtils';

// Example usage
describe('Component', () => {
  it('should handle async operations', async () => {
    mockFetch({ data: 'test' });
    const { getByText } = renderWithProviders(<Component />);
    await wait(100);
    expect(getByText('test')).toBeInTheDocument();
  });
});
```

### Mock Functions
- `mockLocalStorage()`: Mock browser storage
- `mockGeolocation()`: Mock location services
- `mockIntersectionObserver()`: Mock intersection observer
- `mockResizeObserver()`: Mock resize observer

## Best Practices

1. **Test Organization**
   - Group related tests using `describe` blocks
   - Use clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern

2. **Component Testing**
   - Test behavior, not implementation
   - Use data-testid attributes sparingly
   - Test accessibility features

3. **Async Testing**
   - Use async/await for asynchronous operations
   - Handle loading states
   - Test error scenarios

4. **Mocking**
   - Mock external dependencies
   - Use factories for test data
   - Clean up mocks after tests

## Common Patterns

### Testing API Calls
```javascript
describe('API', () => {
  it('should handle API calls', async () => {
    mockFetch({ data: 'test' });
    const result = await api.getData();
    expect(result).toEqual({ data: 'test' });
  });
});
```

### Testing User Interactions
```javascript
describe('User Interactions', () => {
  it('should handle user input', async () => {
    const { getByRole } = render(<Component />);
    await userEvent.type(getByRole('textbox'), 'test');
    expect(getByRole('textbox')).toHaveValue('test');
  });
});
```

### Testing Error States
```javascript
describe('Error Handling', () => {
  it('should handle errors', async () => {
    mockFetch(new Error('API Error'));
    const { getByText } = render(<Component />);
    await wait(100);
    expect(getByText('Error occurred')).toBeInTheDocument();
  });
});
```

## Adding to New Projects

1. Copy the following files:
   - `tests/setup/setupTests.js`
   - `tests/utils/testUtils.js`
   - `jest.config.js`
   - `cypress.config.js`

2. Install dependencies:
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom cypress
   ```

3. Update package.json scripts:
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage",
       "test:e2e": "cypress run",
       "cypress:open": "cypress open"
     }
   }
   ```

4. Configure your test environment in `jest.config.js`

5. Start writing tests following the patterns in this documentation 