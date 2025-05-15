# Testing Setup Guide

This document provides a comprehensive guide to implementing a robust testing setup in your Node.js/React projects, based on the Weather App's testing architecture.

## Table of Contents
1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Test Categories](#test-categories)
4. [Best Practices](#best-practices)
5. [Performance Testing](#performance-testing)
6. [Frontend Testing](#frontend-testing)
7. [Backend Testing](#backend-testing)
8. [Continuous Integration](#continuous-integration)
9. [Troubleshooting](#troubleshooting)

## Overview

This testing setup provides a comprehensive framework for testing Node.js/React applications, including:
- Unit testing
- Integration testing
- Performance testing
- Frontend component testing
- API endpoint testing
- Memory usage monitoring
- Concurrent request handling

## Setup Instructions

1. Install required dependencies:
```bash
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-jest chai chai-http jest supertest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

2. Create configuration files:

`jest.config.cjs`:
```javascript
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

`babel.config.cjs`:
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
  ],
};
```

3. Add test scripts to `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:backend": "jest tests/backend --coverage",
    "test:frontend": "jest tests/frontend --coverage",
    "test:performance": "jest tests/performance"
  }
}
```

## Test Categories

### 1. Backend Tests
- API endpoint testing
- Data validation
- Error handling
- Database operations
- Authentication/Authorization

Example (`tests/backend/api.test.js`):
```javascript
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Tests', () => {
  it('should handle API requests correctly', async () => {
    const response = await chai
      .request('http://localhost:8000')
      .get('/api/endpoint')
      .query({ param: 'value' });
    
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('data');
  });
});
```

### 2. Frontend Tests
- Component testing
- Integration testing
- User interface testing
- State management
- Event handling

Example (`tests/frontend/component.test.js`):
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Component Tests', () => {
  it('should render component correctly', () => {
    render(<YourComponent />);
    expect(screen.getByTestId('component')).toBeInTheDocument();
  });
});
```

### 3. Performance Tests
- Response time testing
- Load testing
- Memory usage monitoring
- Concurrent request handling

Example (`tests/performance/load.test.js`):
```javascript
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  it('should respond within 500ms', async () => {
    const start = performance.now();
    // Your test code here
    const end = performance.now();
    expect(end - start).toBeLessThan(500);
  });
});
```

## Best Practices

1. **Test Organization**
   - Group related tests using `describe` blocks
   - Use clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern

2. **Test Isolation**
   - Each test should be independent
   - Clean up after each test
   - Mock external dependencies

3. **Coverage Requirements**
   - Minimum 80% code coverage
   - Test all critical paths
   - Include edge cases
   - Test error scenarios

4. **Performance Requirements**
   - API response time < 500ms
   - Handle 10+ concurrent requests
   - Memory usage < 50MB under load
   - CPU utilization < 70% under load

## Performance Testing

1. **Response Time Testing**
```javascript
it('should respond within 500ms', async () => {
  const start = performance.now();
  const response = await makeRequest();
  const end = performance.now();
  expect(end - start).toBeLessThan(500);
});
```

2. **Concurrent Request Testing**
```javascript
it('should handle concurrent requests', async () => {
  const requests = Array(10).fill().map(() => makeRequest());
  const responses = await Promise.all(requests);
  responses.forEach(response => {
    expect(response.status).toBe(200);
  });
});
```

3. **Memory Usage Testing**
```javascript
it('should maintain stable memory usage', async () => {
  const initialMemory = process.memoryUsage().heapUsed;
  // Your test code here
  const finalMemory = process.memoryUsage().heapUsed;
  expect(finalMemory - initialMemory).toBeLessThan(50 * 1024 * 1024);
});
```

## Frontend Testing

1. **Component Testing**
```javascript
it('should render component correctly', () => {
  render(<YourComponent />);
  expect(screen.getByTestId('component')).toBeInTheDocument();
});
```

2. **User Interaction Testing**
```javascript
it('should handle user interactions', async () => {
  render(<YourComponent />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

## Backend Testing

1. **API Testing**
```javascript
it('should handle API requests', async () => {
  const response = await request(app)
    .get('/api/endpoint')
    .query({ param: 'value' });
  expect(response.status).toBe(200);
});
```

2. **Error Handling**
```javascript
it('should handle errors correctly', async () => {
  const response = await request(app)
    .get('/api/invalid-endpoint');
  expect(response.status).toBe(404);
});
```

## Continuous Integration

1. **GitHub Actions Setup**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Troubleshooting

Common issues and solutions:

1. **Test Timeouts**
   - Increase timeout limits in Jest config
   - Check for async operations not being awaited

2. **Memory Leaks**
   - Ensure proper cleanup in afterEach/afterAll
   - Check for unclosed connections

3. **Flaky Tests**
   - Ensure test isolation
   - Mock external dependencies
   - Use proper async/await patterns

4. **Slow Tests**
   - Optimize test setup
   - Use proper mocking
   - Consider parallel test execution

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Chai Documentation](https://www.chaijs.com/)
- [Supertest Documentation](https://github.com/visionmedia/supertest) 