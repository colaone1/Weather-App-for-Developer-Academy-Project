module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { 
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript'
      ]
    }]
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.test.jsx',
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/*.config.{js,ts}',
    '!src/**/types.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 10000,
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  maxWorkers: '50%',
  maxConcurrency: 1,
  bail: 1,
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      addFileAttribute: true
    }],
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: './test-results/test-report.html',
      includeFailureMsg: true,
      includeSuiteFailure: true
    }]
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
}; 