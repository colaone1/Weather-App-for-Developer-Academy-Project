import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Common test patterns
export const testPatterns = {
  // Test component rendering
  testRendering: async (Component, props = {}) => {
    const { container } = render(<Component {...props} />);
    expect(container).toBeInTheDocument();
    return { container };
  },

  // Test user interactions
  testUserInteraction: async (Component, props = {}, interaction) => {
    const user = userEvent.setup();
    render(<Component {...props} />);
    await interaction(user);
  },

  // Test form submission
  testFormSubmission: async (Component, props = {}, formData) => {
    const onSubmit = jest.fn();
    render(<Component {...props} onSubmit={onSubmit} />);
    
    for (const [name, value] of Object.entries(formData)) {
      const input = screen.getByLabelText(new RegExp(name, 'i'));
      await userEvent.type(input, value);
    }
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    
    expect(onSubmit).toHaveBeenCalledWith(formData);
  },

  // Test error handling
  testErrorHandling: async (Component, props = {}, errorMessage) => {
    render(<Component {...props} />);
    const errorElement = await screen.findByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  },

  // Test loading states
  testLoadingState: async (Component, props = {}) => {
    render(<Component {...props} isLoading={true} />);
    const loadingElement = screen.getByRole('progressbar');
    expect(loadingElement).toBeInTheDocument();
  },

  // Test accessibility
  testAccessibility: async (Component, props = {}) => {
    const { container } = render(<Component {...props} />);
    expect(container).toBeAccessible();
  },

  // Test responsive design
  testResponsiveDesign: async (Component, props = {}, breakpoints) => {
    for (const [width, height] of Object.entries(breakpoints)) {
      window.innerWidth = width;
      window.innerHeight = height;
      fireEvent(window, new Event('resize'));
      
      const { container } = render(<Component {...props} />);
      expect(container).toMatchSnapshot();
    }
  },

  // Test keyboard navigation
  testKeyboardNavigation: async (Component, props = {}) => {
    render(<Component {...props} />);
    const user = userEvent.setup();
    
    // Test tab navigation
    await user.tab();
    expect(document.activeElement).toHaveFocus();
    
    // Test enter key
    await user.keyboard('{Enter}');
    // Add assertions based on expected behavior
  },

  // Test data fetching
  testDataFetching: async (Component, props = {}, mockData) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData)
    });
    
    render(<Component {...props} />);
    await waitFor(() => {
      expect(screen.getByText(mockData.title)).toBeInTheDocument();
    });
  },

  // Test state management
  testStateManagement: async (Component, props = {}, initialState, expectedState) => {
    const { container } = render(<Component {...props} initialState={initialState} />);
    
    // Trigger state change
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    // Verify state update
    expect(container).toMatchSnapshot();
  },

  // Test component lifecycle
  testLifecycle: async (Component, props = {}) => {
    const { unmount } = render(<Component {...props} />);
    
    // Test mount
    expect(screen.getByTestId('component')).toBeInTheDocument();
    
    // Test unmount
    unmount();
    expect(screen.queryByTestId('component')).not.toBeInTheDocument();
  },

  // Test error boundaries
  testErrorBoundary: async (Component, props = {}) => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Component {...props} />);
    
    // Trigger error
    const errorButton = screen.getByRole('button', { name: /error/i });
    await userEvent.click(errorButton);
    
    // Verify error boundary caught the error
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    
    consoleError.mockRestore();
  },

  // Test performance
  testPerformance: async (Component, props = {}) => {
    const startTime = performance.now();
    
    render(<Component {...props} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(renderTime).toBeLessThan(100); // Adjust threshold as needed
  },

  // Test internationalization
  testI18n: async (Component, props = {}, translations) => {
    render(<Component {...props} />);
    
    for (const [key, value] of Object.entries(translations)) {
      expect(screen.getByText(value)).toBeInTheDocument();
    }
  },

  // Test theme switching
  testThemeSwitching: async (Component, props = {}) => {
    render(<Component {...props} />);
    
    const themeToggle = screen.getByRole('button', { name: /theme/i });
    await userEvent.click(themeToggle);
    
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  }
};

// Export individual patterns
export const {
  testRendering,
  testUserInteraction,
  testFormSubmission,
  testErrorHandling,
  testLoadingState,
  testAccessibility,
  testResponsiveDesign,
  testKeyboardNavigation,
  testDataFetching,
  testStateManagement,
  testLifecycle,
  testErrorBoundary,
  testPerformance,
  testI18n,
  testThemeSwitching
} = testPatterns; 