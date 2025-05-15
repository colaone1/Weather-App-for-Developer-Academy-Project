import { renderHook, act } from '@testing-library/react';
import { render } from '../utils/testUtils';

// Custom test hooks
export const testHooks = {
  // Component hooks
  useComponent: {
    // Test component mounting
    testMount: (Component, props = {}) => {
      const { result } = renderHook(() => Component(props));
      return result;
    },

    // Test component unmounting
    testUnmount: (Component, props = {}) => {
      const { unmount } = render(<Component {...props} />);
      return unmount;
    },

    // Test component updates
    testUpdate: (Component, initialProps = {}, newProps = {}) => {
      const { rerender } = render(<Component {...initialProps} />);
      return () => rerender(<Component {...newProps} />);
    }
  },

  // State hooks
  useState: {
    // Test state initialization
    testInitialState: (initialState) => {
      const { result } = renderHook(() => useState(initialState));
      return result;
    },

    // Test state updates
    testStateUpdate: (initialState, newState) => {
      const { result } = renderHook(() => useState(initialState));
      act(() => {
        result.current[1](newState);
      });
      return result;
    }
  },

  // Effect hooks
  useEffect: {
    // Test effect mounting
    testEffectMount: (effect) => {
      const { result } = renderHook(() => useEffect(effect, []));
      return result;
    },

    // Test effect updates
    testEffectUpdate: (effect, deps) => {
      const { result } = renderHook(() => useEffect(effect, deps));
      return result;
    },

    // Test effect cleanup
    testEffectCleanup: (effect) => {
      const { unmount } = renderHook(() => useEffect(effect, []));
      return unmount;
    }
  },

  // Context hooks
  useContext: {
    // Test context value
    testContextValue: (Context, value) => {
      const { result } = renderHook(() => useContext(Context), {
        wrapper: ({ children }) => (
          <Context.Provider value={value}>{children}</Context.Provider>
        )
      });
      return result;
    }
  },

  // Ref hooks
  useRef: {
    // Test ref initialization
    testRefInit: (initialValue) => {
      const { result } = renderHook(() => useRef(initialValue));
      return result;
    },

    // Test ref updates
    testRefUpdate: (initialValue, newValue) => {
      const { result } = renderHook(() => useRef(initialValue));
      act(() => {
        result.current.current = newValue;
      });
      return result;
    }
  },

  // Callback hooks
  useCallback: {
    // Test callback creation
    testCallbackCreate: (callback, deps) => {
      const { result } = renderHook(() => useCallback(callback, deps));
      return result;
    },

    // Test callback updates
    testCallbackUpdate: (callback, deps) => {
      const { result } = renderHook(() => useCallback(callback, deps));
      return result;
    }
  },

  // Memo hooks
  useMemo: {
    // Test memo creation
    testMemoCreate: (factory, deps) => {
      const { result } = renderHook(() => useMemo(factory, deps));
      return result;
    },

    // Test memo updates
    testMemoUpdate: (factory, deps) => {
      const { result } = renderHook(() => useMemo(factory, deps));
      return result;
    }
  },

  // Custom hooks
  useCustom: {
    // Test custom hook
    testCustomHook: (hook, ...args) => {
      const { result } = renderHook(() => hook(...args));
      return result;
    },

    // Test custom hook with props
    testCustomHookWithProps: (hook, props) => {
      const { result } = renderHook(() => hook(props));
      return result;
    }
  },

  // Async hooks
  useAsync: {
    // Test async hook
    testAsyncHook: async (hook, ...args) => {
      const { result } = renderHook(() => hook(...args));
      await act(async () => {
        await result.current;
      });
      return result;
    },

    // Test async hook with props
    testAsyncHookWithProps: async (hook, props) => {
      const { result } = renderHook(() => hook(props));
      await act(async () => {
        await result.current;
      });
      return result;
    }
  },

  // Event hooks
  useEvent: {
    // Test event handler
    testEventHandler: (handler, event) => {
      const { result } = renderHook(() => handler(event));
      return result;
    },

    // Test event handler with props
    testEventHandlerWithProps: (handler, props, event) => {
      const { result } = renderHook(() => handler(props, event));
      return result;
    }
  },

  // Form hooks
  useForm: {
    // Test form submission
    testFormSubmit: (onSubmit, values) => {
      const { result } = renderHook(() => onSubmit(values));
      return result;
    },

    // Test form validation
    testFormValidation: (validate, values) => {
      const { result } = renderHook(() => validate(values));
      return result;
    }
  },

  // API hooks
  useApi: {
    // Test API call
    testApiCall: async (api, ...args) => {
      const { result } = renderHook(() => api(...args));
      await act(async () => {
        await result.current;
      });
      return result;
    },

    // Test API call with props
    testApiCallWithProps: async (api, props) => {
      const { result } = renderHook(() => api(props));
      await act(async () => {
        await result.current;
      });
      return result;
    }
  }
};

// Export individual hooks
export const {
  useComponent,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo,
  useCustom,
  useAsync,
  useEvent,
  useForm,
  useApi
} = testHooks; 