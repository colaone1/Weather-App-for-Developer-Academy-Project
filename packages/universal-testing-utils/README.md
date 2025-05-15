# Universal Testing Utils

A comprehensive testing utilities package for modern web applications. This package provides a set of tools and utilities to make testing easier, more maintainable, and more efficient.

## Features

- 🎯 **Mocking Utilities**: Create mock functions, objects, and API responses
- 🏭 **Test Data Factories**: Generate consistent test data with ease
- 🔄 **E2E Testing**: Fluent API for writing end-to-end tests
- ⚡ **Performance Testing**: Measure execution time and memory usage
- 🛠️ **Setup Utilities**: Configure test environments and create test resources

## Installation

```bash
npm install universal-testing-utils --save-dev
```

## Quick Start

```typescript
import { render, screen } from 'universal-testing-utils';
import { createMock } from 'universal-testing-utils/mocks';
import { createUserFactory } from 'universal-testing-utils/factories';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const user = createUserFactory().build();
    render(<MyComponent user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });
});
```

## Documentation

For detailed documentation, please visit our [documentation site](docs/TESTING.md).

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 