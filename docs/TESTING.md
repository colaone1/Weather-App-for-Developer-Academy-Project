# Testing Documentation

## Overview

This project uses Jest and React Testing Library for testing. The testing setup includes comprehensive mocks for browser APIs, utilities for common testing patterns, and example tests to demonstrate best practices.

## Test Structure

```
tests/
├── setup/
│   ├── testEnvironment.js    # Global test environment setup
│   └── setupTests.js         # Test setup and configuration
├── utils/
│   └── testUtils.js          # Testing utilities and mocks
├── examples/
│   └── WeatherCard.test.js   # Example test file
└── __mocks__/
    └── fileMock.js           # File mocks
```

## Available Utilities

### Test Environment Setup

The test environment (`testEnvironment.js`) provides global mocks for:

- Browser APIs (fetch, localStorage, sessionStorage)
- Performance API
- Console methods
- IntersectionObserver
- ResizeObserver
- matchMedia
- requestIdleCallback
- requestAnimationFrame

### Test Utilities

The `testUtils.js` file provides utilities for:

1. **Component Testing**
   - `renderWithProviders`: Renders components with Redux and Router providers
   - `MockErrorBoundary`: Tests error boundary components
   - `MockSuspense`: Tests suspense components

2. **API Testing**
   - `mockApiResponse`: Mocks successful API responses
   - `mockApiError`: Mocks API errors
   - `mockFetch`: Mocks fetch with custom responses

3. **Browser API Mocks**
   - `mockGeolocation`: Mocks geolocation API
   - `mockLocalStorage`: Mocks localStorage
   - `mockSessionStorage`: Mocks sessionStorage
   - `mockMatchMedia`: Mocks matchMedia
   - `mockWebSocket`: Mocks WebSocket
   - `mockNotification`: Mocks Notification API
   - `mockServiceWorker`: Mocks Service Worker
   - `mockIndexedDB`: Mocks IndexedDB
   - `mockBroadcastChannel`: Mocks BroadcastChannel
   - `mockPermissions`: Mocks Permissions API
   - `mockClipboard`: Mocks Clipboard API
   - `mockBattery`: Mocks Battery API
   - `mockNetworkInfo`: Mocks Network Information API
   - `mockDeviceMemory`: Mocks Device Memory API
   - `mockHardwareConcurrency`: Mocks Hardware Concurrency API
   - `mockVibration`: Mocks Vibration API
   - `mockScreenOrientation`: Mocks Screen Orientation API
   - `mockFullscreen`: Mocks Fullscreen API

4. **Cleanup**
   - `cleanup`: Cleans up all mocks after each test

## Writing Tests

### Basic Component Test

```javascript
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import MyComponent from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { container } = renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
```

### Testing API Calls

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockApiResponse } from '../utils/testUtils';
import MyComponent from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('handles API data', async () => {
    mockApiResponse({ data: 'test' });
    renderWithProviders(<MyComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
    });
  });
});
```

### Testing Error States

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockApiError } from '../utils/testUtils';
import MyComponent from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('handles API errors', async () => {
    mockApiError(500, 'Server Error');
    renderWithProviders(<MyComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Server Error')).toBeInTheDocument();
    });
  });
});
```

## Best Practices

1. **Test Organization**
   - Group related tests using `describe` blocks
   - Use clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern

2. **Mocking**
   - Mock external dependencies
   - Use the provided mock utilities
   - Clean up mocks after each test

3. **Assertions**
   - Test behavior, not implementation
   - Use semantic queries from React Testing Library
   - Include snapshot tests for UI components

4. **Async Testing**
   - Use `waitFor` for async operations
   - Handle loading and error states
   - Test timeouts and retries

5. **Coverage**
   - Maintain 80% coverage threshold
   - Focus on critical paths
   - Include edge cases

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

## Debugging Tests

1. Use `console.log` in tests (they're mocked)
2. Use the `--debug` flag for verbose output
3. Use the `--runInBand` flag to run tests serially
4. Use the `--detectOpenHandles` flag to find hanging promises

## Common Issues

1. **Async Tests Failing**
   - Ensure proper use of `waitFor`
   - Check for unhandled promises
   - Verify mock implementations

2. **Mock Issues**
   - Reset mocks in `beforeEach`
   - Use `cleanup` utility
   - Check mock implementations

3. **Snapshot Failures**
   - Review changes in component output
   - Update snapshots with `-u` flag
   - Check for non-deterministic output

## Contributing

1. Follow the existing test patterns
2. Add tests for new features
3. Update documentation when adding new utilities
4. Maintain test coverage thresholds 