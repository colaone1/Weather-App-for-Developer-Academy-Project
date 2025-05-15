import { faker } from '@faker-js/faker';

// Test data factory
export const createTestData = {
  // User data
  user: (overrides = {}) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    role: faker.helpers.arrayElement(['user', 'admin', 'moderator']),
    createdAt: faker.date.past(),
    ...overrides
  }),

  // Weather data
  weather: (overrides = {}) => ({
    id: faker.string.uuid(),
    city: faker.location.city(),
    country: faker.location.country(),
    temperature: faker.number.int({ min: -20, max: 40 }),
    condition: faker.helpers.arrayElement(['sunny', 'cloudy', 'rainy', 'snowy']),
    humidity: faker.number.int({ min: 0, max: 100 }),
    windSpeed: faker.number.int({ min: 0, max: 100 }),
    timestamp: faker.date.recent(),
    ...overrides
  }),

  // Location data
  location: (overrides = {}) => ({
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    accuracy: faker.number.int({ min: 0, max: 100 }),
    timestamp: faker.date.recent(),
    ...overrides
  }),

  // Form data
  form: (overrides = {}) => ({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    confirmPassword: faker.internet.password(),
    ...overrides
  }),

  // API response
  apiResponse: (overrides = {}) => ({
    status: 200,
    data: {},
    message: 'Success',
    timestamp: faker.date.recent(),
    ...overrides
  }),

  // Error data
  error: (overrides = {}) => ({
    code: faker.number.int({ min: 400, max: 599 }),
    message: faker.lorem.sentence(),
    details: faker.lorem.paragraph(),
    timestamp: faker.date.recent(),
    ...overrides
  }),

  // Event data
  event: (overrides = {}) => ({
    type: faker.helpers.arrayElement(['click', 'submit', 'change', 'focus']),
    target: {
      id: faker.string.uuid(),
      name: faker.lorem.word(),
      value: faker.lorem.word()
    },
    timestamp: faker.date.recent(),
    ...overrides
  }),

  // State data
  state: (overrides = {}) => ({
    loading: false,
    error: null,
    data: {},
    timestamp: faker.date.recent(),
    ...overrides
  }),

  // Component props
  props: (overrides = {}) => ({
    id: faker.string.uuid(),
    className: faker.lorem.word(),
    style: {},
    children: null,
    ...overrides
  }),

  // Mock function
  mockFunction: (overrides = {}) => ({
    mockImplementation: jest.fn(),
    mockReturnValue: jest.fn(),
    mockResolvedValue: jest.fn(),
    mockRejectedValue: jest.fn(),
    ...overrides
  }),

  // Test configuration
  config: (overrides = {}) => ({
    timeout: 5000,
    retries: 3,
    interval: 1000,
    ...overrides
  }),

  // Performance metrics
  performance: (overrides = {}) => ({
    startTime: faker.date.recent(),
    endTime: faker.date.recent(),
    duration: faker.number.int({ min: 0, max: 1000 }),
    memory: faker.number.int({ min: 0, max: 1000000 }),
    ...overrides
  }),

  // Accessibility data
  accessibility: (overrides = {}) => ({
    role: faker.helpers.arrayElement(['button', 'link', 'textbox', 'checkbox']),
    label: faker.lorem.word(),
    description: faker.lorem.sentence(),
    tabIndex: faker.number.int({ min: -1, max: 10 }),
    ...overrides
  }),

  // Snapshot data
  snapshot: (overrides = {}) => ({
    id: faker.string.uuid(),
    timestamp: faker.date.recent(),
    data: {},
    ...overrides
  }),

  // Custom data
  custom: (template, overrides = {}) => ({
    ...template,
    ...overrides
  })
};

// Export individual factories
export const {
  user,
  weather,
  location,
  form,
  apiResponse,
  error,
  event,
  state,
  props,
  mockFunction,
  config,
  performance,
  accessibility,
  snapshot,
  custom
} = createTestData; 