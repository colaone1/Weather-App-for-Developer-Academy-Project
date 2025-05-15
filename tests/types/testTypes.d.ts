import { ReactElement, ComponentType, ReactNode } from 'react';
import { RenderResult } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';

// Test Data Types
export interface TestData {
  user: (overrides?: Partial<UserData>) => UserData;
  weather: (overrides?: Partial<WeatherData>) => WeatherData;
  location: (overrides?: Partial<LocationData>) => LocationData;
  form: (overrides?: Partial<FormData>) => FormData;
  apiResponse: (overrides?: Partial<ApiResponse>) => ApiResponse;
  error: (overrides?: Partial<ErrorData>) => ErrorData;
  event: (overrides?: Partial<EventData>) => EventData;
  state: (overrides?: Partial<StateData>) => StateData;
  props: (overrides?: Partial<PropsData>) => PropsData;
  mockFunction: (overrides?: Partial<MockFunctionData>) => MockFunctionData;
  config: (overrides?: Partial<ConfigData>) => ConfigData;
  performance: (overrides?: Partial<PerformanceData>) => PerformanceData;
  accessibility: (overrides?: Partial<AccessibilityData>) => AccessibilityData;
  snapshot: (overrides?: Partial<SnapshotData>) => SnapshotData;
  custom: <T>(template: T, overrides?: Partial<T>) => T;
}

// Test Hook Types
export interface TestHooks {
  useComponent: {
    testMount: <P>(Component: ComponentType<P>, props?: P) => RenderResult;
    testUnmount: <P>(Component: ComponentType<P>, props?: P) => () => void;
    testUpdate: <P>(Component: ComponentType<P>, initialProps?: P, newProps?: P) => () => void;
  };
  useState: {
    testInitialState: <T>(initialState: T) => { current: [T, (value: T) => void] };
    testStateUpdate: <T>(initialState: T, newState: T) => { current: [T, (value: T) => void] };
  };
  useEffect: {
    testEffectMount: (effect: () => void) => { current: void };
    testEffectUpdate: (effect: () => void, deps: any[]) => { current: void };
    testEffectCleanup: (effect: () => void) => () => void;
  };
  useContext: {
    testContextValue: <T>(Context: React.Context<T>, value: T) => { current: T };
  };
  useRef: {
    testRefInit: <T>(initialValue: T) => { current: { current: T } };
    testRefUpdate: <T>(initialValue: T, newValue: T) => { current: { current: T } };
  };
  useCallback: {
    testCallbackCreate: <T extends (...args: any[]) => any>(callback: T, deps: any[]) => { current: T };
    testCallbackUpdate: <T extends (...args: any[]) => any>(callback: T, deps: any[]) => { current: T };
  };
  useMemo: {
    testMemoCreate: <T>(factory: () => T, deps: any[]) => { current: T };
    testMemoUpdate: <T>(factory: () => T, deps: any[]) => { current: T };
  };
  useCustom: {
    testCustomHook: <T extends (...args: any[]) => any>(hook: T, ...args: Parameters<T>) => { current: ReturnType<T> };
    testCustomHookWithProps: <T extends (props: any) => any>(hook: T, props: Parameters<T>[0]) => { current: ReturnType<T> };
  };
  useAsync: {
    testAsyncHook: <T extends (...args: any[]) => Promise<any>>(hook: T, ...args: Parameters<T>) => Promise<{ current: Awaited<ReturnType<T>> }>;
    testAsyncHookWithProps: <T extends (props: any) => Promise<any>>(hook: T, props: Parameters<T>[0]) => Promise<{ current: Awaited<ReturnType<T>> }>;
  };
  useEvent: {
    testEventHandler: <T extends (event: any) => any>(handler: T, event: Parameters<T>[0]) => { current: ReturnType<T> };
    testEventHandlerWithProps: <T extends (props: any, event: any) => any>(handler: T, props: Parameters<T>[0], event: Parameters<T>[1]) => { current: ReturnType<T> };
  };
  useForm: {
    testFormSubmit: <T extends (values: any) => any>(onSubmit: T, values: Parameters<T>[0]) => { current: ReturnType<T> };
    testFormValidation: <T extends (values: any) => any>(validate: T, values: Parameters<T>[0]) => { current: ReturnType<T> };
  };
  useApi: {
    testApiCall: <T extends (...args: any[]) => Promise<any>>(api: T, ...args: Parameters<T>) => Promise<{ current: Awaited<ReturnType<T>> }>;
    testApiCallWithProps: <T extends (props: any) => Promise<any>>(api: T, props: Parameters<T>[0]) => Promise<{ current: Awaited<ReturnType<T>> }>;
  };
}

// Test Pattern Types
export interface TestPatterns {
  testRendering: <P>(Component: ComponentType<P>, props?: P) => Promise<{ container: HTMLElement }>;
  testUserInteraction: <P>(Component: ComponentType<P>, props?: P, interaction?: (user: UserEvent) => Promise<void>) => Promise<void>;
  testFormSubmission: <P>(Component: ComponentType<P>, props?: P, formData?: Record<string, string>) => Promise<void>;
  testErrorHandling: <P>(Component: ComponentType<P>, props?: P, errorMessage?: string) => Promise<void>;
  testLoadingState: <P>(Component: ComponentType<P>, props?: P) => Promise<void>;
  testAccessibility: <P>(Component: ComponentType<P>, props?: P) => Promise<void>;
  testResponsiveDesign: <P>(Component: ComponentType<P>, props?: P, breakpoints?: Record<string, number>) => Promise<void>;
  testKeyboardNavigation: <P>(Component: ComponentType<P>, props?: P) => Promise<void>;
  testDataFetching: <P>(Component: ComponentType<P>, props?: P, mockData?: any) => Promise<void>;
  testStateManagement: <P>(Component: ComponentType<P>, props?: P, initialState?: any, expectedState?: any) => Promise<void>;
  testLifecycle: <P>(Component: ComponentType<P>, props?: P) => Promise<void>;
  testErrorBoundary: <P>(Component: ComponentType<P>, props?: P) => Promise<void>;
  testPerformance: <P>(Component: ComponentType<P>, props?: P) => Promise<void>;
  testI18n: <P>(Component: ComponentType<P>, props?: P, translations?: Record<string, string>) => Promise<void>;
  testThemeSwitching: <P>(Component: ComponentType<P>, props?: P) => Promise<void>;
}

// Test Matcher Types
export interface TestMatchers {
  element: {
    toBeVisible: (element: HTMLElement) => void;
    toBeHidden: (element: HTMLElement) => void;
    toHaveText: (element: HTMLElement, text: string) => void;
    toHaveClass: (element: HTMLElement, className: string) => void;
    toHaveStyle: (element: HTMLElement, style: Record<string, string>) => void;
    toHaveAttribute: (element: HTMLElement, attribute: string, value?: string) => void;
    toHaveRole: (element: HTMLElement, role: string) => void;
    toBeDisabled: (element: HTMLElement) => void;
    toBeEnabled: (element: HTMLElement) => void;
    toBeRequired: (element: HTMLElement) => void;
    toBeChecked: (element: HTMLElement) => void;
    toHaveValue: (element: HTMLElement, value: string) => void;
    toHavePlaceholder: (element: HTMLElement, placeholder: string) => void;
  };
  form: {
    toBeValid: (form: HTMLFormElement) => void;
    toBeInvalid: (form: HTMLFormElement) => void;
    toHaveError: (form: HTMLFormElement, errorMessage: string) => void;
    toHaveNoError: (form: HTMLFormElement) => void;
  };
  api: {
    toHaveBeenCalled: (mock: jest.Mock) => void;
    toHaveBeenCalledWith: (mock: jest.Mock, ...args: any[]) => void;
    toHaveBeenCalledTimes: (mock: jest.Mock, times: number) => void;
    toHaveBeenLastCalledWith: (mock: jest.Mock, ...args: any[]) => void;
  };
  state: {
    toHaveValue: <T>(state: T, key: keyof T, value: any) => void;
    toHaveChanged: <T>(initialState: T, newState: T, key: keyof T) => void;
    toHaveNotChanged: <T>(initialState: T, newState: T, key: keyof T) => void;
  };
  event: {
    toHaveBeenFired: (element: HTMLElement, eventName: string) => void;
    toHaveNotBeenFired: (element: HTMLElement, eventName: string) => void;
  };
  performance: {
    toBeWithinThreshold: (startTime: number, endTime: number, threshold: number) => void;
    toHaveNoMemoryLeak: (initialMemory: number, finalMemory: number) => void;
  };
  accessibility: {
    toHaveLabel: (element: HTMLElement, label: string) => void;
    toHaveDescription: (element: HTMLElement, description: string) => void;
    toBeInTabOrder: (element: HTMLElement) => void;
    toHaveRole: (element: HTMLElement, role: string) => void;
  };
  snapshot: {
    toMatchSnapshot: (element: HTMLElement) => void;
    toMatchInlineSnapshot: (element: HTMLElement) => void;
  };
  custom: {
    toBeWithinRange: (value: number, min: number, max: number) => void;
    toBeOneOf: <T>(value: T, allowedValues: T[]) => void;
    toHaveLength: <T>(array: T[], length: number) => void;
    toContain: <T>(array: T[], item: T) => void;
    toBeSorted: <T>(array: T[], compareFn?: (a: T, b: T) => number) => void;
  };
}

// Test Configuration Types
export interface TestConfig {
  timeouts: {
    default: number;
    long: number;
    short: number;
  };
  retries: {
    default: number;
    max: number;
  };
  intervals: {
    default: number;
    short: number;
    long: number;
  };
  thresholds: {
    performance: number;
    memory: number;
  };
}

// Test Environment Types
export interface TestEnv {
  env: {
    NODE_ENV: string;
    TEST_MODE: boolean;
  };
  setup: () => void;
  teardown: () => void;
}

// Test Helper Types
export interface TestHelpers {
  helpers: {
    waitFor: (condition: () => boolean, timeout?: number) => Promise<void>;
    waitForElement: (selector: string, timeout?: number) => Promise<HTMLElement>;
    waitForElements: (selector: string, count: number, timeout?: number) => Promise<NodeListOf<HTMLElement>>;
  };
}

// Global Test Types
declare global {
  var testUtils: {
    createTestData: TestData;
    testHooks: TestHooks;
    assertions: TestMatchers;
    matchers: TestMatchers;
  };
  var testConfig: TestConfig;
  var testEnv: TestEnv;
  var testHelpers: TestHelpers;
} 