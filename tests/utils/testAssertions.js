import { screen, within } from '@testing-library/react';

// Common test assertions
export const assertions = {
  // Element assertions
  element: {
    isVisible: (element) => {
      expect(element).toBeVisible();
    },
    isHidden: (element) => {
      expect(element).not.toBeVisible();
    },
    hasText: (element, text) => {
      expect(element).toHaveTextContent(text);
    },
    hasClass: (element, className) => {
      expect(element).toHaveClass(className);
    },
    hasStyle: (element, style) => {
      expect(element).toHaveStyle(style);
    },
    hasAttribute: (element, attribute, value) => {
      if (value) {
        expect(element).toHaveAttribute(attribute, value);
      } else {
        expect(element).toHaveAttribute(attribute);
      }
    },
    hasRole: (element, role) => {
      expect(element).toHaveAttribute('role', role);
    },
    isDisabled: (element) => {
      expect(element).toBeDisabled();
    },
    isEnabled: (element) => {
      expect(element).toBeEnabled();
    },
    isRequired: (element) => {
      expect(element).toBeRequired();
    },
    isChecked: (element) => {
      expect(element).toBeChecked();
    },
    hasValue: (element, value) => {
      expect(element).toHaveValue(value);
    },
    hasPlaceholder: (element, placeholder) => {
      expect(element).toHaveAttribute('placeholder', placeholder);
    }
  },

  // Form assertions
  form: {
    isValid: (form) => {
      expect(form).toBeValid();
    },
    isInvalid: (form) => {
      expect(form).toBeInvalid();
    },
    hasError: (form, errorMessage) => {
      expect(within(form).getByText(errorMessage)).toBeInTheDocument();
    },
    hasNoError: (form) => {
      expect(within(form).queryByRole('alert')).not.toBeInTheDocument();
    }
  },

  // API assertions
  api: {
    wasCalled: (mock) => {
      expect(mock).toHaveBeenCalled();
    },
    wasCalledWith: (mock, ...args) => {
      expect(mock).toHaveBeenCalledWith(...args);
    },
    wasCalledTimes: (mock, times) => {
      expect(mock).toHaveBeenCalledTimes(times);
    },
    wasLastCalledWith: (mock, ...args) => {
      expect(mock).toHaveBeenLastCalledWith(...args);
    }
  },

  // State assertions
  state: {
    hasValue: (state, key, value) => {
      expect(state[key]).toEqual(value);
    },
    hasChanged: (initialState, newState, key) => {
      expect(newState[key]).not.toEqual(initialState[key]);
    },
    hasNotChanged: (initialState, newState, key) => {
      expect(newState[key]).toEqual(initialState[key]);
    }
  },

  // Event assertions
  event: {
    wasFired: (element, eventName) => {
      const event = new Event(eventName);
      element.dispatchEvent(event);
      expect(element).toHaveAttribute(`data-${eventName}-fired`, 'true');
    },
    wasNotFired: (element, eventName) => {
      expect(element).not.toHaveAttribute(`data-${eventName}-fired`);
    }
  },

  // Performance assertions
  performance: {
    isWithinThreshold: (startTime, endTime, threshold) => {
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(threshold);
    },
    hasNoMemoryLeak: (initialMemory, finalMemory) => {
      expect(finalMemory).toBeLessThanOrEqual(initialMemory * 1.1); // Allow 10% growth
    }
  },

  // Accessibility assertions
  accessibility: {
    hasLabel: (element, label) => {
      expect(element).toHaveAccessibleName(label);
    },
    hasDescription: (element, description) => {
      expect(element).toHaveAccessibleDescription(description);
    },
    isInTabOrder: (element) => {
      expect(element).toHaveAttribute('tabindex', expect.any(String));
    },
    hasRole: (element, role) => {
      expect(element).toHaveAttribute('role', role);
    }
  },

  // Snapshot assertions
  snapshot: {
    matches: (element) => {
      expect(element).toMatchSnapshot();
    },
    matchesInline: (element) => {
      expect(element).toMatchInlineSnapshot();
    }
  },

  // Custom assertions
  custom: {
    isWithinRange: (value, min, max) => {
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    },
    isOneOf: (value, allowedValues) => {
      expect(allowedValues).toContain(value);
    },
    hasLength: (array, length) => {
      expect(array).toHaveLength(length);
    },
    contains: (array, item) => {
      expect(array).toContain(item);
    },
    isSorted: (array, compareFn) => {
      const sorted = [...array].sort(compareFn);
      expect(array).toEqual(sorted);
    }
  }
};

// Export individual assertions
export const {
  element,
  form,
  api,
  state,
  event,
  performance,
  accessibility,
  snapshot,
  custom
} = assertions; 