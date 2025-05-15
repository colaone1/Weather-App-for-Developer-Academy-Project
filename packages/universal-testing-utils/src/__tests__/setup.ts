import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Extend expect matchers
expect.extend({
  toHaveTextContent(received: HTMLElement, expected: string) {
    const pass = received.textContent === expected;
    return {
      pass,
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to have text content "${expected}"`,
    };
  },
  toBeInTheDocument(received: HTMLElement) {
    const pass = document.body.contains(received);
    return {
      pass,
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
    };
  },
}); 