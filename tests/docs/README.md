# Testing Utilities Documentation

## Overview

This testing setup provides a comprehensive suite of utilities for testing React applications. It includes tools for unit testing, integration testing, and end-to-end testing.

## Features

- TypeScript support
- Jest configuration
- Testing Library integration
- Custom test matchers
- Test data factories
- Test hooks
- Test patterns
- Test assertions
- Performance testing
- Accessibility testing
- Visual regression testing
- API mocking
- Coverage reporting

## Installation

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest @types/testing-library__react @types/testing-library__jest-dom
```

## Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/testSetup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### NYC Configuration

```json
// .nycrc.json
{
  "extends": "@istanbuljs/nyc-config-typescript",
  "all": true,
  "check-coverage": true,
  "reporter": ["text", "text-summary", "html", "lcov", "cobertura"],
  "report-dir": "coverage",
  "exclude": [
    "**/*.d.ts",
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/*.cy.ts",
    "**/*.cy.tsx",
    "**/test/**",
    "**/tests/**",
    "**/__tests__/**",
    "**/__mocks__/**",
    "**/coverage/**",
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
    "**/node_modules/**",
    "**/cypress/**"
  ],
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"],
  "sourceMap": true,
  "instrument": true,
  "cache": true,
  "tempDir": "./node_modules/.cache/nyc"
}
```

## Usage

### Test Data Factory

```typescript
import { createTestData } from '../utils/testDataFactory';

// Create test data
const user = createTestData.user();
const weather = createTestData.weather();
const form = createTestData.form();

// Override default values
const customUser = createTestData.user({ name: 'John Doe' });
```

### Test Hooks

```typescript
import { testHooks } from '../utils/testHooks';

// Test component mounting
const { result } = testHooks.useComponent.testMount(MyComponent, { prop: 'value' });

// Test state updates
const { result } = testHooks.useState.testStateUpdate(initialState, newState);

// Test effect cleanup
const cleanup = testHooks.useEffect.testEffectCleanup(effect);
```

### Test Patterns

```typescript
import { testPatterns } from '../utils/testPatterns';

// Test component rendering
await testPatterns.testRendering(MyComponent, { prop: 'value' });

// Test user interactions
await testPatterns.testUserInteraction(MyComponent, { prop: 'value' }, async (user) => {
  await user.click(screen.getByRole('button'));
});

// Test form submission
await testPatterns.testFormSubmission(MyComponent, { prop: 'value' }, {
  username: 'john',
  password: 'password'
});
```

### Test Assertions

```typescript
import { assertions } from '../utils/testAssertions';

// Element assertions
assertions.element.isVisible(element);
assertions.element.hasText(element, 'Hello World');

// Form assertions
assertions.form.isValid(form);
assertions.form.hasError(form, 'Required field');

// API assertions
assertions.api.wasCalled(mock);
assertions.api.wasCalledWith(mock, 'arg1', 'arg2');
```

### Test Matchers

```typescript
import { matchers } from '../utils/testMatchers';

// Element matchers
expect(element).toBeVisible();
expect(element).toHaveText('Hello World');

// Form matchers
expect(form).toBeValid();
expect(form).toHaveError('Required field');

// API matchers
expect(mock).toHaveBeenCalled();
expect(mock).toHaveBeenCalledWith('arg1', 'arg2');
```

## Best Practices

1. **Test Organization**
   - Group related tests together
   - Use descriptive test names
   - Follow the Arrange-Act-Assert pattern

2. **Test Data**
   - Use test data factories
   - Keep test data minimal
   - Avoid hardcoding test data

3. **Test Hooks**
   - Test component lifecycle
   - Test state updates
   - Test effect cleanup

4. **Test Patterns**
   - Test user interactions
   - Test form submissions
   - Test error handling
   - Test loading states
   - Test accessibility
   - Test responsive design
   - Test keyboard navigation
   - Test data fetching
   - Test state management
   - Test component lifecycle
   - Test error boundaries
   - Test performance
   - Test internationalization
   - Test theme switching

5. **Test Assertions**
   - Use specific assertions
   - Test edge cases
   - Test error cases
   - Test success cases

6. **Test Matchers**
   - Use custom matchers
   - Test element properties
   - Test form validation
   - Test API calls
   - Test state changes
   - Test events
   - Test performance
   - Test accessibility
   - Test snapshots

## Examples

### Component Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testPatterns } from '../utils/testPatterns';
import { assertions } from '../utils/testAssertions';
import { createTestData } from '../utils/testDataFactory';

describe('MyComponent', () => {
  it('renders correctly', async () => {
    const props = createTestData.props();
    await testPatterns.testRendering(MyComponent, props);
  });

  it('handles user interactions', async () => {
    const props = createTestData.props();
    await testPatterns.testUserInteraction(MyComponent, props, async (user) => {
      await user.click(screen.getByRole('button'));
      assertions.element.hasText(screen.getByRole('alert'), 'Clicked!');
    });
  });

  it('submits form data', async () => {
    const props = createTestData.props();
    const formData = createTestData.form();
    await testPatterns.testFormSubmission(MyComponent, props, formData);
  });
});
```

### Hook Test

```typescript
import { renderHook } from '@testing-library/react';
import { testHooks } from '../utils/testHooks';
import { createTestData } from '../utils/testDataFactory';

describe('useMyHook', () => {
  it('initializes with default state', () => {
    const initialState = createTestData.state();
    const { result } = testHooks.useState.testInitialState(initialState);
    expect(result.current[0]).toEqual(initialState);
  });

  it('updates state correctly', () => {
    const initialState = createTestData.state();
    const newState = createTestData.state({ loading: true });
    const { result } = testHooks.useState.testStateUpdate(initialState, newState);
    expect(result.current[0]).toEqual(newState);
  });
});
```

### API Test

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { assertions } from '../utils/testAssertions';
import { createTestData } from '../utils/testDataFactory';

describe('MyAPI', () => {
  it('fetches data successfully', async () => {
    const mockData = createTestData.apiResponse();
    await testPatterns.testDataFetching(MyComponent, {}, mockData);
    assertions.element.hasText(screen.getByText(mockData.title));
  });

  it('handles errors correctly', async () => {
    const errorMessage = 'Failed to fetch data';
    await testPatterns.testErrorHandling(MyComponent, {}, errorMessage);
    assertions.element.hasText(screen.getByText(errorMessage));
  });
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 