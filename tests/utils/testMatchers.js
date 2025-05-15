import { expect } from '@jest/globals';

// Custom test matchers
export const matchers = {
  // Element matchers
  element: {
    toBeVisible: (element) => {
      expect(element).toBeVisible();
    },
    toBeHidden: (element) => {
      expect(element).not.toBeVisible();
    },
    toHaveText: (element, text) => {
      expect(element).toHaveTextContent(text);
    },
    toHaveClass: (element, className) => {
      expect(element).toHaveClass(className);
    },
    toHaveStyle: (element, style) => {
      expect(element).toHaveStyle(style);
    },
    toHaveAttribute: (element, attribute, value) => {
      if (value) {
        expect(element).toHaveAttribute(attribute, value);
      } else {
        expect(element).toHaveAttribute(attribute);
      }
    },
    toHaveRole: (element, role) => {
      expect(element).toHaveAttribute('role', role);
    },
    toBeDisabled: (element) => {
      expect(element).toBeDisabled();
    },
    toBeEnabled: (element) => {
      expect(element).toBeEnabled();
    },
    toBeRequired: (element) => {
      expect(element).toBeRequired();
    },
    toBeChecked: (element) => {
      expect(element).toBeChecked();
    },
    toHaveValue: (element, value) => {
      expect(element).toHaveValue(value);
    },
    toHavePlaceholder: (element, placeholder) => {
      expect(element).toHaveAttribute('placeholder', placeholder);
    }
  },

  // Form matchers
  form: {
    toBeValid: (form) => {
      expect(form).toBeValid();
    },
    toBeInvalid: (form) => {
      expect(form).toBeInvalid();
    },
    toHaveError: (form, errorMessage) => {
      expect(within(form).getByText(errorMessage)).toBeInTheDocument();
    },
    toHaveNoError: (form) => {
      expect(within(form).queryByRole('alert')).not.toBeInTheDocument();
    }
  },

  // API matchers
  api: {
    toHaveBeenCalled: (mock) => {
      expect(mock).toHaveBeenCalled();
    },
    toHaveBeenCalledWith: (mock, ...args) => {
      expect(mock).toHaveBeenCalledWith(...args);
    },
    toHaveBeenCalledTimes: (mock, times) => {
      expect(mock).toHaveBeenCalledTimes(times);
    },
    toHaveBeenLastCalledWith: (mock, ...args) => {
      expect(mock).toHaveBeenLastCalledWith(...args);
    }
  },

  // State matchers
  state: {
    toHaveValue: (state, key, value) => {
      expect(state[key]).toEqual(value);
    },
    toHaveChanged: (initialState, newState, key) => {
      expect(newState[key]).not.toEqual(initialState[key]);
    },
    toHaveNotChanged: (initialState, newState, key) => {
      expect(newState[key]).toEqual(initialState[key]);
    }
  },

  // Event matchers
  event: {
    toHaveBeenFired: (element, eventName) => {
      expect(element).toHaveAttribute(`data-${eventName}-fired`, 'true');
    },
    toHaveNotBeenFired: (element, eventName) => {
      expect(element).not.toHaveAttribute(`data-${eventName}-fired`);
    }
  },

  // Performance matchers
  performance: {
    toBeWithinThreshold: (startTime, endTime, threshold) => {
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(threshold);
    },
    toHaveNoMemoryLeak: (initialMemory, finalMemory) => {
      expect(finalMemory).toBeLessThanOrEqual(initialMemory * 1.1); // Allow 10% growth
    }
  },

  // Accessibility matchers
  accessibility: {
    toHaveLabel: (element, label) => {
      expect(element).toHaveAccessibleName(label);
    },
    toHaveDescription: (element, description) => {
      expect(element).toHaveAccessibleDescription(description);
    },
    toBeInTabOrder: (element) => {
      expect(element).toHaveAttribute('tabindex', expect.any(String));
    },
    toHaveRole: (element, role) => {
      expect(element).toHaveAttribute('role', role);
    }
  },

  // Snapshot matchers
  snapshot: {
    toMatchSnapshot: (element) => {
      expect(element).toMatchSnapshot();
    },
    toMatchInlineSnapshot: (element) => {
      expect(element).toMatchInlineSnapshot();
    }
  },

  // Custom matchers
  custom: {
    toBeWithinRange: (value, min, max) => {
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    },
    toBeOneOf: (value, allowedValues) => {
      expect(allowedValues).toContain(value);
    },
    toHaveLength: (array, length) => {
      expect(array).toHaveLength(length);
    },
    toContain: (array, item) => {
      expect(array).toContain(item);
    },
    toBeSorted: (array, compareFn) => {
      const sorted = [...array].sort(compareFn);
      expect(array).toEqual(sorted);
    }
  }
};

// Export individual matchers
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
} = matchers; 