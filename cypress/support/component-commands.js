// Component-specific commands
Cypress.Commands.add('mount', (component, options = {}) => {
  const { props, ...mountOptions } = options;
  return cy.mount(component, {
    ...mountOptions,
    props,
  });
});

// Custom command to check component props
Cypress.Commands.add('hasProps', { prevSubject: true }, (subject, props) => {
  Object.entries(props).forEach(([key, value]) => {
    expect(subject[0].props[key]).to.deep.equal(value);
  });
  return subject;
});

// Custom command to check component state
Cypress.Commands.add('hasState', { prevSubject: true }, (subject, state) => {
  Object.entries(state).forEach(([key, value]) => {
    expect(subject[0].state[key]).to.deep.equal(value);
  });
  return subject;
});

// Custom command to check component context
Cypress.Commands.add('hasContext', { prevSubject: true }, (subject, context) => {
  Object.entries(context).forEach(([key, value]) => {
    expect(subject[0].context[key]).to.deep.equal(value);
  });
  return subject;
});

// Custom command to check component refs
Cypress.Commands.add('hasRefs', { prevSubject: true }, (subject, refs) => {
  Object.entries(refs).forEach(([key, value]) => {
    expect(subject[0].refs[key]).to.deep.equal(value);
  });
  return subject;
});

// Custom command to check component lifecycle methods
Cypress.Commands.add('hasLifecycleMethods', { prevSubject: true }, (subject, methods) => {
  Object.entries(methods).forEach(([key, value]) => {
    expect(subject[0][key]).to.be.a('function');
    if (value) {
      expect(subject[0][key]()).to.deep.equal(value);
    }
  });
  return subject;
});

// Custom command to check component event handlers
Cypress.Commands.add('hasEventHandlers', { prevSubject: true }, (subject, handlers) => {
  Object.entries(handlers).forEach(([key, value]) => {
    expect(subject[0][key]).to.be.a('function');
    if (value) {
      expect(subject[0][key]()).to.deep.equal(value);
    }
  });
  return subject;
});

// Custom command to check component styles
Cypress.Commands.add('hasStyles', { prevSubject: true }, (subject, styles) => {
  Object.entries(styles).forEach(([key, value]) => {
    expect(subject[0].style[key]).to.equal(value);
  });
  return subject;
});

// Custom command to check component classes
Cypress.Commands.add('hasClasses', { prevSubject: true }, (subject, classes) => {
  classes.forEach(className => {
    expect(subject[0].classList.contains(className)).to.be.true;
  });
  return subject;
});

// Custom command to check component attributes
Cypress.Commands.add('hasAttributes', { prevSubject: true }, (subject, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    expect(subject[0].getAttribute(key)).to.equal(value);
  });
  return subject;
});

// Custom command to check component data attributes
Cypress.Commands.add('hasDataAttributes', { prevSubject: true }, (subject, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    expect(subject[0].dataset[key]).to.equal(value);
  });
  return subject;
});

// Custom command to check component aria attributes
Cypress.Commands.add('hasAriaAttributes', { prevSubject: true }, (subject, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    expect(subject[0].getAttribute(`aria-${key}`)).to.equal(value);
  });
  return subject;
});

// Custom command to check component role
Cypress.Commands.add('hasRole', { prevSubject: true }, (subject, role) => {
  expect(subject[0].getAttribute('role')).to.equal(role);
  return subject;
});

// Custom command to check component tabindex
Cypress.Commands.add('hasTabIndex', { prevSubject: true }, (subject, tabindex) => {
  expect(subject[0].getAttribute('tabindex')).to.equal(tabindex);
  return subject;
});

// Custom command to check component contenteditable
Cypress.Commands.add('isContentEditable', { prevSubject: true }, (subject, value) => {
  if (value) {
    expect(subject[0].getAttribute('contenteditable')).to.equal(value);
  } else {
    expect(subject[0].getAttribute('contenteditable')).to.equal('true');
  }
  return subject;
});

// Custom command to check component spellcheck
Cypress.Commands.add('hasSpellcheck', { prevSubject: true }, (subject, value) => {
  if (value) {
    expect(subject[0].getAttribute('spellcheck')).to.equal(value);
  } else {
    expect(subject[0].getAttribute('spellcheck')).to.equal('true');
  }
  return subject;
});

// Custom command to check component autocomplete
Cypress.Commands.add('hasAutocomplete', { prevSubject: true }, (subject, value) => {
  expect(subject[0].getAttribute('autocomplete')).to.equal(value);
  return subject;
});

// Custom command to check component required
Cypress.Commands.add('isRequired', { prevSubject: true }, (subject) => {
  expect(subject[0].hasAttribute('required')).to.be.true;
  return subject;
});

// Custom command to check component readonly
Cypress.Commands.add('isReadonly', { prevSubject: true }, (subject) => {
  expect(subject[0].hasAttribute('readonly')).to.be.true;
  return subject;
});

// Custom command to check component checked
Cypress.Commands.add('isChecked', { prevSubject: true }, (subject) => {
  expect(subject[0].checked).to.be.true;
  return subject;
});

// Custom command to check component selected
Cypress.Commands.add('isSelected', { prevSubject: true }, (subject) => {
  expect(subject[0].selected).to.be.true;
  return subject;
});

// Custom command to check component multiple
Cypress.Commands.add('isMultiple', { prevSubject: true }, (subject) => {
  expect(subject[0].hasAttribute('multiple')).to.be.true;
  return subject;
}); 