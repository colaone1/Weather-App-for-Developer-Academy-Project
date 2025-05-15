# Testing Documentation

## Overview
This document outlines the testing strategy and setup for the Weather App project. We use Jest as our test runner and React Testing Library for component testing.

## Test Structure
```
tests/
├── setup/                 # Test setup files
│   ├── setupTests.js     # Global test setup
│   └── testEnvironment.js # Custom test environment
├── factories/            # Test data factories
│   └── weatherFactory.js # Weather data factory
├── utils/               # Test utilities
│   └── testUtils.js     # Common test utilities
├── components/          # Component tests
├── integration/         # Integration tests
└── e2e/                # End-to-end tests
```

## Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.js
```

## Test Categories

### Unit Tests
- Test individual functions and components in isolation
- Mock external dependencies
- Focus on specific functionality
- Located in `tests/components/`

### Integration Tests
- Test interaction between components
- Test API integration
- Located in `tests/integration/`

### End-to-End Tests
- Test complete user flows
- Use real browser environment
- Located in `tests/e2e/`

## Test Utilities

### renderWithProviders
```javascript
import { renderWithProviders } from '../utils/testUtils';

test('component renders correctly', () => {
  const { getByText } = renderWithProviders(<MyComponent />);
  expect(getByText('Hello')).toBeInTheDocument();
});
```

### Mock Data
```javascript
import { createWeatherData } from '../factories/weatherFactory';

test('displays weather data', () => {
  const weatherData = createWeatherData({ temp: 25 });
  // Use weatherData in test
});
```

## Best Practices

1. **Test Organization**
   - Group related tests using `describe` blocks
   - Use clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern

2. **Component Testing**
   - Test user interactions, not implementation details
   - Use accessible queries (getByRole, getByLabelText)
   - Test error states and loading states

3. **Mocking**
   - Mock external dependencies
   - Use test factories for consistent test data
   - Reset mocks between tests

4. **Coverage**
   - Maintain minimum coverage thresholds:
     - Global: 80%
     - Middleware: 90%
     - Components: 85%
   - Focus on critical paths and edge cases

## Common Patterns

### Testing API Calls
```javascript
test('fetches weather data', async () => {
  const mockData = createWeatherData();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockData)
  });

  const { findByText } = renderWithProviders(<WeatherComponent />);
  expect(await findByText('20°C')).toBeInTheDocument();
});
```

### Testing User Interactions
```javascript
test('updates search input', async () => {
  const { getByRole } = renderWithProviders(<SearchComponent />);
  const input = getByRole('textbox');
  
  await userEvent.type(input, 'London');
  expect(input).toHaveValue('London');
});
```

### Testing Error States
```javascript
test('displays error message', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
  
  const { findByText } = renderWithProviders(<WeatherComponent />);
  expect(await findByText('Failed to fetch weather data')).toBeInTheDocument();
});
```

## Continuous Integration
- Tests run automatically on pull requests
- Coverage reports are generated and uploaded
- Failed tests block merging

## Troubleshooting

### Common Issues
1. **Test Timeouts**
   - Increase timeout in jest.config.js
   - Check for infinite loops
   - Verify async operations complete

2. **Mock Issues**
   - Reset mocks between tests
   - Verify mock implementations
   - Check mock scope

3. **Environment Issues**
   - Verify .env.test file
   - Check test environment setup
   - Verify required dependencies

## Resources
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet) 