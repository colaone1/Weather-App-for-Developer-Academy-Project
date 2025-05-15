// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import global styles
import '../../src/styles/globals.css';

// Import testing library commands
import '@testing-library/cypress/add-commands';

// Import custom commands
import './component-commands';

// Prevent TypeScript from reading file as legacy script
export {}; 