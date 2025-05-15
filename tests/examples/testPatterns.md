# Test Pattern Examples

## Component Rendering

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Component Rendering', () => {
  it('renders with default props', async () => {
    const props = createTestData.props();
    await testPatterns.testRendering(MyComponent, props);
    expect(screen.getByRole('heading')).toHaveTextContent('Default Title');
  });

  it('renders with custom props', async () => {
    const props = createTestData.props({ title: 'Custom Title' });
    await testPatterns.testRendering(MyComponent, props);
    expect(screen.getByRole('heading')).toHaveTextContent('Custom Title');
  });
});
```

## User Interactions

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('User Interactions', () => {
  it('handles button click', async () => {
    const props = createTestData.props();
    await testPatterns.testUserInteraction(MyComponent, props, async (user) => {
      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('alert')).toHaveTextContent('Button clicked!');
    });
  });

  it('handles input change', async () => {
    const props = createTestData.props();
    await testPatterns.testUserInteraction(MyComponent, props, async (user) => {
      await user.type(screen.getByRole('textbox'), 'Hello World');
      expect(screen.getByRole('textbox')).toHaveValue('Hello World');
    });
  });
});
```

## Form Submission

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Form Submission', () => {
  it('submits form with valid data', async () => {
    const props = createTestData.props();
    const formData = createTestData.form({
      username: 'john',
      password: 'password123'
    });
    await testPatterns.testFormSubmission(MyComponent, props, formData);
    expect(screen.getByRole('alert')).toHaveTextContent('Form submitted successfully!');
  });

  it('handles form validation', async () => {
    const props = createTestData.props();
    const formData = createTestData.form({
      username: '',
      password: ''
    });
    await testPatterns.testFormSubmission(MyComponent, props, formData);
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});
```

## Error Handling

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Error Handling', () => {
  it('displays error message', async () => {
    const props = createTestData.props();
    const errorMessage = 'Something went wrong';
    await testPatterns.testErrorHandling(MyComponent, props, errorMessage);
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });

  it('handles network error', async () => {
    const props = createTestData.props();
    await testPatterns.testErrorHandling(MyComponent, props, 'Network Error');
    expect(screen.getByText('Please check your internet connection')).toBeInTheDocument();
  });
});
```

## Loading States

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Loading States', () => {
  it('shows loading indicator', async () => {
    const props = createTestData.props();
    await testPatterns.testLoadingState(MyComponent, props);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('hides loading indicator after data loads', async () => {
    const props = createTestData.props();
    await testPatterns.testLoadingState(MyComponent, props);
    await screen.findByText('Data loaded');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
```

## Accessibility

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Accessibility', () => {
  it('has correct ARIA attributes', async () => {
    const props = createTestData.props();
    await testPatterns.testAccessibility(MyComponent, props);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit');
  });

  it('has correct heading hierarchy', async () => {
    const props = createTestData.props();
    await testPatterns.testAccessibility(MyComponent, props);
    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveAttribute('aria-level', '1');
    expect(headings[1]).toHaveAttribute('aria-level', '2');
  });
});
```

## Responsive Design

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Responsive Design', () => {
  it('adapts to mobile viewport', async () => {
    const props = createTestData.props();
    await testPatterns.testResponsiveDesign(MyComponent, props, { width: 375, height: 667 });
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
  });

  it('adapts to desktop viewport', async () => {
    const props = createTestData.props();
    await testPatterns.testResponsiveDesign(MyComponent, props, { width: 1920, height: 1080 });
    expect(screen.getByTestId('desktop-menu')).toBeInTheDocument();
  });
});
```

## Keyboard Navigation

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Keyboard Navigation', () => {
  it('navigates with tab key', async () => {
    const props = createTestData.props();
    await testPatterns.testKeyboardNavigation(MyComponent, props, async (user) => {
      await user.tab();
      expect(screen.getByRole('textbox')).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });

  it('handles keyboard shortcuts', async () => {
    const props = createTestData.props();
    await testPatterns.testKeyboardNavigation(MyComponent, props, async (user) => {
      await user.keyboard('{Control>}s{/Control}');
      expect(screen.getByRole('alert')).toHaveTextContent('Saved!');
    });
  });
});
```

## Data Fetching

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Data Fetching', () => {
  it('fetches and displays data', async () => {
    const props = createTestData.props();
    const mockData = createTestData.apiResponse();
    await testPatterns.testDataFetching(MyComponent, props, mockData);
    expect(screen.getByText(mockData.title)).toBeInTheDocument();
  });

  it('handles empty data', async () => {
    const props = createTestData.props();
    await testPatterns.testDataFetching(MyComponent, props, []);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
```

## State Management

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('State Management', () => {
  it('updates state correctly', async () => {
    const props = createTestData.props();
    const initialState = createTestData.state();
    const newState = createTestData.state({ loading: true });
    await testPatterns.testStateManagement(MyComponent, props, initialState, newState);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('persists state between renders', async () => {
    const props = createTestData.props();
    const state = createTestData.state({ count: 1 });
    await testPatterns.testStateManagement(MyComponent, props, state, state);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

## Component Lifecycle

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Component Lifecycle', () => {
  it('mounts and unmounts correctly', async () => {
    const props = createTestData.props();
    await testPatterns.testLifecycle(MyComponent, props);
    expect(screen.getByText('Component mounted')).toBeInTheDocument();
    await screen.findByText('Component unmounted');
  });

  it('updates on prop changes', async () => {
    const props = createTestData.props();
    const newProps = createTestData.props({ title: 'New Title' });
    await testPatterns.testLifecycle(MyComponent, props, newProps);
    expect(screen.getByText('New Title')).toBeInTheDocument();
  });
});
```

## Error Boundaries

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Error Boundaries', () => {
  it('catches and displays errors', async () => {
    const props = createTestData.props();
    await testPatterns.testErrorBoundary(MyComponent, props);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('provides error recovery', async () => {
    const props = createTestData.props();
    await testPatterns.testErrorBoundary(MyComponent, props);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('Component recovered')).toBeInTheDocument();
  });
});
```

## Performance

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Performance', () => {
  it('renders within threshold', async () => {
    const props = createTestData.props();
    await testPatterns.testPerformance(MyComponent, props, { threshold: 100 });
    expect(screen.getByText('Rendered in 50ms')).toBeInTheDocument();
  });

  it('handles large data sets', async () => {
    const props = createTestData.props();
    const largeData = createTestData.apiResponse({ items: Array(1000).fill({}) });
    await testPatterns.testPerformance(MyComponent, props, { data: largeData });
    expect(screen.getByText('Rendered 1000 items')).toBeInTheDocument();
  });
});
```

## Internationalization

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Internationalization', () => {
  it('displays correct translations', async () => {
    const props = createTestData.props();
    await testPatterns.testI18n(MyComponent, props, 'en');
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('switches languages', async () => {
    const props = createTestData.props();
    await testPatterns.testI18n(MyComponent, props, 'es');
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });
});
```

## Theme Switching

```typescript
import { render, screen } from '@testing-library/react';
import { testPatterns } from '../utils/testPatterns';
import { createTestData } from '../utils/testDataFactory';

describe('Theme Switching', () => {
  it('applies light theme', async () => {
    const props = createTestData.props();
    await testPatterns.testThemeSwitching(MyComponent, props, 'light');
    expect(screen.getByTestId('theme-container')).toHaveStyle({ backgroundColor: '#ffffff' });
  });

  it('applies dark theme', async () => {
    const props = createTestData.props();
    await testPatterns.testThemeSwitching(MyComponent, props, 'dark');
    expect(screen.getByTestId('theme-container')).toHaveStyle({ backgroundColor: '#000000' });
  });
});
``` 